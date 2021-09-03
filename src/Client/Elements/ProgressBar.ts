import {
    evalOptionalFunc, optFunc, UIFrameDescription_CornerWidthHeight,
    BristolFontFamily, BristolHAlign, BristolVAlign, UIElement, UIFrameResult,
    UIFrame_CornerWidthHeight, UI_ChestXAI, BristolBoard, FColor, optTransform, MouseState, evalOptionalTransfrom
} from "../clientImports";


export class UIProgressBar extends UIElement {
    static uidCount = 0;

    foregroundColor: optFunc<FColor> = fColor.red.base; 
    onClick: () => void;
    mouseState: MouseState = MouseState.Gone;
    progress: optFunc<number>;
    constructor(progress: optFunc<number>, uiFrame: UIFrame_CornerWidthHeight | UIFrameDescription_CornerWidthHeight, brist: BristolBoard<UI_ChestXAI>) {
        super(`progress${UIProgressBar.uidCount++}`, uiFrame, brist);
        this.progress = progress
    }
    
    onDrawBackground(frame: UIFrameResult, deltaMs: number) {
        this.brist.fillColor(evalOptionalFunc(this.foregroundColor, fColor.green.lighten2));
        this.brist.rect(frame.left, frame.top, frame.width * evalOptionalFunc(this.progress, 0), frame.height);
        
        this.brist.ctx.beginPath();
    }
   
    // onDrawForeground(frame: UIFrameResult, deltaMs: number) {
    //     this.setupFont(frame);
    //     this.brist.text(evalOptionalFunc(this.text), frame.centerX, frame.centerY);
    // }
    // mouseMoved(event: MouseInputEvent) {
    //     return true;
    // }
    // mousePressed(evt: MouseBtnInputEvent) {
    //     this.mouseState = MouseState.Pressed;
    //     this.onClick();
    //     return true;
    // }
    // mouseReleased(evt: MouseBtnInputEvent) {
    //     this.mouseState = this.isMouseTarget ? MouseState.Over : MouseState.Gone;
    //     return true;
    // }
    // mouseEnter(evt: MouseInputEvent) {
    //     this.mouseState = MouseState.Over;
    //     return true;
    // }
    // mouseExit(evt: MouseInputEvent) {
    //     this.mouseState = MouseState.Gone;
    //     return true;
    // }

}