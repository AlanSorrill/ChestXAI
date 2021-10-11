export enum Disease {
    enlargedCardiomediastinum = 0,
    cardiomegaly = 1,
    lungOpacity = 2,
    lungLesion = 3,

}

// out_prediction, out_images_and_similarities = obj.run(fileName)
// outPrediction = {'fileName': fileName, 'diagnosis': out_prediction }
// # outPrediction = "{fileName: '8310923871.png', diagnosis: [[0, 0.85], [1, 0.25], [2, 0.99]]}"
// outSimilarity = {'inputFileName': fileName, 'outputFileNames': out_images_and_similarities}

// # outSimilarity = "{inputFileName: '1980138012.png', outputFileNames: [['190329.png', 0.3,'00010'], 
// # ['819023.png', 0.4, '00000'], ['934.png', 0.3, '10000']]}"
export interface InferenceResponse {
    inputFileName: string,
    diagnosis: Array<[Disease, number]>
}
export interface PredictionResult {
    fileName: string,
    diagnosis: Array<[Disease, number]>
}
export interface SimilarityResult {
    inputFileName: string,
    outputFileNames: Array<[string, number]>
}


let result: InferenceResponse = {
    inputFileName: "193801238.png",
    diagnosis: [[Disease.cardiomegaly,0.2], [1, 0.5], [8, 0.3]]
}