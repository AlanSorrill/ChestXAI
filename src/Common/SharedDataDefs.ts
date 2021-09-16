export interface UploadResponse {
    success: boolean,
    uploadId: string,
}
export interface Progress {
    task: string,
    alpha: number// percentage zero to one
}