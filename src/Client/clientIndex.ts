

import { UI_ChestXAI } from "./Bristol/RootElement";
import { UIElement } from "./Bristol/UIElement";
import { FHTML, BristolBoard, UIFrame } from "./clientImports";


let body: FHTML<HTMLBodyElement> = new FHTML<HTMLBodyElement>("body");
let containerDiv: FHTML<HTMLDivElement> = body.createChildDiv('container')
containerDiv.setCss([
    ["width", "100vw"],
    ['height','100vh'],
    ['position','absolute'],
    ['left', '0px'],
    ['top', '0px']
]);






window.mainBristol = new BristolBoard(containerDiv.element, async (brist: BristolBoard<any>)=>{
    return new UI_ChestXAI(brist);
});

