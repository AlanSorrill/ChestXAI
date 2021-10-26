
// out_prediction, out_images_and_similarities = obj.run(fileName)
// outPrediction = {'fileName': fileName, 'diagnosis': out_prediction }
// # outPrediction = "{fileName: '8310923871.png', diagnosis: [[0, 0.85], [1, 0.25], [2, 0.99]]}"
// outSimilarity = {'inputFileName': fileName, 'outputFileNames': out_images_and_similarities}

// # outSimilarity = "{inputFileName: '1980138012.png', outputFileNames: [['190329.png', 0.3,'00010'], 
// # ['819023.png', 0.4, '00000'], ['934.png', 0.3, '10000']]}"
export type MsgType = 'inferenceResponse' | 'inferenceRequest' | 'status' | 'diseaseDefs';
export interface PythonInterfaceMessage {
    msgType: MsgType
}
export interface DiseaseDefsMessage {
    msgType: "diseaseDefs",
    names: string[]
}
export class PythonMessage {
    private static isType<T extends PythonInterfaceMessage>(typeName: MsgType, obj: PythonInterfaceMessage): obj is T{
        return obj.msgType == typeName
    }
    static isInterfaceRequest(obj: PythonInterfaceMessage): obj is InferenceRequest{
        return this.isType('inferenceRequest', obj);
    }
    static isInterfaceResponse(obj: PythonInterfaceMessage): obj is InferenceResponse{
        return this.isType('inferenceResponse', obj);
    }
    static isStatus(obj: PythonInterfaceMessage): obj is PythonStatusMessage{
        return this.isType('status', obj);
    }
    static isDiseaseDefs(obj: PythonInterfaceMessage): obj is DiseaseDefsMessage{
        return this.isType('diseaseDefs', obj);
    }
}
export interface InferenceRequest extends PythonInterfaceMessage {
    msgType: 'inferenceRequest',
    fileName: string
}
export interface InferenceResponse extends PythonInterfaceMessage {
    msgType: 'inferenceResponse'
    fileName: string
    prediction: Array<[string, number]>
    similarity: Array<[string, number, string]>
}
export interface PythonStatusMessage extends PythonInterfaceMessage {
    msgType: 'status'
    message: string
}
export interface UploadResponse {
    success: boolean,
    uploadId: string,
    fileName: string
    //diseaseName, percentage
    diagnosis: [string, number][]
    //filePath, matchPercentage, diseaseName[]
    similarity: [string, number, string[]][]
}
// export interface PredictionResult {
//     fileName: string,
//     diagnosis: Array<[Disease, number]>
// }
// export interface SimilarityResult {
//     inputFileName: string,
//     outputFileNames: Array<[string, number, Disease]>
// }

