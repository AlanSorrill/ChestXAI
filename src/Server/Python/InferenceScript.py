'''before run the script, there are some other things to do first
1. Put 'train_vecs_pre_none.npz' file into 'models' folder
2. Download the chexpert train images to 'patients' folder if you want to display the retrieved images
3. Make sure you have required packaged installed
    To do this, try following commands if you have Anaconda installed
    1) pip install libauc
    2) GPU+CPU version:'conda install -c pytorch faiss-gpu' 
        or ONLY CPU version: 'conda install -c pytorch faiss-cpu
4. Check the path variables are correct
'''

####*** There are some important changes and notes*** ####
'''
1. The script implemented realizes two functions, both predicting and similarity searching, so the script
will print twice, the first one is predicting result, and the second is similarity result.
2. Since we forgot to display labels of similar images, the script adds it, it's a string that have five bits indicating
five diseases. The example can be found in later code.
3. It's worth mentioning that the script initiates model and loads vectors could cost much time. So in the later version,
we could consider that after initiating model and loading vector, keep the script running. Then the script can
do next prediction and similarity search directly, without initiating the model again.
'''

#export interface InferenceResponse {
#    inputFileName: string,
#    diagnosis: Array<[Disease, number]>
#}

#export interface SimilarityResult {
#    inputFileName: string,
#    outputFileNames: Array<[string, number, string]>
#}

# Five kinds of disease:
# Cardiomegaly(C0)
# Edema(C1)
# Consolidation(C2)
# Atelectasis(C3)
# Pleural Effusion(C4)
import json
import sys
import time
print(json.dumps({
        'msgType': 'status',
        'message': 'Loading Libraries' 
    }) + "\n", flush=True)



import os
from SimilarityClass import SimilaritySearch
from PrototypeClass import PrototypeSearch
from HeatmapClass import HeatmapSearch


image_base_path = './public/patients/' ###To be checked
train_csv_path = './public/patients/train.csv'  ###To be checked
model_vectors_path = './models/'  ###To be checked
prototype_path = './prototypes/'

diseaseList = ['Cardiomegaly', 'Edema', 'Consolidation', 'Atelectasis',  'Pleural Effusion']
if __name__ == '__main__':

    print(json.dumps({
        'msgType': 'status',
        'message': 'loading model from ' + os.path.abspath(train_csv_path)
    }) + "\n")
    sys.stdout.flush()
    print(json.dumps({
        'msgType': 'diseaseDefs',
        'names': diseaseList
    }) + "\n")
    sys.stdout.flush()
    similarity_obj = SimilaritySearch(train_csv_path, image_base_path, model_vectors_path, cuda_or_cpu = 'cpu', selected_cols = diseaseList)
    prototype_obj = PrototypeSearch(prototype_path = prototype_path)
    heatmap_obj = HeatmapSearch(model_path=model_vectors_path, cuda_or_cpu = 'cpu')
    
    print(json.dumps({
        'msgType': 'status',
        'message': 'Awaiting file'
    }) + "\n")
    sys.stdout.flush()
    for line in sys.stdin:
        print(json.dumps({
            'msgType': 'status',
            'message': 'got request ' + line
        }) + "\n")
        sys.stdout.flush()


        request = json.loads(line)

        ######***inferenceRequest****###########
        if request.get('msgType') == 'inferenceRequest':
            out_prediction, out_images_and_similarities = similarity_obj.run(request.get('fileName'))
        #  outPrediction = [['00000', 0.85], ['00010', 0.25], ['00000', 0.99]]"
        # out_images_and_similarities =[['819023.png', 0.4, '00000'], ['934.png', 0.3, '10000']]"
    
            print(json.dumps({
                'msgType': 'inferenceResponse',
                'fileName': request.get('fileName'),
                'prediction': out_prediction,
                'similarity': out_images_and_similarities
            }) + "\n")        
            sys.stdout.flush()

        ######***prototypeRequest****###########
        elif request.get('msgType') == 'prototypeRequest':           
            out_prototypes, out_heatmaps, out_texts = prototype_obj.run(request.get('disease'))
        # out_prototypes = ['190329.png','120422.png','132445.png'] 
        # out_heatmaps = ['heatmap1.png','heatmap2.png','heatmap3.png']

            print(json.dumps({
                'msgType': 'prototypeResponse',
                'disease': request.get('disease'),
                'prototype': out_prototypes,
                'heatmap': out_heatmaps,
                'text': out_texts
                
            }) + "\n")
            sys.stdout.flush()

        ######***heatmapRequest****###########
        elif request.get('msgType') == 'heatmapRequest':           
            out_heatmap = heatmap_obj.run(request.get('disease'), request.get('fileName'))
        # out_heatmap = [320*320], values range from 0 to 255
          
            print(json.dumps({
                'msgType': 'heatmapResponse',
                'fileName': request.get('fileName'),
                'disease':  request.get('disease'),
                'heatmap': out_heatmap.tolist(),##
                'size': 320
 
            }) + "\n")
            sys.stdout.flush()
            # for row in range(320):
            #     outData = '-'.join([str(x) for x in out_heatmap[row].tolist()])
            #     outLine = json.dumps({
            #         'msgType': 'partialHeatmapResponse',
            #         'fileName': request.get('fileName'),
            #         'disease':  request.get('disease'),
            #         'heatmap': outData,##
            #         'size': 320,
            #         'index': row
            #     })
            #     print(outLine + "\n")
            #     sys.stdout.flush()
    
    print(json.dumps({
        'msgType': 'status',
        'message': 'std tunnel closed'
    }) + "\n")