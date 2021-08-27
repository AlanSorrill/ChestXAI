export * from '../Common/commonImports'
import { LocalLogger, LogFunction, Logger, LoggerFilterResult, LogLevel, LogLevelMap } from '../Common/Logger';
import { BackendServer } from './BackendServer';
let logger = new Logger();
export { logger, LogLevel, LoggerFilterResult, LocalLogger, LogLevelMap, LogFunction}
export * from './webpackBrowserConfig'

declare global {
    var backend: BackendServer
}