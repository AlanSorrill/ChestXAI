import pandas as pd
import numpy as np
import faiss 
import cv2
from libauc.models import DenseNet121

import torch 
from PIL import Image
import torch.nn.functional as F


class PrototypeSearch(object):
    def __init__(self, prototype_path, num_prototypes = 4):
        self.num_prototypes = num_prototypes
        self.heatmap_dict = {}
        
        diseases = ['10000','01000','00100','00010','00001']
        for dis in diseases:
            prototypes = []
            for i in range(self.num_prototypes):
                prototypes.append(cv2.imread(prototype_path+dis+'/prototype-img-heatmap'+str(i)+'.png', 0))
            self.heatmap_dict.update({dis: prototypes})

        self.path = {'10000':['patients/patient02893/study5/view1_frontal.jpg',
                            'patients/patient40569/study10/view1_frontal.jpg',
                            'patients/patient11389/study1/view1_frontal.jpg',
                            'patients/patient50023/study1/view1_frontal.jpg' ],

                    '01000':['patients/patient13903/study39/view1_frontal.jpg',
                            'patients/patient10127/study6/view1_frontal.jpg',
                            'patients/patient23510/study4/view1_frontal.jpg',
                            'patients/patient38365/study6/view1_frontal.jpg' ],

                    '00100':['patients/patient09904/study1/view1_frontal.jpg',
                            'patients/patient22551/study1/view1_frontal.jpg',
                            'patients/patient16025/study5/view1_frontal.jpg',
                            'patients/patient40008/study10/view1_frontal.jpg'],

                    '00010':['patients/patient28531/study9/view1_frontal.jpg',
                            'patients/patient38826/study2/view1_frontal.jpg',
                            'patients/patient36584/study3/view1_frontal.jpg',	
                            'patients/patient35362/study3/view1_frontal.jpg'],

                    '00001':[ 'patients/patient41574/study3/view1_frontal.jpg',   
                            'patients/patient30364/study8/view1_frontal.jpg',  
                            'patients/patient43181/study1/view1_frontal.jpg',   
                            'patients/patient25695/study13/view1_frontal.jpg' ]  
                    }


    def run(self, disease):
        out_prototypes = self.path[disease]
        out_heatmaps = self.heatmap_dict[disease]
        out_texts = []
        for i in range(self.num_prototypes):
            out_texts.append('this is a prototype image, whose id is '+ str(i))

        return out_prototypes, out_heatmaps, out_texts





