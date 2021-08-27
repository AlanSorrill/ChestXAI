import express, { Request, Response } from 'express';
import webpack, { Configuration, Stats, ProgressPlugin } from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import http from 'http'
import path from 'path'
import favicon from 'serve-favicon'
import { clientWebpackConfig, logger, LogLevel, webpackBuildListener } from './serverImports'
import { BackendServer } from './BackendServer';
let log = logger.local('ServerIndex');
let httpServer: http.Server;
const app = express();
const PORT = 3000;

const compiler = webpack(clientWebpackConfig, (err?: Error, stats?: Stats) => {
    stats.hasErrors
}) as webpack.Compiler;
webpackBuildListener((percentage: number, msg: string, ...args) => {
    console.log(`${(percentage * 100).toFixed(1)}%`, msg, args)
})

async function setup() {
    log.info('Initializing...');

    httpServer = http.createServer(app);


    app.use('/node_modules/', express.static(path.join(__dirname, '/../../../node_modules/')));
    app.use('/', express.static(path.join(__dirname, '/../../../public/')));
    // app.use('/editor', express.static(path.join(__dirname, '/../../../public/editor.html')));
    //app.use(favicon(path.join(__dirname, '/../../public/favicon.ico')))

    log.info('Initializing CryptoRouter')

    const csserver = await BackendServer.Create(app, httpServer);

    // let cryptoRouter = express.Router();
    // app.get('/scripts', function (req: Request, res: Response) {
    //     let authToken: string = (req.query.token ?? null) as string;
    //     if (authToken == null) {
    //         return res.status(401).send('Plz add a valid ?token= to query')
    //     }
    //     return firebaseAdminAuth.verifyIdToken(authToken).then((decodedIDToken: firebaseAdmin.auth.DecodedIdToken) => {
    //         let descriptions: R_CremaScriptDescription[] = csserver.executor.listEditableScripts(decodedIDToken.uid);
    //         res.send(descriptions);
    //     })
    // });
    // app.use('/rest', cryptoRouter);;


    //await cryptoServer

    // let munchRef = munchServer;
    global.backend = csserver;
    // (global as any).session = csserver;


    // (cryptoRouter as any).server = csserver;
    // let router = await cryptoRouter(app, httpServer);
    // app.use('/crypto', router)
    // completeWebpackStatusStep('CryptoRouter')


    log.info('Initializing Webpack DevMiddleware')
    let webpackOptions: webpackDevMiddleware.Options = {
        publicPath: '/wp/'
    }
    let webpackMiddle = webpackDevMiddleware(compiler, webpackOptions);

    webpackMiddle.waitUntilValid(() => {
        log.info(`Webpack middleware valid`);

    })
    app.use(webpackMiddle)
    app.use(webpackHotMiddleware(compiler))
    httpServer.listen(PORT, () => {
        log.info('Server started at http://localhost:' + PORT);

    });

    app.use((req: Request, res: Response, next)=>{
        log.error(req.url);
    })
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

    // handle specific listen errors with friendly messages
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

//console.log('Initializing Server')
setup();
export { app, PORT, compiler }