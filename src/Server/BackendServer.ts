import { Express } from "express";
import http from 'http'
import Path from 'path'

import fs from 'fs';
import { csvToJson, logger, PatientData, RawScanData } from './serverImports'
import { LogLevel } from "../Common/Logger";
let log = logger.local('BackendServer');
log.allowBelowLvl(LogLevel.silly);
export class BackendServer {
    express: Express;
    httpServer: http.Server;
    patients: Map<string, PatientData> = new Map();
    rawPatientData: unknown[];
    protected constructor(app: Express, httpServer: http.Server) {
        this.express = app;
        this.httpServer = httpServer;
    }
    async onInitialized() {
        let directoryPath = `${__dirname}/../../public/patients`;
        console.log(`Loading patients from ${directoryPath}`);
        try {
            let ths = this;
            let csvFilePath = Path.join(directoryPath, 'valid.csv');
            let data = csvToJson<RawScanData>(await fs.promises.readFile(csvFilePath, 'utf-8'));
            data.forEach((rawData: RawScanData) => {
                ths.addPatient(rawData);
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

    private addPatient(rawData: RawScanData) {
        let idParts = PatientData.extractPathParts(rawData);
        if(idParts == null){
            return;
        }
        if(this.patients.has(idParts.id)){
            this.patients.get(idParts.id).addScanRecord(rawData)
        } else {
            this.patients.set(idParts.id, PatientData.parsePatient(rawData))
        }
        
        
        
    }
    static async Create(app: Express, httpServer: http.Server): Promise<BackendServer> {
        let out = new BackendServer(app, httpServer);
        await out.onInitialized();
        return out;
    }

}
