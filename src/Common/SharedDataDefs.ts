export interface UploadResponse {
    success: boolean,
    seshId: string,
}
export interface Progress {
    task: string,
    alpha: number// percentage zero to one
}