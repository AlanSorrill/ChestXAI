
import {  BristolHAlign, BristolVAlign, UIFrame, UIFrameResult,MainBristol, UIElement } from "../../ClientImports";

export class UIP_Loading extends UIElement {
    message: string;
    constructor(message: string, brist: MainBristol) {
        super(UIElement.createUID('loading'), UIFrame.Build({
            x: 0,
            y: 0,
            width: () => brist.getWidth(),
            height: () => brist.getHeight()
        }), brist);
        this.message = message;
    }
    onDrawBackground(frame: UIFrameResult, deltaTime: number): void {
        this.brist.fillColor(fColor.darkMode[0]);
        this.brist.rectFrame(frame, false, true);
    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {
        this.brist.fillColor(fColor.lightText[1]);
        this.brist.textAlign(BristolHAlign.Center, BristolVAlign.Middle);
        this.brist.textSize(20);
        this.brist.text(this.message, frame.centerX, frame.centerY);
    }

}