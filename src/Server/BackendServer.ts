import { Express, Request, Response } from "express";
import http from 'http'
import Path from 'path'
import fs from 'fs';

import { LogLevel, csvToJson, logger, PatientData, RawScanData, ScanRecord } from './serverImports'

let log = logger.local('BackendServer');
log.allowBelowLvl(LogLevel.silly);
export class BackendServer {
    express: Express;
    httpServer: http.Server;
    patients: Map<string, PatientData> = new Map();
    indicies: Map<string, ScanRecord[]> = new Map();
    rawPatientData: unknown[];

    static async Create(app: Express, httpServer: http.Server): Promise<BackendServer> {
        let out = new BackendServer(app, httpServer);
        await out.onInitialized();
        app.get('/similar', (req: Request, resp: Response) => {
            console.log(req.query);
            let possibilities = [];
            for (const key in req.query) {
                if (out.indicies.has(key)) {
                    possibilities.pushAll(out.indicies.get(key).map((record: ScanRecord) => PatientData.stripBackReference(record)));
                }
            }
            resp.setHeader('content-type','application/json');
            resp.send(JSON.stringify(possibilities));
        })
        return out;
    }

    protected constructor(app: Express, httpServer: http.Server) {
        this.express = app;
        this.httpServer = httpServer;
    }

    async onInitialized() {
        let directoryPath = Path.join(__dirname, '/../../public/patients');//`${__dirname}/../../public/patients`;
        console.log(`Loading patients from ${directoryPath}`);
        try {
            let ths = this;
            let csvFilePath = Path.join(directoryPath, 'valid.csv');
            let data = csvToJson<RawScanData>(await fs.promises.readFile(csvFilePath, 'utf-8'));
            data.forEach((rawData: RawScanData) => {
                ths.addScan(rawData);
            })
            this.rawPatientData = data;
            log.info(`Loaded ${this.patients.size} patients`)


            // let patientDirectories = await fs.promises.readdir(directoryPath)
            // for (let i = 0; i < patientDirectories.length; i++) {
            //     let imgFolder = `${directoryPath}/${patientDirectories[i]}/study1`;
            //     if (fs.existsSync(imgFolder)) {
            //         let imageFiles = await fs.promises.readdir(imgFolder)
            //         // log.info(`${patientDirectories[i]} has ${imageFiles.length} images`);
            //         this.addPatient(patientDirectories[i], imageFiles);
            //     }
            // }

        } catch (err) {
            console.error(err);
        }
    }

    private addScan(rawData: RawScanData) {
        let idParts = PatientData.extractPathParts(rawData);
        if (idParts == null) {
            return;
        }
        let record: ScanRecord;
        if (this.patients.has(idParts.id)) {
            record = this.patients.get(idParts.id).addScanRecord(rawData)
        } else {
            let patient = PatientData.parsePatient(rawData)
            this.patients.set(idParts.id, patient)
            record = patient.scanRecords[0];
        }


        for (const key in record) {
            if (typeof record[key] == 'boolean' && record[key] == true) {
                if (!this.indicies.has(key)) {
                    this.indicies.set(key, []);
                }
                this.indicies.get(key).push(record);
            }
        }



    }


}



// {
//     noFinding: ScanRecord[],
//     enlargedCardiomediastinum: ScanRecord[],
//     cardiomegaly: ScanRecord[],
//     lungOpacity: ScanRecord[],
//     lungLesion: ScanRecord[],
//     edema: ScanRecord[],
//     consolidation: ScanRecord[],
//     pneumonia: ScanRecord[],
//     atelectasis: ScanRecord[],
//     pneumothorax: ScanRecord[],
//     pleuralEffusion: ScanRecord[],
//     pleuralOther: ScanRecord[],
//     fracture: ScanRecord[],
//     supportDevices: ScanRecord[]
// } = {
//         noFinding: [],
//         enlargedCardiomediastinum: [],
//         cardiomegaly: [],
//         lungOpacity: [],
//         lungLesion: [],
//         edema: [],
//         consolidation: [],
//         pneumonia: [],
//         atelectasis: [],
//         pneumothorax: [],
//         pleuralEffusion: [],
//         pleuralOther: [],
//         fracture: [],
//         supportDevices: []
//     }