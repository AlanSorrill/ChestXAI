import { LabImageData } from "./CommonImports"
export type Sex = 'Male' | 'Female'
export type ScanDirection = 'Lateral' | 'Frontal'
export enum ScanSide {
    PA = 'PosteriorAnterior',
    AP = 'AnteriorPosterior'
}
export class PatientData {

    id: string
    sex: Sex
    age: number
    scanRecords: ScanRecord[] = []

    constructor(id: string, age: number, sex: Sex) {
        this.id = id;
        this.age = age;
        this.sex = sex;
    }
    toJson() {
        return {
            'id': this.id,
            'sex': this.sex,
            'age': this.age,
            'scanRecords': this.scanRecords.map((record: ScanRecord) => PatientData.stripBackReference(record))
        }
    }

    addScanRecord(rawData: RawScanData) {
        let scanData = PatientData.parseScan(rawData, this);
        this.scanRecords.push(scanData);
        return scanData
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
        out.scanRecords.push(this.parseScan(rawData, out));
        return out;
    }

    static parseScan(rawData: RawScanData, patient: PatientData): ScanRecord {
        let pathParts = this.extractPathParts(rawData);
        let numToBool: (num: number) => boolean = (num: number) => (num == 1);
        return {
            path: pathParts.imgName,
            patientRef: patient,
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
    static stripBackReference(record: ScanRecord) {
        let out = {};
        for (const key in record) {
            if (key != 'patientRef') {
                out[key] = record[key]
            }
        }
        return out;
    }

}
export interface ScanRecord {
    path: string,
    patientRef: PatientData,
    direction: ScanDirection,
    side: ScanSide,
    noFinding: boolean
    enlargedCardiomediastinum: boolean,
    cardiomegaly: boolean,//------------
    lungOpacity: boolean,
    lungLesion: boolean,
    edema: boolean, //---------
    consolidation: boolean, //------------
    pneumonia: boolean,
    atelectasis: boolean,//------------
    pneumothorax: boolean,
    pleuralEffusion: boolean,//------------
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