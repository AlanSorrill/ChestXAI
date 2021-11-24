import express, { Request, Response } from 'express';
import webpack, { Configuration, Stats, ProgressPlugin } from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import * as ChildProcess from "child_process";
import http from 'http'
import path from 'path'
import fs from 'fs'
// import favicon from 'serve-favicon'
import { BackendServer, WebSocket, clientWebpackConfig, logger, LogLevel, webpackBuildListener } from './ServerImports'

let log = logger.local('ServerIndex');
log.allowBelowLvl(LogLevel.naughty)
let httpServer: http.Server;
let socketServer: WebSocket.Server
const app = express();
const PORT = (process.env.PORT || '3000')
app.set("PORT", PORT);


const compiler = webpack(clientWebpackConfig, (err?: Error, stats?: Stats) => {
    stats.hasErrors
    console.log(`Webpack Build Error`, err)
}) as webpack.Compiler;
webpackBuildListener((percentage: number, msg: string, ...args) => {
    console.log(`${(percentage * 100).toFixed(1)}%`, msg, args.join(' '))
})
async function setup() {
    //log.info(`Checking if port ${PORT} is bound`);
   // let processes: ProcessInfo[] = await getProcessesOnPort();
    log.info('Initializing...');

    httpServer = http.createServer(app);
    socketServer = new WebSocket.Server({ noServer: true });
    socketServer.on('error', (server: WebSocket.Server, error: Error) => {
        log.error(`WebSocket Server Error: `, error);
    })
    let rootPath = path.join(__dirname, '/../../');
    let paths = {
        nodeModules: path.join(rootPath, '/node_modules'),
        root: path.join(rootPath, '/public'),
        favIco: path.join(rootPath, '/public/favicon.ico'),
        userContent: path.join(rootPath, '/uploads')
    }

    app.use('/node_modules/', express.static(paths.nodeModules));
    app.use('/', express.static(paths.root));
    app.use('/userContent/', express.static(paths.userContent))
    app.get('/userContent/:fileName', (req: Request, resp: Response) => {
        let filePath = path.join(paths.userContent, req.params.fileName);
        if (fs.existsSync(filePath)) {
            resp.sendFile(filePath);
        } else {
            resp.sendStatus(404);
        }
    })
    //app.use(favicon(paths.favIco))







    log.info('Initializing Webpack DevMiddleware')
    let webpackOptions: webpackDevMiddleware.Options = {
        publicPath: '/wp/'
    }
    let webpackMiddle = webpackDevMiddleware(compiler, webpackOptions);

    webpackMiddle.waitUntilValid(() => {
        // completeWebpackStatusStep('WebpackDevMiddleware');
        // webpackStatus.complete = true;
        log.info(`Webpack Initialized`);
        BackendServer.Create(app, httpServer, socketServer).then((csserver: BackendServer) => {
            global.backend = csserver;
        });



    })

    app.use(webpackMiddle)
    app.use(webpackHotMiddleware(compiler))
    httpServer.listen(PORT, () => {
        log.info('Server started at http://localhost:' + PORT);

    });

    app.on('error', onError);
    //console.log(config)
}
type ProcessInfo = {command: string, PID: number, user: string}
async function getProcessesOnPort(): Promise<Array<ProcessInfo>>{
    return new Promise((acc,rej)=>{
        // let data = ChildProcess.execFileSync(`lsof -i :3000`);
        // console.log(data);
        ChildProcess.exec(`lsof -i`, (err, data)=>{
            data.split('\n').forEach((value)=>console.log(value))
            console.log(data,err);
            acc(null)
        })
        // let lsof = ChildProcess.spawn(`lsof`, [`-i TCP:3000`]);
        // lsof.stdout.on("data", data => {
        //     console.log(`stdout: ${data}`);
        // });
        
        // lsof.stderr.on("data", data => {
        //     console.log(`stderr: ${data}`);
        // });
        
        // lsof.on('error', (error) => {
        //     console.log(`error: ${error.message}`);
        // });
        
        // lsof.on("close", code => {
        //     console.log(`child process exited with code ${code}`);
        // });
    });
}


function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof PORT === 'string' ?
        'Pipe ' + PORT :
        'Port ' + PORT;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

setup();
export { app, PORT, compiler }
