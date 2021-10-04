import {UIElement, UI_ChestXAI, FHTML, BristolBoard, UIFrame, ClientSession } from "./ClientImports";
import { UrlManager } from "./URLManager";


let body: FHTML<HTMLBodyElement> = new FHTML<HTMLBodyElement>("body");
let containerDiv: FHTML<HTMLDivElement> = body.createChildDiv('container')
containerDiv.setCss([
    ["width", "100vw"],
    ['height','100vh'],
    ['position','absolute'],
    ['left', '0px'],
    ['top', '0px']
]);






window.urlManager = new UrlManager();

window.session = new ClientSession(window.urlManager.get('seshId', null));
window.mainBristol = new BristolBoard(containerDiv.element, async (brist: BristolBoard<any>)=>{
    let rootElement = new UI_ChestXAI(brist);
    urlManager.setListener(rootElement);
    rootElement.onValueSet('page', 'upload')
    return rootElement;
});
mainBristol.debuggerFlags.uiFrameOutlines = urlManager.get('debugUIFrames', false);