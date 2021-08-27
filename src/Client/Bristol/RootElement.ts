

import { BristolBoard, UIElement, UIFrame, CoordType } from "../clientImports";
import { MouseBtnInputEvent } from "./BristolBoard";
import { UIFrameResult, UIFrame_CornerWidthHeight } from "./UIFrame";




// export class CardBristol extends BristolBoard {

//     padding: number = 8;
//     // machine: SlotMachine;
//    // message: SpecialMessage;
//     constructor(containerDivElem: HTMLDivElement, buildRootElement: (brist: CardBristol) => Promise<UIElement>) {
//         super(containerDivElem, buildRootElement as (board: BristolBoard)=> Promise<UIElement>);
//         let ths = this;
//         // this.machine = new SlotMachine('theMachine', new UIFrame_Rect_CornerSized(0, 0, this.width), this);
//         // this.machine.frame.relY = () => (ths.height / 2 - ths.machine.frame.measureHeight() / 2);
//         // this.message = new SpecialMessage('message', ()=>'Happy Birthday Christina!', new UIFrame_Rect_CornerSized(0,0, ths.width, ths.machine.frame.relY), this)
//         // this.addUiElement(this.message)
//         // this.addUiElement(this.machine);

//     }

//     async onInit(): Promise<void> {
//         let ths = this;

//     }
//     // mousePressed(evt: MouseBtnInputEvent) {
//     //     return this.machine.lever.mousePressed(evt);
//     // }

//     // mouseReleased(evt: MouseBtnInputEvent) {
//     //     return this.machine.lever.mouseReleased(evt);
//     // }
//     // mouseDragged(evt: MouseDraggedInputEvent) {
//     //     return this.machine.lever.mouseDragged(evt);
//     // }




// }
export class UI_ChestXAI extends UIElement {
    constructor(brist: BristolBoard<UI_ChestXAI>) {
        super('rootElem', UIFrame.Build({
            x: 0,
            y: 0,
            coordType: CoordType.Absolute,
            width: brist.width,
            height: brist.height
        }), brist);
    }
    mousePressed(evt: MouseBtnInputEvent){
        
        return true;
    }
    mouseReleased(evt: MouseBtnInputEvent){
        
        return true;
    }
    onDrawBackground(frame: UIFrameResult, deltaMs: number) {
        this.brist.fillColor(fColor.purple.accent2);
        this.brist.fillRectFrame(this.frame);
        this.brist.strokeColor(fColor.green.lighten2);
        this.brist.strokeWeight(2);
        this.brist.line(frame.left, frame.top, frame.right, frame.bottom);
    }
}