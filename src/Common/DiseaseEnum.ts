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
export interface PythonInterfaceMessage {
    msgType: 'inferenceResponse' | 'inferenceRequest' | 'status'
}
export interface InferenceRequest extends PythonInterfaceMessage {
    msgType: 'inferenceRequest',
    fileName: string
}
export interface InferenceResponse extends PythonInterfaceMessage {
    msgType: 'inferenceResponse'
    fileName: string
    prediction: Array<[Disease, number]>
    similarity: Array<[string, number]>
}
export interface PythonStatusMessage extends PythonInterfaceMessage {
    msgType: 'status'
    message: string
}
export interface UploadResponse {
    success: boolean,
    uploadId: string,
    fileName: string
    diagnosis: [Disease, number][]
    similarity: [string, number][]
}
// export interface PredictionResult {
//     fileName: string,
//     diagnosis: Array<[Disease, number]>
// }
// export interface SimilarityResult {
//     inputFileName: string,
//     outputFileNames: Array<[string, number, Disease]>
// }

