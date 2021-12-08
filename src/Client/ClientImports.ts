
export * from "../Common/CommonImports";
export * from 'bristolboard'

export * from "./RestClient";



import { BristolBoard, FColor, FColorDirectory, FColorSwath, UrlManager } from 'bristolboard'
let fColor = new FColorDirectory();
export { FColor, fColor, FColorSwath, FColorDirectory }
window.fColor = fColor;



import { UI_ChestXAI } from './Elements/RootElement';

import { Socker } from './RestClient';
import { ClientSession } from './ClientSession';
import { ImageEditor } from "./ImageEditing";


export * from './ClientSession'
export * from './ImageEditing'
export * from "./Elements/MoveableImage";
export * from "./Elements/RootElement";
export * from "./Elements/TestDot";
export * from "./Elements/Button";
export * from "./Elements/UISimilarity";
export * from "./Elements/ProgressBar";
export * from './Elements/XRayImage'
export * from "./Elements/pages/UIP_Gallary";
export * from "./Elements/pages/UIP_Upload";
export * from "./Elements/pages/UIP_Loading";
export * from "./Elements/UI_ImageElement";

export * from "./Elements/ResultCard";
export * from "./Elements/Lung";

export type MainBristol = BristolBoard<UI_ChestXAI>;

declare global {
    var mainBristol: BristolBoard<UI_ChestXAI>
    var fColor: FColorDirectory
    var urlManager: UrlManager
    var session: ClientSession
    var showDebug: (visible?: boolean) => void
    var classes: {
        Rest: typeof Socker
        ImageEditor: typeof ImageEditor

    }
}
window.showDebug = (visible: boolean = true)=>{
    window.mainBristol.debuggerFlags.debugUIFrame = visible;
    urlManager.set('debugUIFrames', visible, false)
}
//Allow client console to access static classes inside webpack
window.classes = { Rest: Socker, ImageEditor: ImageEditor };