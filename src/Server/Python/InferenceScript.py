import sys
import json
fileName = sys.argv[1]

##fileName.lower() + "_" + fileName.upper()

#export interface InferenceResponse {
#    inputFileName: string,
#    diagnosis: Array<[Disease, number]>
#}
outInference = {'fileName': fileName, 'diagnosis': [[0, 0.85], [1, 0.25], [2, 0.99]], }
# testOut = "{fileName: '8310923871.png', diagnosis: [[0, 0.85], [1, 0.25], [2, 0.99]]}"

print(json.dumps(outInference))
sys.stdout.flush()