import { LabImageData } from "./commonImports"

export class PatientData {
    id: string
    
    scanImageURLs: string[]

    constructor(id: string, scanImageURLs: string[]){
        this.id = id;
        this.scanImageURLs = scanImageURLs;
    }
}