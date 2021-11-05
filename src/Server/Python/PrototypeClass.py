import pandas as pd
import numpy as np



class PrototypeSearch(object):
    def __init__(self, prototype_path, num_prototypes = 4):
        self.prototype_path = prototype_path
        self.num_prototypes = num_prototypes


    def run(self, disease):
        out_prototypes = []
        for i in range(self.num_prototypes):
            out_prototypes.append(self.prototype_path+disease+'/prototype_'+str(i)+'.png') 

        return out_prototypes


