export interface UploadResponse {
    success: boolean,
    uploadId: string,
    fileName: string
    diagnosis: [string, number][]
}
export interface ReferenceImage {
    diagnosis: string[]
    fileName: string
}
export interface Progress {
    task: string, 
    alpha: number// percentage zero to one
}