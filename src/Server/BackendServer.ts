import { Express } from "express";
import http from 'http'
import Path from 'path'

import fs from 'fs';
import { logger, PatientData } from './serverImports'
import { LogLevel } from "../Common/Logger";
let log = logger.local('BackendServer');
log.allowBelowLvl(LogLevel.silly);
export class BackendServer {
    express: Express;
    httpServer: http.Server;
    patients: PatientData[] = []
    protected constructor(app: Express, httpServer: http.Server) {
        this.express = app;
        this.httpServer = httpServer;
    }
    async onInitialized() {
        let directoryPath = `${__dirname}/../../public/patients`;
        console.log(`Loading patients from ${directoryPath}`);
        try {
            let patientDirectories = await fs.promises.readdir(directoryPath)
            // for (let i = 0; i < patientDirectories.length; i++) {
            //     let imgFolder = `${directoryPath}/${patientDirectories[i]}/study1`;
            //     if (fs.existsSync(imgFolder)) {
            //         let imageFiles = await fs.promises.readdir(imgFolder)
            //         log.info(`${patientDirectories[i]} has ${imageFiles.length} images`);
            //         this.addPatient(patientDirectories[i], imageFiles);
            //     }
            // }
        } catch (err) {
            console.error(err);
        }
    }
    private addPatient(id: string, imageNames: string[]) {
        let urls: string[] = imageNames.map((value: string, index: number) => (`public/patients/${id}/study1/${value}`))
        let out = new PatientData(id, urls);
        this.patients.push(out);
        return out;
    }
    static async Create(app: Express, httpServer: http.Server): Promise<BackendServer> {
        let out = new BackendServer(app, httpServer);
        await out.onInitialized();
        return out;
    }

}
