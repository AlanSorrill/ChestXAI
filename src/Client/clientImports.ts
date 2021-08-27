export * from '../Common/commonImports'
import { LocalLogger, LogFunction, Logger, LoggerFilterResult, LogLevel, LogLevelMap } from '../Common/Logger';
let logger = new Logger();
export { logger, LogLevel, LoggerFilterResult, LocalLogger, LogLevelMap, LogFunction}
export * from "./FHTML/FHTML";
export * from "./Bristol/BristolBoard";


import { FColor, FColorDirectory, FColorSwath } from './FHTML/FColor'
let fColor = new FColorDirectory();
export { FColor, fColor, FColorSwath, FColorDirectory }
window.fColor = fColor;
export * from "./Bristol/UIFrame";
import { BristolBoard } from "./Bristol/BristolBoard";
import { UI_ChestXAI } from './Bristol/RootElement';
export * from "./Bristol/RootElement";
export * from "./Bristol/UIElement";

 
declare global {
    var mainBristol: BristolBoard<UI_ChestXAI>
    var fColor: FColorDirectory
}