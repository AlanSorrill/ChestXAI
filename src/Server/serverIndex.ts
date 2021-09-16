import express, { Request, Response } from 'express';
import webpack, { Configuration, Stats, ProgressPlugin } from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import http from 'http'
import path from 'path'
// import favicon from 'serve-favicon'
import {BackendServer, WebSocket, clientWebpackConfig, logger, LogLevel, webpackBuildListener } from './ServerImports'

let log = logger.local('ServerIndex');
log.allowBelowLvl(LogLevel.naughty)
let httpServer: http.Server;
let socketServer: WebSocket.Server
const app = express();
const PORT = 3000;

const compiler = webpack(clientWebpackConfig, (err?: Error, stats?: Stats) => {
    stats.hasErrors
}) as webpack.Compiler;
webpackBuildListener((percentage: number, msg: string, ...args) => {
    console.log(`${(percentage * 100).toFixed(1)}%`, msg, args.join(' '))
})
async function setup() {
    log.info('Initializing...');

    httpServer = http.createServer(app);
    socketServer = new WebSocket.Server({ noServer: true });
    socketServer.on('error', (server: WebSocket.Server, error: Error)=>{
        log.error(`WebSocket Server Error: `,error);
    })
    let rootPath = path.join(__dirname, '/../../');
    let paths = {
        nodeModules: path.join(rootPath, '/node_modules'),
        root: path.join(rootPath, '/public'),
        favIco: path.join(rootPath, '/public/favicon.ico')
    }

    app.use('/node_modules/', express.static(paths.nodeModules));
    app.use('/', express.static(paths.root));

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
        BackendServer.Create(app, httpServer, socketServer).then((csserver: BackendServer)=>{
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