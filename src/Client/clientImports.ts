
export * from "../Common/CommonImports";
export * from 'bristolboard'

export * from "./URLManager";
export * from "./RestClient";



import { FColor, FColorDirectory, FColorSwath } from 'bristolboard'
let fColor = new FColorDirectory();
export { FColor, fColor, FColorSwath, FColorDirectory }
window.fColor = fColor;



import { UI_ChestXAI } from './Elements/RootElement';
import { UrlManager } from './URLManager';
import { Socker } from './RestClient';
import { BristolBoard } from "bristolboard";

export * from './ClientSession'

export * from "./Elements/RootElement";
export * from "./Elements/TestDot";
export * from "./Elements/Button";
export * from "./Elements/ProgressBar";

export * from "./Elements/pages/UIP_Gallary";
export * from "./Elements/pages/UIP_Upload";
export * from "./Elements/UI_ImageElement";

export * from "./Elements/Lung";


declare global {
    var mainBristol: BristolBoard<UI_ChestXAI>
    var fColor: FColorDirectory
    var urlManager: UrlManager
    
    var classes: {
        Rest: typeof Socker
    }
}

//Allow client console to access static classes inside webpack
window.classes = {Rest: Socker};