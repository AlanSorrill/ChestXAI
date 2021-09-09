export * from '../Common/commonImports'
import { LocalLogger, LogFunction, Logger, LoggerFilterResult, LogLevel, LogLevelMap } from '../Common/Logger';
let logger = new Logger();
export { logger, LogLevel, LoggerFilterResult, LocalLogger, LogLevelMap, LogFunction}
import urlParse from 'url-parse';
export {urlParse}
export * from "./URLManager";
export * from "./RestClient";
export * from "./FHTML/FHTML";
export * from "./Bristol/BristolBoard";


import { FColor, FColorDirectory, FColorSwath } from './FHTML/FColor'
let fColor = new FColorDirectory();
export { FColor, fColor, FColorSwath, FColorDirectory }
window.fColor = fColor;



export * from "./Bristol/UIFrame";
import { BristolBoard } from "./Bristol/BristolBoard";
export * from "./Bristol/UIElement";
import { UI_ChestXAI } from './Bristol/RootElement';
import { UrlManager } from './URLManager';
import { Rest } from './RestClient';
export * from "./Bristol/RootElement";
export * from "./Elements/TestDot";
export * from "./Elements/UIPage";
export * from "./Elements/pages/UIP_Gallary";
export * from "./Elements/pages/UIP_Upload";
export * from "./Elements/UI_ImageElement";

export * from "./Elements/Lung";


declare global {
    var mainBristol: BristolBoard<UI_ChestXAI>
    var fColor: FColorDirectory
    var urlManager: UrlManager
    
    var classes: {
        Rest: typeof Rest
    }
}

//Allow client console to access static classes inside webpack
window.classes = {Rest: Rest};