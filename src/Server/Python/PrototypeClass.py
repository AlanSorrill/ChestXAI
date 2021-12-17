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
        self.prototype_path = prototype_path
        self.num_prototypes = num_prototypes

        self.path = {'10000':['patient02893/study5/view1_frontal.jpg',
                            'patient40569/study10/view1_frontal.jpg',
                            'patient11389/study1/view1_frontal.jpg',
                            'patient50023/study1/view1_frontal.jpg' ],

                    '01000':['patient13903/study39/view1_frontal.jpg',
                            'patient10127/study6/view1_frontal.jpg',
                            'patient23510/study4/view1_frontal.jpg',
                            'patient38365/study6/view1_frontal.jpg' ],

                    '00100':['patient09904/study1/view1_frontal.jpg',
                            'patient22551/study1/view1_frontal.jpg',
                            'patient16025/study5/view1_frontal.jpg',
                            'patient40008/study10/view1_frontal.jpg'],

                    '00010':['patient28531/study9/view1_frontal.jpg',
                            'patient38826/study2/view1_frontal.jpg',
                            'patient36584/study3/view1_frontal.jpg',	
                            'patient35362/study3/view1_frontal.jpg'],

                    '00001':[ 'patient41574/study3/view1_frontal.jpg',   
                            'patient30364/study8/view1_frontal.jpg',  
                            'patient43181/study1/view1_frontal.jpg',   
                            'patient25695/study13/view1_frontal.jpg' ]  
                    }


    def run(self, disease):
        out_prototypes = self.path[disease]
        out_heatmaps = []
        out_texts = []
        for i in range(self.num_prototypes):
            out_heatmaps.append(self.prototype_path+disease+'/prototype-img-heatmap'+str(i)+'.png') 
            out_texts.append('this is a prototype image, whose id is '+ str(i))

        return out_prototypes, out_heatmaps, out_texts





