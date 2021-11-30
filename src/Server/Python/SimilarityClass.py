import pandas as pd
import numpy as np
import faiss 
import cv2
from libauc.models import DenseNet121

import torch 
from PIL import Image
import torch.nn.functional as F

class SimilaritySearch(object):
    def __init__(self, train_csv_path , image_base_path, model_vectors_path, cuda_or_cpu = 'cpu',topK=10, 
                image_size=320, use_frontal=True,
                selected_cols=['Cardiomegaly', 'Edema', 'Consolidation', 'Atelectasis',  'Pleural Effusion'],
                ):
        
        ###load data
        self.df = pd.read_csv(train_csv_path)
        self.df['Path'] = self.df['Path'].str.replace('CheXpert-v1.0-small/', '')
        self.df['Path'] = self.df['Path'].str.replace('CheXpert-v1.0/', '')
        self.df['Path'] = self.df['Path'].str.replace('train/', '')  ####to be change
        if use_frontal:
            self.df = self.df[self.df['Frontal/Lateral'] == 'Frontal']       
            
        self.images_list =  [path for path in self.df['Path'].tolist()]### 

        self.train_vecs = np.load(model_vectors_path + 'train_vecs_pre_none.npz')['vectors'].astype('float32')
        self.train_truth = np.load(model_vectors_path + 'train_truth_pre_none_updated.npy').astype('int')
        
        index = faiss.index_factory(1024, "Flat")
        # index = faiss.IndexFlatIP(1024)
        if cuda_or_cpu == 'cuda':
            res = faiss.StandardGpuResources()
            self.index = faiss.index_cpu_to_gpu(res, 0, index)
        else:
            self.index = index
        self.index.train(self.train_vecs)
        self.index.add(self.train_vecs)
        
        self.topK = topK
            
        # proccess missing values 
        for col in selected_cols:
            if col in ['Edema', 'Atelectasis']:
                self.df[col].replace(-1, 1, inplace=True)  
                self.df[col].fillna(0, inplace=True) 
            elif col in ['Cardiomegaly','Consolidation',  'Pleural Effusion']:
                self.df[col].replace(-1, 0, inplace=True) 
                self.df[col].fillna(0, inplace=True)
            else:
                self.df[col].fillna(0, inplace=True)
                
        self.image_size = image_size
        
        ###load model
        self.device = torch.device(cuda_or_cpu)
        self.model = DenseNet121(pretrained=False, last_activation='sigmoid', activations='relu', num_classes=5)
        self.model.to(self.device)
        if cuda_or_cpu == 'cuda':
            state_dict = torch.load(model_vectors_path + 'second_stage_none.pth')#map_location={'cuda:0':'cuda:3'}
        else:
            state_dict = torch.load(model_vectors_path + 'second_stage_none.pth',map_location='cpu')#map_location={'cuda:0':'cuda:3'}       
        
        self.model.load_state_dict(state_dict, strict=True)
        self.model.eval()
        
                
     
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

    def postprocess(self, y_pred, Distance, S_index):
        
        ###prediction
        out_prediction = []
        str_array = np.zeros((len(y_pred),len(y_pred)), dtype = int)
        for disease, psb in enumerate(y_pred):
            str_array[disease, disease] = 1
            str_disease = ''.join(str(d) for d in str_array[disease])
            out_prediction.append([str_disease, round(psb.astype(float),4)])
        ###images and similarities   
        out_images_and_similarities = []
        for i, idx in enumerate(S_index):
            path = self.images_list[idx]
            # similarity = 1 /np.exp(Distance[i]/48)
            similarity = 1 /np.exp(np.sqrt(Distance[i])/27.28)
            # similarity = np.clip(np.power(Distance[i]/1024, 1/5), 0, 0.9999)
            label = ''.join(str(l) for l in self.train_truth[idx])
            out_images_and_similarities.append([path, round(similarity.astype(float), 4),label])
        
        return out_prediction, out_images_and_similarities
        

    def predict_and_search(self, image):
        image = image.to(self.device)        
        with torch.no_grad():
            features = self.model.features(image)
            out = F.relu(features, inplace=True) #F.relu(features, inplace=True)
            out = F.adaptive_avg_pool2d(out, (1, 1))
            vector = torch.flatten(out, 1)
            out = self.model.classifier(vector)
            out = self.model.sigmoid(out)
            
            
            query_vector = vector.detach().cpu().numpy()
            y_pred = out.detach().cpu().numpy()
                
                
        Distance, S_index = self.index.search(query_vector, self.topK)
        out_prediction, out_images_and_simiarities = self.postprocess(y_pred[0], Distance[0], S_index[0])

        return out_prediction, out_images_and_simiarities
    
    def run(self, image_path):
        
        image = self.preprocess_image(image_path)
        out_prediction, out_images_and_similarities = self.predict_and_search(image)
        
                
        return out_prediction, out_images_and_similarities
