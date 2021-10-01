import { Disease } from "./CommonImports";

export interface UploadResponse {
    success: boolean,
    uploadId: string,
    fileName: string
    diagnosis: [number, number][]
    similarity: [string,number][]
}
export interface ReferenceImage {
    diagnosis: string[]
    fileName: string
}
export interface Progress {
    task: string, 
    alpha: number// percentage zero to one
}