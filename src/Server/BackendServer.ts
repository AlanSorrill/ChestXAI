import { Express, Request, Response } from "express";

import { Socket } from "net";
import * as ChildProcess from "child_process";
import http from 'http'
import Path from 'path'
import fs from 'fs';
import multer from 'multer'
import sharp from 'sharp'
import { LogLevel, csvToJson, logger, PatientData, PythonInterfaceMessage, RawScanData, ScanRecord, WebSocket, UploadResponse, TaskListener, delay, InferenceResponse, urlParse, PythonMessage, DiseaseManager, DiseaseDefinition, HeatmapResponse } from './ServerImports'
import { ServerSession } from "./ServerSession";
import { TSReflection } from "../Common/TypeScriptReflection";
import path from "path";
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

        // switch (originalExtension) {
        //     case 'png':
        //     case 'jpg':
        //     case 'jpeg':
        //         break;
        //     default:
        //     originalExtension = 'error'
        // }
        callback(null, uniqueName(file.originalname));

    }
})
const multerUpload = multer({ storage: storage })


export function uniqueName(originalName: string) {
    const uniqueSuffix = Date.now() + '' + Math.round(Math.random() * 1E9)
    let originalExtension = originalName.split('.').last.toLowerCase();
    return `${uniqueSuffix}.${originalExtension}`;
}
export class BackendServer {
    express: Express;
    httpServer: http.Server;
    socketServer: WebSocket.Server;
    sessions: Map<string, ServerSession> = new Map();
    patients: Map<string, PatientData> = new Map();
    indicies: Map<string, ScanRecord[]> = new Map();
    rawPatientData: unknown[];
    taskListeners: Map<string, TaskListener[]> = new Map();

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
            resp.setHeader('content-type', 'application/json');
            resp.send(JSON.stringify(possibilities));
        })
        app.get('/patients/:patientId/:studyId/:imageName', async (req: Request, resp: Response) => {
            let patientId = req.params.patientId;
            let idNumber: number = Number(patientId.replace('patient', ''));

            ///dual_data/not_backed_up/CheXpert/CheXpert-v1.0/train/patient00001/study1/view1_frontal.jpg
            let fullPath = `/dual_data/not_backed_up/CheXpert/CheXpert-v1.0/${(idNumber < 64541) ? 'train' : 'valid'}/${patientId}/${req.params.studyId}/${req.params.imageName}`
            return backend.serveScaledImage(fullPath, req.query.res !== undefined ? Number(req.query.res) : 1, resp);
        })
        app.get('/prototype/:bitString/:imageName', async (req: Request, resp: Response) => {
            let bitString: string = req.params.bitString;
            let imageName: string = req.params.imageName;
            let fullPath = Path.join(__dirname, `/../../public/prototypes/${bitString}/${imageName}`)
            return backend.serveScaledImage(fullPath, req.query.res !== undefined ? Number(req.query.res) : 1, resp);
        })




        app.get('/reuse', (req: Request, resp: Response) => {
            if (typeof req.query.upload != 'string') {
                resp.statusMessage = 'no upload name given';
                resp.sendStatus(404);
            }

            log.info(`Recieved reuse GET ${req.query.upload}`);
            return backend.handleInferenceRequest(req.query.upload as string, resp);

        })
        app.get('/diseaseDefs', (req: Request, resp: Response) => {
            resp.send(DiseaseManager.toJson())
        })
        app.post('/upload', multerUpload.single('file'), function (req: Request, resp: Response, next) {
            log.info(`Recieved upload POST ${req.file.filename}`);
            return backend.handleInferenceRequest(req.file.filename, resp);

        });

        httpServer.on('upgrade', (request: http.IncomingMessage, socket: Socket, head: Buffer) => {
            try {
                socketServer.handleUpgrade(request, socket, head, (client: WebSocket, request: http.IncomingMessage) => {
                    let url: urlParse = urlParse(request.url, true);
                    backend.onSocketUpgrade(url, request, client);
                })
            } catch (err) {

                log.error(`Failed to upgrade to socket:`, err)
            }
        })
        return backend;
    }
    async serveScaledImage(fullPath: string, scaleAlpha: number, resp: Response) {
        let uidName = fullPath.replaceAll('/', '-').replaceAll('.', '_');
        let lastDot = uidName.lastIndexOf('_');
        uidName = uidName.substr(0, lastDot) + '.' + uidName.substr(lastDot + fullPath.length)

        if (fs.existsSync(fullPath)) {
            if (scaleAlpha != 1) {
                let scale = Number(scaleAlpha) / 100;
                log.info(`Requested image at ${scale}: ${fullPath}`);
                let scaledPath = path.join(__dirname, `/../../generated/scaledImages/${scaleAlpha}_${uidName}`)
                if (fs.existsSync(scaledPath)) {
                    resp.sendFile(scaledPath);
                    return;
                } else {
                    let originalImage = sharp(fullPath);
                    let metadata = await originalImage.metadata();

                    await originalImage.resize(Math.round(metadata.width * scale), Math.round(metadata.height * scale)).toFile(scaledPath);
                    resp.sendFile(scaledPath);
                    return;
                }
            }

            log.info(`Sending ${fullPath}`)
            resp.sendFile(fullPath);
        } else {
            resp.sendStatus(404).send('File not found');
        }
    }

    handleInferenceRequest(fileName: string, resp: Response) {
        //TODO handle bad uploads

        // let sesh = new ServerSession(;
        // backend.sessions.set(sesh.id, sesh);
        let respPayload: UploadResponse = {
            success: true,
            fileName: fileName,
            uploadId: fileName.split('.').first,
            diagnosis: null,
            similarity: null
        }
        resp.set('Connection', 'keep-alive');
        backend.updateTask(respPayload.uploadId, 'Diagnosing', 0);
        let fullPath = Path.join(__dirname, `/../../uploads/${fileName}`)
        log.info(`Running inference on ${fullPath}`);

        backend.runInferance(fullPath).then((data: InferenceResponse) => {
            respPayload.diagnosis = [];
            for (let i = 0; i < data.prediction.length; i++) {
                respPayload.diagnosis.push([DiseaseManager.getDiseaseByBitStringId(data.prediction[i][0]), data.prediction[i][1]])
            }
            respPayload.diagnosis = respPayload.diagnosis.sort((a: [DiseaseDefinition, number], b: [DiseaseDefinition, number]) => b[1] - a[1])
            respPayload.similarity = [];
            let val: [string, number, string];
            for (let i = 0; i < data.similarity.length; i++) {
                val = data.similarity[i];
                respPayload.similarity.push([val[0], val[1], DiseaseManager.bitStringToDiseases(val[2])])
            }
            resp.send(JSON.stringify(respPayload));

        })
    }
    updateTask(taskId: string, message: string, progAlpha: number) {
        let taskListeners = this.taskListeners.get(taskId);
        if (typeof taskListeners == 'undefined' || taskListeners == null || taskListeners.length == 0) {
            return;
        }
        for (let i = 0; i < taskListeners.length; i++) {
            taskListeners[i].onUpdate(message, progAlpha);
        }
    }
    completeTask(taskId: string) {
        let taskListeners = this.taskListeners.get(taskId);
        if (typeof taskListeners == 'undefined' || taskListeners == null || taskListeners.length == 0) {
            return;
        }
        for (let i = 0; i < taskListeners.length; i++) {
            taskListeners[i].onComplete();
        }
    }
    addTaskListener(taskId: string, listener: TaskListener) {
        if (!this.taskListeners.has(taskId)) {
            this.taskListeners.set(taskId, []);
        }
        this.taskListeners.get(taskId).push(listener)
    }
    async makeDiagnosis(uploadId: string, listener: TaskListener) {
        if (listener != null) {
            this.addTaskListener(uploadId, listener)
        }
        let possibilities = ["cardiomegaly", "edema", "consolidation", "atelectasis", "pleuralEffusion"]
        let out: [string, number][] = [];
        for (let i = 0; i < possibilities.length; i++) {
            if (Math.random() < 0.5) {
                out.push([possibilities[i], Math.random()]);
            }
            await delay(1000 / possibilities.length);
            this.updateTask(uploadId, 'Diagnosing', i / possibilities.length);
        }
        this.completeTask(uploadId);
        return out;
    }
    onSocketUpgrade(url: urlParse, request: http.IncomingMessage, client: WebSocket) {
        let seshId = url.query.seshId;
        if (this.sessions.has(seshId)) {
            this.sessions.get(seshId).registerSocket(client);
        } else {
            log.info('Generating session id')
            seshId = ServerSession.getFreshId();
            let freshSesh = new ServerSession(seshId);
            freshSesh.registerSocket(client);
            this.sessions.set(seshId, freshSesh);
            // client.send({
            //     status: 404,
            //     message: `No session found for ${seshId}`
            // })
            // client.close();
        }
    }

    protected constructor(app: Express, httpServer: http.Server, socketServer: WebSocket.Server) {
        this.express = app;
        this.httpServer = httpServer;
        this.socketServer = socketServer;
    }


    inferenceWaiters: Map<string, (resp: InferenceResponse) => void> = new Map();
    async runInferance(fullFilePath: string): Promise<InferenceResponse> {
        let ths = this;

        return new Promise((acc, rej) => {
            if (fs.existsSync(fullFilePath)) {
                let startTime = Date.now();
                ths.inferenceWaiters.set(fullFilePath, (resp: InferenceResponse) => {
                    let endTime = Date.now();
                    log.info(`Inference took ${endTime - startTime}ms ---------------------`)
                    acc(resp);
                })
                ths.sendToPython(JSON.stringify({
                    'msgType': 'inferenceRequest',
                    'fileName': fullFilePath
                }))
            } else {
                log.error(`Unknown file path ${fullFilePath}`)
                return rej(`No such file ${fullFilePath}`);
            }
        })

    }
    heatmapWaiters: Map<string, (resp: HeatmapResponse) => void> = new Map();
    //DiseaseDefinition or bitstringid
    async generateHeatmap(fullFilePath: string, disease: DiseaseDefinition) {

        let ths = this;
        return new Promise((acc, rej) => {
            if (fs.existsSync(fullFilePath)) {
                let startTime = Date.now();
                ths.heatmapWaiters.set(fullFilePath, (resp: HeatmapResponse) => {
                    let endTime = Date.now();
                    log.info(`Heatmap took ${endTime - startTime}ms ---------------------`)
                    acc(resp);
                })
            } else {
                log.error(`Unknown file path ${fullFilePath}`)
                return rej(`No such file ${fullFilePath}`);
            }
        });

    }

    python: ChildProcess.ChildProcessWithoutNullStreams
    sendToPython(data: string) {
        this.python.stdin.write(data + "\n", 'utf8');

    }
    recievePythonMsg() {

    }
    //diseaseNames: string[] = null;
    startPython() {
        let ths = this;
        let pathToScript = Path.join(__dirname, `../../src/Server/Python/InferenceScript.py`)
        log.info(`Starting ${pathToScript}`)


        //let python = ChildProcess.spawn('python', params)
        let command = `conda run -n cheX python -u ${pathToScript}`;
        // this.python = ChildProcess.spawn(`bash -lc "${command}"`, {
        //     shell: true,
        //     stdio: ['pipe', 'pipe', 'pipe'],

        // });

        this.python = ChildProcess.spawn('python', [pathToScript]);
        // this.python = ChildProcess.spawn('conda', [`run`, `-n`, `cheX`, `python ${pathToScript}`]);

        // this.python = ChildProcess.exec(command, (error: ChildProcess.ExecException, stdout: string, stderr: string)=>{
        //     console.log('error',error);
        //     console.log('stdout',stdout);
        //     console.log('stderror',stderr);
        // })

        this.python.stdout.on('data', (data) => {
            let lines = data.toString('utf8').split('\n');
            log.info(`Python:`, lines);

            for (let i = 0; i < lines.length; i++) {
                if (lines[i] == '' || lines[i] == 'flusher') {
                    continue;
                }
                try {
                    let message: PythonInterfaceMessage = JSON.parse(lines[i]) as any;

                    if (PythonMessage.isStatus(message)) {
                        console.log(`Python status: ${message.message}`)
                    } else if (PythonMessage.isDiseaseDefs(message)) {
                        console.log(`Got disease list: ${message.names.join(', ')}`)
                        DiseaseManager.initDiseases(message.names);

                    } else if (PythonMessage.isInterfaceResponse(message)) {
                        console.log(`Got inference response for ${message.fileName}`);
                        if (ths.inferenceWaiters.has(message.fileName)) {
                            ths.inferenceWaiters.get(message.fileName)(message)
                        } else {
                            log.error(`No waiters for ${message.fileName}`)
                        }
                    } else {
                        console.log(`Unknown python message ${Object.keys(message)}`)
                    }
                } catch (err) {
                    log.error(`Error parsing python message: ${err}`)
                }
            }
            //console.log(data.toString('utf8'));
        })

        this.python.stderr.on('data', (error) => {
            log.error('Python:', error.toString('utf8'));
        })
        this.python.on('spawn', () => {
            log.info('Python childprocess spawned');
        })
        this.python.stdin.on('drain', () => {
            log.info('Draining python.stdin')
        })

        this.python.on('disconnect', () => {
            log.info('python child process disconnected')
        })
        this.python.on('exit', (code, signal) => {
            log.error(`PYTHON EXITED: ${code} with signal ${signal}`);
        })
        // let python = this.runPython(, (response: string) => {
        //     try {
        //        // let data = JSON.parse(response);
        //         console.log(`Python: ${response}`);
        //       //  acc(data);
        //     } catch (err) {
        //         rej(err);
        //     }
        // }, fileName);
        this.python.stdin.setDefaultEncoding('utf8');
        // this.python.stdin.write('test\n');

    }

    async onInitialized() {
        this.startPython();
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