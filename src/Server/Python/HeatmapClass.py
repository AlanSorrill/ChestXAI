import pandas as pd
import numpy as np
import faiss 
import cv2
from libauc.models import DenseNet121

import torch 
from PIL import Image
import torch.nn.functional as F


class HeatmapSearch(object):
    def __init__(self, model_path, cuda_or_cpu = 'cpu', image_size=320):
               
        self.image_size = image_size
        ###load model
        self.device = torch.device(cuda_or_cpu)
        self.model = DenseNet121(pretrained=False, last_activation='sigmoid', activations='relu', num_classes=5)
        self.model.to(self.device)
        if cuda_or_cpu == 'cuda':
            state_dict = torch.load(model_path + 'second_stage_none.pth')#map_location={'cuda:0':'cuda:3'}
        else:
            state_dict = torch.load(model_path + 'second_stage_none.pth',map_location='cpu')#map_location={'cuda:0':'cuda:3'}       
        
        self.model.load_state_dict(state_dict, strict=True)
        self.model.eval()       

        #####disease weight dict
        self.weight_dict = {}
        diseases = ['10000','01000','00100','00010','00001']
        for i in range(len(diseases)):
            self.weight_dict[diseases[i]] = self.model.classifier.weight.data[i].detach().cpu().numpy().reshape((-1,1,1))

    def preprocess_image(self, image_path):
        image = cv2.imread(image_path, 0)
        image = Image.fromarray(image)

        image = np.array(image)
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
        
        # resize and normalize; e.g., ToTensor()
        image = cv2.resize(image, dsize=(self.image_size, self.image_size), interpolation=cv2.INTER_LINEAR)  
        image = image/255.0
        __mean__ = np.array([[[0.485, 0.456, 0.406]]])
        __std__ =  np.array([[[0.229, 0.224, 0.225]  ]]) 
        image = (image-__mean__)/__std__
        image = image.transpose((2, 0, 1)).astype(np.float32)
        image = torch.from_numpy(image).unsqueeze(0)
        #image = torch.from_numpy(image).float().permute(2, 0, 1).unsqueeze(0)

        return image

    def run(self, disease, image_path):
        image = self.preprocess_image(image_path)
        image = image.to(self.device)     
           
        with torch.no_grad():
            features = self.model.features(image)
            heatmap = (features.data.detach().cpu().numpy().squeeze(0)*self.weight_dict[disease]).sum(axis = 0)

        upsampled= cv2.resize(heatmap, dsize=(self.image_size, self.image_size), interpolation=cv2.INTER_CUBIC)

        rescaled = upsampled - np.amin(upsampled)
        rescaled = rescaled / np.amax(rescaled)

        return np.uint8(255*rescaled)