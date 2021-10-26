
import { BristolFontFamily, BristolHAlign, BristolVAlign, KeyboardInputEvent, MouseBtnInputEvent, MouseDraggedInputEvent, MouseInputEvent, MouseMovedInputEvent, MousePinchedInputEvent, MouseScrolledInputEvent, UIFrameResult, UIFrame_CornerWidthHeight,  MainBristol, NonDeformingImage, UIElement, UIFrame, UploadResponse, UIProgressBar, removeCammelCase } from "../ClientImports";


export class UIResultCard extends UIElement {

    uploadResponse: UploadResponse;
    image: NonDeformingImage = null;
    padding: number = 32;
    constructor(data: UploadResponse, uiFrame: UIFrame_CornerWidthHeight, brist: MainBristol) {
        super(UIElement.createUID('ResultCard'), uiFrame, brist)
        this.uploadResponse = data;
        let ths = this;
        this.image = new NonDeformingImage(`./userContent/${this.uploadResponse.fileName}`, UIFrame.Build({
            x: 0,
            y: 0,
            width: () => (ths.frame.result?.width),
            height: () => (ths.height - ths.bottomCardHeight)
        }), brist);
        this.addChild(this.image);
        let buildFrame = (index: number) => {

            return new UIFrame_CornerWidthHeight({
                x: () => ths.padding,
                y: () => ths.padding + (ths.height - ths.bottomCardHeight) + (ths.bottomCardHeight / 3) * index,
                width: () => ths.width - ths.padding * 2,
                height: () => ((ths.bottomCardHeight / 3) - ths.padding * 2)
            })
        }
        for (let i = 0; i < this.uploadResponse.diagnosis.length; i++) {
            let display = new DiseaseDisplay(this.uploadResponse.diagnosis[i], buildFrame(i), brist);
            this.addChild(display);
            // let txt = removeCammelCase(Disease[this.uploadResponse.diagnosis[i][0]])
            // this.brist.textSizeMaxWidth(this.topCardHeight - textHeight - this.padding, txt, frame.width - (this.padding * 4));
            // this.brist.text(txt, frame.left + this.padding, (frame.height - this.topCardHeight) + frame.top + this.padding + i * textHeight)
        }
    }
    get bottomCardHeight() {
        return this.height * 0.3;
    }
    onDrawBackground(frame: UIFrameResult, deltaMs: number) {
        this.brist.fillColor(fColor.darkMode[5]);
        this.brist.roundedRectFrame(frame, 3, true, false)
        this.brist.ctx.beginPath();
    }
    onDrawForeground(frame: UIFrameResult, deltaMs: number) {

        ;
        // if (this.image != null) {
        //     this.brist.ctx.drawImage(this.image, frame.left, frame.top + topCardHeight, frame.width, frame.height - topCardHeight);
        // }

        //         if (this.uploadResponse) {
        //             let textHeight = ((this.bottomCardHeight - this.padding * 4) / Math.max(this.uploadResponse.diagnosis.length, 3));
        //             this.brist.fontFamily(BristolFontFamily.Roboto);
        //             this.brist.textAlign(BristolHAlign.Left, BristolVAlign.Top);
        //             this.brist.fillColor(fColor.lightText[1])


        //         }
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
}

export class DiseaseDisplay extends UIElement {
    private _data: [string, number];
    progress: UIProgressBar;
    barWidth: number = 0.6;
    padding: number = 32;
    diseaseName: string;
    constructor(data: [string, number], frame: UIFrame, brist: MainBristol) {
        super(UIElement.createUID('DiseaseDisplay'), frame, brist)
        this.data = data;
        let ths = this;
        this.progress = new UIProgressBar(
            () => ths.data[1]//(1 + Math.cos(Date.now() / 1000)) / 2
            , new UIFrame_CornerWidthHeight({
                x: 0,
                y: 0,
                width: () => (ths.width * this.barWidth),
                height: () => ths.height
            }), brist);
        this.progress.text = {
            align: BristolHAlign.Right,
            getText: (prog: number) => `${(prog * 100).toFixed(1)}%`,
            backgroundColor: fColor.darkMode[11],
            foregroundColor: fColor.lightText[1]
        };
        this.progress.foregroundColor = fColor.green.base;
        this.progress.backgroundColor = fColor.darkMode[2];
        this.addChild(this.progress);
    }
    set data(freshData: [string, number]) {
        this._data = freshData;
        this.diseaseName = removeCammelCase(freshData[0]);
    }
    get data() {
        return this._data
    }

    onDrawBackground(frame: UIFrameResult, deltaTime: number): void {
    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {
        this.brist.textAlign(BristolHAlign.Right, BristolVAlign.Middle)
        this.brist.fontFamily(BristolFontFamily.Roboto)
        this.brist.textSizeMaxWidth(frame.height * 0.6, this.diseaseName, frame.width * (1 - this.barWidth) - this.padding);
        this.brist.fillColor(fColor.lightText[1]);
        this.brist.text(this.diseaseName, frame.right, frame.centerY);
    }
    shouldDragLock(event: MouseBtnInputEvent): boolean {
        return false
    }
    mousePressed(evt: MouseBtnInputEvent): boolean {
        return false
    }
    mouseReleased(evt: MouseBtnInputEvent): boolean {
        return false
    }
    mouseEnter(evt: MouseInputEvent): boolean {
        return false
    }
    mouseExit(evt: MouseInputEvent): boolean {
        return false
    }
    mouseMoved(evt: MouseMovedInputEvent): boolean {
        return false
    }
    mouseDragged(evt: MouseDraggedInputEvent): boolean {
        return false
    }
    mousePinched(evt: MousePinchedInputEvent): boolean {
        return false
    }
    mouseWheel(delta: MouseScrolledInputEvent): boolean {
        return false
    }
    keyPressed(evt: KeyboardInputEvent): boolean {
        return false
    }
    keyReleased(evt: KeyboardInputEvent): boolean {
        return false
    }
}