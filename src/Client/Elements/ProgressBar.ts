import {
    evalOptionalFunc, optFunc, UIFrameDescription_CornerWidthHeight,
    BristolFontFamily, BristolHAlign, BristolVAlign, UIElement, UIFrameResult,
    UIFrame_CornerWidthHeight, UI_ChestXAI, BristolBoard, FColor, 
} from "../ClientImports";


export class UIProgressBar extends UIElement {


    backgroundColor: optFunc<FColor> = null;
    foregroundColor: optFunc<FColor> = fColor.red.base;
    onClick: () => void;
    
    progress: optFunc<number>;
    text: {
        getText: (progress: number) => string,
        align: BristolHAlign,
        backgroundColor: optFunc<FColor>,
        foregroundColor: optFunc<FColor>
    } = null
    constructor(progress: optFunc<number>, uiFrame: UIFrame_CornerWidthHeight | UIFrameDescription_CornerWidthHeight, brist: BristolBoard<UI_ChestXAI>) {
        super(UIElement.createUID('progress'), uiFrame, brist);
        this.progress = progress
    }

    onDrawBackground(frame: UIFrameResult, deltaMs: number) {
        if (this.backgroundColor != null) {
            this.brist.ctx.beginPath();
            this.brist.fillColor(evalOptionalFunc(this.backgroundColor, fColor.darkMode[5]));
            this.brist.ctx.rect(frame.left, frame.top, frame.width, frame.height);
            this.brist.ctx.fill();
            this.brist.ctx.beginPath();
        }
        if (this.text != null) {
            this.setupText(frame);
            this.brist.fillColor(evalOptionalFunc(this.text.backgroundColor))
            this.drawText(frame);
        }

        this.brist.ctx.beginPath();
        this.brist.fillColor(evalOptionalFunc(this.foregroundColor, fColor.green.lighten2));
        this.brist.ctx.rect(frame.left, frame.top, frame.width * evalOptionalFunc(this.progress, 0), frame.height);
        this.brist.ctx.fill();
        if (this.text != null) {
            this.brist.ctx.save();
            this.brist.ctx.clip();
            this.brist.fillColor(evalOptionalFunc(this.text.foregroundColor))
            this.drawText(frame);
            this.brist.ctx.restore();
        }
        this.brist.ctx.beginPath();
    }
    get padding() {
        return this.getHeight() * (0.2);
    }
    setupText(frame: UIFrameResult) {
        this.brist.fontFamily(BristolFontFamily.Monospace);
        this.brist.textAlign(this.text.align, BristolVAlign.Middle);
        this.brist.textSize(frame.height - this.padding * 2);
    }
    drawText(frame: UIFrameResult) {
        switch (this.text.align) {
            case BristolHAlign.Left:
                this.brist.text(this.text.getText(evalOptionalFunc(this.progress, 0)), frame.left + this.padding, frame.centerY);
                break;
            case BristolHAlign.Center:
                this.brist.text(this.text.getText(evalOptionalFunc(this.progress, 0)), frame.centerX, frame.centerY);
                break;
            case BristolHAlign.Right:

                this.brist.text(this.text.getText(evalOptionalFunc(this.progress, 0)), frame.right - this.padding, frame.centerY);
                break;
        }
    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {

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
    //  mouseReleased(evt: { start: RawPointerData; end: RawPointerData; timeDown: number; }) {
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