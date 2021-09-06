import { Express, Request, Response } from "express";
import { Socket } from "net";
import http from 'http'
import Path from 'path'
import fs from 'fs';
import multer from 'multer'
import { LogLevel, csvToJson, logger, PatientData, RawScanData, ScanRecord, WebSocket, urlParse, UploadResponse } from './ServerImports'
import { ServerSession } from "./ServerSession";
let log = logger.local('BackendServer');
log.allowBelowLvl(LogLevel.silly);

if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads')
    log.info(`Created uploads directory in ${fs.realpathSync('./uploads')}`)

}
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads')
    },
    filename: function (req, file, callback) {
        const uniqueSuffix = Date.now() + '' + Math.round(Math.random() * 1E9)
        let originalExtension = file.originalname.split('.').last.toLowerCase();
        // switch (originalExtension) {
        //     case 'png':
        //     case 'jpg':
        //     case 'jpeg':
        //         break;
        //     default:
        //     originalExtension = 'error'
        // }
        callback(null, `${uniqueSuffix}.${originalExtension}`);
    }
})
const multerUpload = multer({ storage: storage })



export class BackendServer {
    express: Express;
    httpServer: http.Server;
    socketServer: WebSocket.Server;
    sessions: Map<string, ServerSession> = new Map();
    patients: Map<string, PatientData> = new Map();
    indicies: Map<string, ScanRecord[]> = new Map();
    rawPatientData: unknown[];

    static async Create(app: Express, httpServer: http.Server, socketServer: WebSocket.Server): Promise<BackendServer> {
        let backend = new BackendServer(app, httpServer, socketServer);
        await backend.onInitialized();
        app.get('/similar', (req: Request, resp: Response) => {
            // log.info(req.query);
            let possibilities = [];
            for (const key in req.query) {
                if (backend.indicies.has(key)) {
                    possibilities.pushAll(backend.indicies.get(key).map((record: ScanRecord) => PatientData.stripBackReference(record)));
                }
            }
            resp.send(JSON.stringify(possibilities));
        })

        app.post('/upload', multerUpload.single('file'), function (req, res, next) {
            let content = req.file;

            let uploadFolderList = fs.readdirSync('./uploads');

            log.info(`Recieved upload POST ${req.file.filename}`);
            //TODO handle bad uploads

            let sesh = new ServerSession(req.file.filename.split('.').first);
            backend.sessions.set(sesh.id, sesh);
            let respPayload: UploadResponse = {
                success: true,
                seshId: sesh.id
            }
            res.send(JSON.stringify(respPayload))
            // log.info('uploads', uploadFolderList)

            // req.body will hold the text fields, if there were any
        })

        httpServer.on('upgrade', (request: http.IncomingMessage, socket: Socket, head: Buffer) => {
            socketServer.handleUpgrade(request, socket, head, (client: WebSocket, request: http.IncomingMessage) => {
                let url: urlParse = urlParse(request.url, true);
                backend.onSocketUpgrade(url, request, client);
            })
        })
        return backend;
    }
    onSocketUpgrade(url: urlParse, request: http.IncomingMessage, client: WebSocket) {

    }

    protected constructor(app: Express, httpServer: http.Server, socketServer: WebSocket.Server) {
        this.express = app;
        this.httpServer = httpServer;
        this.socketServer = socketServer;
    }

    async onInitialized() {
        let directoryPath = Path.join(__dirname, '/../../public/patients');//`${__dirname}/../../public/patients`;
        log.info(`Loading patients from ${directoryPath}`);
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