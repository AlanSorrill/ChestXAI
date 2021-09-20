export enum Disease {
    enlargedCardiomediastinum = 0,
    cardiomegaly = 1,
    lungOpacity = 2,
    lungLesion = 3,

}

export interface InferenceResponse {
    inputFileName: string,
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