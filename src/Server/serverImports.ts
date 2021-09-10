export * from '../Common/CommonImports'

// import { LocalLogger, LogFunction, Logger, LoggerFilterResult, LogLevel, LogLevelMap } from '../Common/Logger';
// let logger = new Logger();
// export { logger, LogLevel, LoggerFilterResult, LocalLogger, LogLevelMap, LogFunction}
import WebSocket from 'ws';
import { Logger } from 'bristolboard/lib/CommonImports';
let logger = new Logger();
export { logger }
export {WebSocket}
import { BackendServer } from './BackendServer';
export * from './BackendServer'
export * from './webpackBrowserConfig'

declare global {
    var backend: BackendServer
}