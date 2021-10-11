'''before run the script, there are some other things to do first
1. Download the chexpert train images to 'patients' folder, or the script can't retrieve images
2. Make sure you have required packaged installed
    To do this, try following commands if you have Anaconda installed
    1) pip install libauc
    2) pip3 install torch torchvision 
    3) GPU+CPU version:'conda install -c pytorch faiss-gpu' 
        or ONLY CPU version: 'conda install -c pytorch faiss-cpu
3. Check the path variables are correct
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

import sys
import json
from SimilarityClass import SimilaritySearch


image_base_path = '../../../public/patients/' ###To be checked
train_csv_path = '../../../public/patients/train.csv'
model_vectors_path = '../../../models/'


if __name__ == '__main__':

    fileName = sys.argv[1]

    obj = SimilaritySearch(train_csv_path, image_base_path, model_vectors_path, cuda_or_cpu = 'cpu')

    out_prediction, out_images_and_similarities = obj.run(fileName)
    outPrediction = {'fileName': fileName, 'diagnosis': out_prediction }
    # outPrediction = "{fileName: '8310923871.png', diagnosis: [[0, 0.85], [1, 0.25], [2, 0.99]]}"
    outSimilarity = {'inputFileName': fileName, 'outputFileNames': out_images_and_similarities}

    # outSimilarity = "{inputFileName: '1980138012.png', outputFileNames: [['190329.png', 0.3,'00010'], 
    # ['819023.png', 0.4, '00000'], ['934.png', 0.3, '10000']]}"


    print(json.dumps(outPrediction))
    print(json.dumps(outSimilarity))
    sys.stdout.flush()