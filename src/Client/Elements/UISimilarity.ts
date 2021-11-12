
import { BristolFontFamily, BristolHAlign, BristolVAlign, UIElement } from "bristolboard";
import { UIFrame, UIFrameResult, MainBristol, UI_Image, DiseaseDefinition } from "../ClientImports";


export class UISimilarityCard extends UIElement {
    image: UI_Image;
    similarityData: [string, number, DiseaseDefinition[]];
    textSize: number = 24;
    padding: number = 16;
    margin: number = 16;
    constructor(uiFrame: UIFrame, brist: MainBristol) {
        super(UIElement.createUID('similarityResult'), uiFrame, brist)
        let ths = this;
        this.image = new UI_Image(null, UIFrame.Build({
            x: ths.margin,
            y: ths.margin,
            width: () => ths.getWidth() - ths.margin * 2,
            height: () => ths.getHeight() - (ths.padding * 2 + ths.textSize) - ths.margin * 2
        }) as any, brist)
        //  this.image.fitHorizontally();
        this.addChild(this.image)

    }
    onDrawBackground(frame: UIFrameResult, deltaTime: number): void {
        this.brist.fillColor(fColor.darkMode[8]);
        this.brist.ctx.beginPath();
        this.brist.rect(frame.left + this.margin, frame.top + this.margin, this.image.getWidth(), this.getHeight() - this.margin * 2, false, true);
        this.brist.ctx.beginPath();
    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {
        this.brist.textSize(this.textSize);
        this.brist.textAlign(BristolHAlign.Left, BristolVAlign.Bottom);
        this.brist.fontFamily(BristolFontFamily.Raleway)
        this.brist.fillColor(fColor.lightText[1])
        this.brist.text(`${(this.similarityData[1] * 100).toFixed(1)}%`, this.margin + frame.left + this.padding, frame.bottom - this.padding - this.margin)
    }
    setData(similarityData: [string, number, DiseaseDefinition[]]) {
        this.similarityData = similarityData
        let ths = this;
        this.image.setImage(`patients/${similarityData[0]}?res=20`).then(() => {
            ths.addOnAttachToBristolListener(() => {
                console.log('Fitting similarity image')
                ths.image.fitHorizontally();
            })
        })
    }
}