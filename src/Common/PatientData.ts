import { LabImageData } from "./commonImports"
export type Sex = 'Male' | 'Female'
export type ScanDirection = 'Lateral' | 'Frontal'
export enum ScanSide {
    PA = 'PosteriorAnterior',
    AP = 'AnteriorPosterior'
}
export class PatientData {
    addScanRecord(rawData: RawScanData) {
        this.scanRecords.push(PatientData.parseScan(rawData))
    }
    id: string
    sex: Sex
    age: number
    scanRecords: ScanRecord[] = []

    constructor(id: string, age: number, sex: Sex) {
        this.id = id;
        this.age = age;
        this.sex = sex;
    }
    static extractPathParts(rawData: RawScanData): { id: string, imgName: string } {
        let pathParts = rawData.path.split('/');
        while (pathParts.length > 0 && !pathParts[0].includes('patient')) {
            pathParts.shift();
        }
        if (pathParts.length == 0) {
            return null;
        }
        let out = {
            id: pathParts[0],
            imgName: ''
        }
        pathParts.shift();
        out.imgName = pathParts.join('/');
        return out;
    }
    static parsePatient(rawData: RawScanData): PatientData {
        let pathParts = this.extractPathParts(rawData);

        let out = new PatientData(pathParts.id, rawData.age, rawData.sex)
        out.scanRecords.push(this.parseScan(rawData))
        return out;
    }
    static parseScan(rawData: RawScanData): ScanRecord {
        let pathParts = this.extractPathParts(rawData);
        let numToBool: (num: number) => boolean = (num: number) => (num == 1);
        return {
            path: pathParts.imgName,
            direction: rawData.frontalSlashLateral,
            side: rawData.aPSlashPA == 'AP' ? ScanSide.AP : ScanSide.PA,
            noFinding: numToBool(rawData.noFinding),
            enlargedCardiomediastinum: numToBool(rawData.enlargedCardiomediastinum),
            cardiomegaly: numToBool(rawData.cardiomegaly),
            lungOpacity: numToBool(rawData.lungOpacity),
            lungLesion: numToBool(rawData.lungLesion),
            edema: numToBool(rawData.edema),
            consolidation: numToBool(rawData.consolidation),
            pneumonia: numToBool(rawData.pneumonia),
            atelectasis: numToBool(rawData.atelectasis),
            pneumothorax: numToBool(rawData.pneumothorax),
            pleuralEffusion: numToBool(rawData.pleuralEffusion),
            pleuralOther: numToBool(rawData.pleuralOther),
            fracture: numToBool(rawData.fracture),
            supportDevices: numToBool(rawData.supportDevices)
        }
    }
}
export interface ScanRecord {
    path: string,
    direction: ScanDirection,
    side: ScanSide,
    noFinding: boolean
    enlargedCardiomediastinum: boolean,
    cardiomegaly: boolean,
    lungOpacity: boolean,
    lungLesion: boolean,
    edema: boolean,
    consolidation: boolean,
    pneumonia: boolean,
    atelectasis: boolean,
    pneumothorax: boolean,
    pleuralEffusion: boolean,
    pleuralOther: boolean,
    fracture: boolean,
    supportDevices: boolean
}
export interface RawScanData {
    path: string;//'CheXpert-v1.0-small/valid/patient64541/study1/view1_frontal.jpg', 
    sex: Sex,
    age: number,
    frontalSlashLateral: ScanDirection,
    aPSlashPA: 'AP' | 'PA',
    noFinding: number,
    enlargedCardiomediastinum: number,
    cardiomegaly: number,
    lungOpacity: number,
    lungLesion: number,
    edema: number,
    consolidation: number,
    pneumonia: number,
    atelectasis: number,
    pneumothorax: number,
    pleuralEffusion: number,
    pleuralOther: number,
    fracture: number,
    supportDevices: number
}