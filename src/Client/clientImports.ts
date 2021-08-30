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
export * from "./Bristol/UIElement";
import { UI_ChestXAI } from './Bristol/RootElement';
export * from "./Bristol/RootElement";
export * from "./Elements/TestDot";
export * from "./Elements/UI_ImageElement";

export * from "./Elements/Lung";

 
declare global {
    var mainBristol: BristolBoard<UI_ChestXAI>
    var fColor: FColorDirectory
}