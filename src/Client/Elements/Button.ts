
import {
    evalOptionalFunc, optFunc, UIFrameDescription_CornerWidthHeight,
    BristolFontFamily, BristolHAlign, BristolVAlign, UIElement, UIFrameResult,
    UIFrame_CornerWidthHeight, UI_ChestXAI, BristolBoard, FColor, optTransform, MouseState, evalOptionalTransfrom,  MouseInputEvent, KeyboardInputEvent, MouseScrolledInputEvent
} from "../ClientImports";


// export class UI_Button extends UIElement {
   
    
//     paddingVertical: optFunc<number> = 32;
//     paddingHorizontal: optFunc<number> = 64;
//     text: optFunc<string>;
//     textSize: optFunc<number> = 200;
//     fontFamily: optFunc<BristolFontFamily>
//     backgroundColor: optTransform<MouseState,FColor> = fColor.red.base;
//     onClick: ()=>void;
//     mouseState: MouseState = MouseState.Gone;
//     frame: UIFrame_CornerWidthHeight
//     constructor(text: optFunc<string>, uiFrame: UIFrame_CornerWidthHeight | UIFrameDescription_CornerWidthHeight, brist: BristolBoard<UI_ChestXAI>) {
//         super(UIElement.createUID('btn'), uiFrame, brist);
//         this.text = text;
//     }
   
//     autoPadding(textSizeToHeight: number = 0.25, textSizeToWidth: number = 0.6){
//         this.paddingVertical = ()=>(evalOptionalFunc(this.textSize, 24) * textSizeToHeight);
//         this.paddingHorizontal = ()=>(evalOptionalFunc(this.textSize, 24) * textSizeToWidth);
//     }
//     autoWidth() {
//         let ths = this;
//         (this.frame as UIFrame_CornerWidthHeight).description.width = () => {
//             ths.setupFont(ths.frame.result);
//             return ths.brist.ctx.measureText(evalOptionalFunc(this.text)).width + evalOptionalFunc(this.paddingHorizontal) * 2;
//         }
//         return this;
//     }
//     autoHeight() {
//         let ths = this;
//         (this.frame as UIFrame_CornerWidthHeight).description.height = () => {
//             ths.setupFont(ths.frame.result);
//             let textMetrics = ths.brist.ctx.measureText(evalOptionalFunc(this.text))
//             return textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent + evalOptionalFunc(this.paddingVertical) * 2;
//         }
//         return this;
//     }
//     onDrawBackground(frame: UIFrameResult, deltaMs: number) {
//         this.brist.fillColor(evalOptionalTransfrom(this.backgroundColor, this.mouseState));
//         this.brist.ctx.beginPath();
//         this.brist.rectFrame(frame, false, true);
//         this.brist.ctx.beginPath();

//     }
//     setupFont(frame: UIFrameResult) {
//         this.brist.fillColor(fColor.lightText[1]);
//         this.brist.textAlign(BristolHAlign.Center, BristolVAlign.Middle);
//         this.brist.fontFamily(evalOptionalFunc(this.fontFamily, BristolFontFamily.Verdana));
//         this.brist.textSize(evalOptionalFunc(this.textSize, 24));
//     }
//     onDrawForeground(frame: UIFrameResult, deltaMs: number) {
//         this.setupFont(frame);
//         this.brist.text(evalOptionalFunc(this.text), frame.centerX, frame.centerY);
//     }
//     mouseMoved(event: MouseInputEvent) {
//         return true;
//     }
//     mousePressed(evt: MouseBtnInputEvent){
//         this.mouseState = MouseState.Pressed;
//         this.onClick();
//         return true;
//     }
//      mouseReleased(evt: { start: RawPointerData; end: RawPointerData; timeDown: number; }){
//         this.mouseState = this.isMouseTarget ? MouseState.Over : MouseState.Gone;
//         return true;
//     }
//     mouseEnter(evt: MouseInputEvent){
//         this.mouseState = MouseState.Over;
//         return true;
//     }
//     mouseExit(evt: MouseInputEvent){
//         this.mouseState = MouseState.Gone;
//         return true;
//     }

   
   
//     shouldDragLock(event: MouseBtnInputEvent): boolean {
//         return false;
//     }
//     mouseDragged(evt: MouseDraggedInputEvent): boolean {
//         return false;
//     }
//     mousePinched(evt: MousePinchedInputEvent): boolean {
//         return false;
//     }
//     mouseWheel(delta: MouseScrolledInputEvent): boolean {
//         return false;
//     }
//     keyPressed(evt: KeyboardInputEvent): boolean {
//         return false;
//     }
//     keyReleased(evt: KeyboardInputEvent): boolean {
//         return false;
//     }
// }