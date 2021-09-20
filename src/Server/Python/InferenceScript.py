import sys
fileName = sys.argv[1]

##fileName.lower() + "_" + fileName.upper()

#export interface InferenceResponse {
#    inputFileName: string,
#    diagnosis: Array<[Disease, number]>
#}

testOut = "{fileName: '8310923871.png', diagnosis: [[0, 0.85], [1, 0.25], [2, 0.99]]}"

print(testOut)
sys.stdout.flush()