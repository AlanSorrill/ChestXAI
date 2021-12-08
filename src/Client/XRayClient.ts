import { XRay } from "./ClientImports";

export class XRayClient extends XRay {
    originalImage: HTMLImageElement | null = null
    get isLoaded(): boolean {
        return this.originalImage != null;
    }
}