export interface UploadResponse {
    success: boolean,
    uploadId: string,
    fileName: string
    diagnosis: string[]
}
export interface Progress {
    task: string,
    alpha: number// percentage zero to one
}