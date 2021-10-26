
import { BristolFontFamily, BristolHAlign, BristolVAlign } from "bristolboard";
import { UIFrame, UIFrameResult, MainBristol,  UIElement, NonDeformingImage } from "../ClientImports";


export class UISimilarityCard extends UIElement {
    image: NonDeformingImage;
    similarityData: [string, number, string[]];
    textSize: number = 24;
    padding: number = 16;
    constructor(uiFrame: UIFrame, brist: MainBristol) {
        super(UIElement.createUID('similarityResult'), uiFrame, brist)
        let ths = this;
        this.image = new NonDeformingImage(null, UIFrame.Build({
            x: 0,
            y: 0,
            width: () => ths.width,
            height: () => ths.height - (ths.padding * 2 + ths.textSize)
        }) as any, brist)
        //  this.image.fitHorizontally();
        this.addChild(this.image)

    }
    onDrawBackground(frame: UIFrameResult, deltaTime: number): void {
        this.brist.fillColor(fColor.darkMode[8]);
        this.brist.ctx.beginPath();
        this.brist.rectFrame(frame, false, true);
        this.brist.ctx.beginPath();
    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {
        this.brist.textSize(this.textSize);
        this.brist.textAlign(BristolHAlign.Left, BristolVAlign.Bottom);
        this.brist.fontFamily(BristolFontFamily.Roboto)
        this.brist.fillColor(fColor.lightText[1])
        this.brist.text(`${this.similarityData[1].toFixed(1)}%`, frame.left + this.padding, frame.bottom - this.padding)
    }
    setData(similarityData: [string, number, string[]]) {
        this.similarityData = similarityData
        this.image.setImage('patients/' + similarityData[0])
    }
}