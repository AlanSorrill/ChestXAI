import sys
import json
fileName = sys.argv[1]

#export interface SimilarityResult {
#    inputFileName: string,
#    outputFileNames: Array<[string, number]>
#}
out = {'inputFileName': fileName, 'outputFileNames': [['patient00001/study1/view1_frontal.jpg', 0.3], 
['patient00003/study1/view1_frontal.jpg', 0.4]], }

# testOut = "{inputFileName: '1980138012.png', outputFileNames: [['190329.png', 0.3], ['819023.png', 0.4], ['934.png', 0.3]]}"
##fileName.lower() + "_" + fileName.upper()



print(json.dumps(out))
sys.stdout.flush()