

import { UIP_Gallary_V0, UICorner, UIP_Upload_V0, Lung, UrlDataType, TestDot, UIFrameResult, MouseBtnInputEvent, BristolBoard, UIElement, UIFrame, CoordType, UrlListener, logger, KeyboardInputEvent, MouseDraggedInputEvent, MouseInputEvent, MouseMovedInputEvent, MousePinchedInputEvent, MouseScrolledInputEvent } from "../ClientImports";




let log = logger.local('RootElement');



// export class CardBristol extends BristolBoard {

//     padding: number = 8;
//     // machine: SlotMachine;
//    // message: SpecialMessage;
//     constructor(containerDivElem: HTMLDivElement, buildRootElement: (brist: CardBristol) => Promise<UIElement>) {
//         super(containerDivElem, buildRootElement as (board: BristolBoard)=> Promise<UIElement>);
//         let ths = this;
//         // this.machine = new SlotMachine('theMachine', new UIFrame_CornerWidthHeight(0, 0, this.width), this);
//         // this.machine.frame.relY = () => (ths.height / 2 - ths.machine.frame.measureHeight() / 2);
//         // this.message = new SpecialMessage('message', ()=>'Happy Birthday Christina!', new UIFrame_CornerWidthHeight(0,0, ths.width, ths.machine.frame.relY), this)
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

export class UI_ChestXAI extends UIElement implements UrlListener {
   
    currentPage: UIElement = null
    pageTypes: { upload: (typeof UIP_Upload_V0)[]; gallary: (typeof UIP_Gallary_V0)[]; };



    constructor(brist: BristolBoard<UI_ChestXAI>) {
        super('rootElem', UIFrame.Build({
            x: 0,
            y: 0,
            coordType: CoordType.Absolute,
            width: () => brist.width,
            height: () => brist.height
        }), brist);
        let ths = this
        // let lung = new Lung({
        //     x: () => (ths.frame.result.width / 2),
        //     y: () => (ths.frame.result.height / 2),
        //     measureCorner: UICorner.center,
        //     width: 800, height: 800
        // }, this.brist);
        // this.addChild(lung);
        this.pageTypes = {
            upload: [UIP_Upload_V0],
            gallary: [UIP_Gallary_V0]
        }
    }
    setPage(name: string, version: number = 0) {
        this.currentPage?.removeFromParent();
        let construct = this.pageTypes[name][version]
        let ths = this;
        this.currentPage = new construct(`page`, UIFrame.Build({
            x: 0,
            y: 0,
            width: () => ths.frame.measureWidth(),
            height: () => ths.frame.measureHeight()
        }), this.brist);
        this.addChild(this.currentPage);
        return this.currentPage;
    }
    onValueSet(key: string, value: UrlDataType): void {

        this.setPage(urlManager.page, urlManager.version);
    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {
    }
    mousePressed(evt: MouseBtnInputEvent): boolean {
        return false;
    }
    mouseReleased(evt: MouseBtnInputEvent): boolean {
        return false;
    }
    mouseEnter(evt: MouseInputEvent): boolean {
        return false;
    }
    mouseExit(evt: MouseInputEvent): boolean {
        return false;
    }
    mouseMoved(evt: MouseMovedInputEvent): boolean {
        return false;
    }
    shouldDragLock(event: MouseBtnInputEvent): boolean {
        return false;
    }
    mouseDragged(evt: MouseDraggedInputEvent): boolean {
        return false;
    }
    mousePinched(evt: MousePinchedInputEvent): boolean {
        return false;
    }
    mouseWheel(delta: MouseScrolledInputEvent): boolean {
        return false;
    }
    keyPressed(evt: KeyboardInputEvent): boolean {
        return false;
    }
    keyReleased(evt: KeyboardInputEvent): boolean {
        return false;
    }
    // mousePressed(evt: MouseBtnInputEvent) {
    //     this.addChild(new TestDot(UIFrame.Build({ x: evt.x, y: evt.y, radius: 10 }), this.brist, fColor.green.accent1));
    //     return true;
    // }
    // mouseReleased(evt: MouseBtnInputEvent) {

    //     return true;
    // }
    onDrawBackground(frame: UIFrameResult, deltaMs: number) {
        this.brist.fillColor(fColor.darkMode[0]);
        this.brist.rectFrame(this.frame, false, true);
        this.brist.ctx.beginPath();
        // this.brist.strokeColor(fColor.green.lighten2);
        // this.brist.strokeWeight(2);
        // this.brist.line(frame.left, frame.top, frame.right, frame.bottom);
    }
}