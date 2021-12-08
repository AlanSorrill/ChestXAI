
export abstract class XRay {
    originalUrl: string
    diseasePrediciton: Array<[bitString: string, percent: number]> = null
   
    protected constructor(originalUrl: string, diseasePrediction: Array<[bitString: string, percent: number]>) {
        this.originalUrl = originalUrl;
        this.diseasePrediciton = diseasePrediction;
    }

    
}