
import { BristolFontFamily, BristolHAlign, BristolVAlign, linearInterp, MouseState, UIButton, UICorner, UIElement, UIFrame_CornerWidthHeight } from "bristolboard";
import { UIFrame, UIFrameResult, MainBristol, UI_Image, DiseaseDefinition } from "../ClientImports";



export class UISimilarityCard extends UIElement {
    image: UI_Image;
    similarityData: [string, number, DiseaseDefinition[]];
    textSize: number = 24;
    padding: number = 16;

    constructor(uiFrame: UIFrame, brist: MainBristol) {
        super(UIElement.createUID('similarityResult'), uiFrame, brist)
        let ths = this;
        this.image = new UI_Image(null, UIFrame.Build({
            x: 0,
            y: 0,
            width: () => ths.getWidth(),
            height: () => ths.getHeight()
        }) as any, brist)
        //  this.image.fitHorizontally();
        this.addChild(this.image)




    }
    onDrawBackground(frame: UIFrameResult, deltaTime: number): void {
        if (!this.image.isLoaded) {
            this.brist.fillColor(fColor.darkMode[6]);
            this.brist.ctx.beginPath();
            this.brist.rectFrame(frame, false, true)
            // this.brist.rect(frame.left + this.margin, frame.top + this.margin, this.image.getWidth(), this.getHeight() - this.margin * 2, false, true);
            this.brist.ctx.beginPath();
        }
    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {
        //        (ths.padding * 2 + ths.textSize) - ths.margin * 2
        // this.brist.fillColor(fColor.darkMode[8]);
        // this.brist.ctx.beginPath();
        // this.brist.rect(frame.left + this.margin, frame.top + this.margin, this.image.getWidth(), this.getHeight() - this.margin * 2, false, true);
        // this.brist.ctx.beginPath();

        // this.brist.textSize(this.textSize);
        // this.brist.textAlign(BristolHAlign.Left, BristolVAlign.Bottom);
        // this.brist.fontFamily(BristolFontFamily.Raleway)
        // this.brist.fillColor(fColor.lightText[1])
        // this.brist.text(`${(this.similarityData[1] * 100).toFixed(1)}%`, this.margin + frame.left + this.padding, frame.bottom - this.padding - this.margin)
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
        let getBtnWidth = () => (ths.getWidth())
        let generateBtn = (index: number, def: DiseaseDefinition) => {
            console.log(`Similar image has ${def.displayName}`)
            let btn = new UIButton(def.displayName, () => {

            }, new UIFrame_CornerWidthHeight({
                x: () => (getBtnWidth() * index),
                y: 0,
                width: getBtnWidth(),
                height: 10,
                measureCorner: UICorner.downLeft

            }), this.brist);
            btn.backgroundColor = fColor.purple.base;
            btn.frame.topY = linearInterp(
                () => (ths.getBottom() - ths.getHeight() * 0.1),
                () => (ths.getBottom() - ths.getHeight() * 0.2),
                () => (btn.mouseState == MouseState.Over ? 'A' : 'B'),
                { durration: 200 });

            btn.frame.description.y = () => (ths.getHeight() - btn.getHeight())
            btn.frame.bottomY = () => (ths.parent as UIElement).getBottom();
            btn.frame.measureHeight = ()=>(btn.frame.bottomY() - btn.frame.topY())

            btn.textSize = () => btn.getHeight() * 0.8
            btn.zOffset = 1 + index;
            return btn;
        }
        while (ths.buttons.length > 0) {
            ths.buttons.pop().removeFromParent();
        }
        ths.buttons = [];
        for (let i = 0; i < similarityData[2].length; i++) {
            this.buttons.push(generateBtn(i, similarityData[2][i]))
            this.addChild(this.buttons[i])
            console.log(this.buttons[i])
        }

    }
    buttons: Array<UIButton> = []

}