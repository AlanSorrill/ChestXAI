

import { BristolCursor } from "bristolboard";
import { EnumType } from "typescript";
import { UI_XRay_Image, UIFrame, UIFrameResult, MainBristol, DiseaseDefinition, BristolFontFamily, BristolHAlign, BristolVAlign, linearInterp, UIButton, UICorner, UIElement, UIFrame_CornerWidthHeight, UIProgressButton, PrototypeData } from "../ClientImports";




export class UIPrototypeCard extends UIElement {
    image: UI_XRay_Image;
    protoData: PrototypeData
    textSize: number = 24;
    padding: number = 16;

    constructor(uiFrame: UIFrame, brist: MainBristol) {
        super(UIElement.createUID('similarityResult'), uiFrame, brist)
        let ths = this;
        this.image = new UI_XRay_Image(null, UIFrame.Build({
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
        this.brist.textAlign(BristolHAlign.Right, BristolVAlign.Top);

        //        (ths.padding * 2 + ths.textSize) - ths.margin * 2
        this.brist.strokeWeight(2);
        this.brist.strokeColor(fColor.black);
        this.brist.fontFamily(BristolFontFamily.Monospace);
        this.brist.textSize(frame.height * 0.1)
        if (this.protoData != null) {
            let text = `${(this.protoData[1] * 100).toFixed(0)}%`;
            let txtBB = this.brist.ctx.measureText(text);
            let width = txtBB.width
            this.brist.fillColor(fColor.darkMode[10])
            this.brist.ctx.beginPath();
            this.brist.rect(frame.right - width, frame.top, width, frame.height * 0.1, false, true)
            this.brist.fillColor(fColor.red.lighten1);
            this.brist.ctx.fillText(text, frame.right, frame.top);

        }
        // this.brist.ctx.strokeText(`${(this.similarityData[1] * 100).toFixed(2)}%`, frame.left, frame.top);
        // this.brist.ctx.beginPath();
        // this.brist.rect(frame.left + this.margin, frame.top + this.margin, this.image.getWidth(), this.getHeight() - this.margin * 2, false, true);
        // this.brist.ctx.beginPath();

        // this.brist.textSize(this.textSize);
        // this.brist.textAlign(BristolHAlign.Left, BristolVAlign.Bottom);
        // this.brist.fontFamily(BristolFontFamily.Raleway)
        // this.brist.fillColor(fColor.lightText[1])
        // this.brist.text(`${(this.similarityData[1] * 100).toFixed(1)}%`, this.margin + frame.left + this.padding, frame.bottom - this.padding - this.margin)
    }
    setData(protoData: PrototypeData) {
        this.protoData = protoData
        let ths = this;
        this.image.ogSrc = `patients/${protoData.originalImage}`;
        this.image.setImage(`patients/${protoData.originalImage}?res=20`).then(() => {
            ths.addOnAttachToBristolListener(async () => {
                console.log('Fitting similarity image')
                ths.image.fitHorizontally();
                //ths.image.setHeatmap(`patients/${similarityData[0]}?heatmap=10000`);
                //for (let i = 0; i < protoData[2].length; i++) {
                ths.image.preloadHeatmap(protoData.disease, 100);


            })
        })
        // let getBtnWidth = () => (ths.getWidth() / ths.protoData[2].length)

        // let generateBtn = (index: number, def: DiseaseDefinition) => {
        //     console.log(`Similar image has ${def.displayName}`)
        //     let getProgress = () => ths.image.getHeatmapProgress(def.bitStringID)
        //     let isComplete = () => (getProgress() >= 1)
        //     let btn = new UIProgressButton(def.displayName, () => {
        //         ths.image.displayHeatmap(ths.image.currentHeatmap == def.bitStringID ? null : def.bitStringID);
        //     }
        //         , () => ths.image.getHeatmapProgress(def.bitStringID), new UIFrame_CornerWidthHeight({
        //             x: () => (getBtnWidth() * index),
        //             y: 0,
        //             width: getBtnWidth(),
        //             height: 10,
        //             measureCorner: UICorner.downLeft

        //         }), this.brist);
        //     btn.onMouseEnter = () => {

        //         ths.brist.cursor(BristolCursor.pointer);

        //     }
        //     btn.onMouseExit = () => {
        //         ths.brist.cursor(BristolCursor.default);
        //     }
        //     btn.backgroundColor = fColor.darkMode[1]// () => btn.mouseState ? ;
        //     btn.progressColor = () => isComplete() ? fColor.darkMode[10] : (getProgress() != -1 ? fColor.green.darken1 : fColor.darkMode[9]);
        //     btn.frame.topY = linearInterp(
        //         () => (ths.getBottom() - ths.getHeight() * 0.1),
        //         () => (ths.getBottom() - ths.getHeight() * 0.12),
        //         () => (btn.isMouseOver || ths.image.currentHeatmap == def.bitStringID ? 'A' : 'B'),
        //         { durration: 200 });

        //     btn.frame.description.y = () => (ths.getHeight() - btn.getHeight())
        //     btn.frame.bottomY = () => (ths.parent as UIElement).getBottom();
        //     btn.frame.measureHeight = () => (btn.frame.bottomY() - btn.frame.topY())
        //     btn.ensureTextNotTooWide = true;
        //     btn.textSize = () => btn.getHeight() * 0.8
        //     btn.paddingHorizontal = 4;
        //     btn.zOffset = 1 + index;
        //     return btn; 9
        // }
        // while (ths.buttons.length > 0) {
        //     ths.buttons.pop().removeFromParent();
        // }
        // ths.buttons = [];
        // for (let i = 0; i < protoData[2].length; i++) {
        //     this.buttons.push(generateBtn(i, protoData[2][i]))
        //     this.addChild(this.buttons[i])
        //     console.log(this.buttons[i])
        // }

    }
    buttons: Array<UIButton> = []

}

function switchOnEnum<T extends EnumType, ValueType>(valueMap: { [Property in keyof T]: ValueType }) {
    return (prop: keyof T) => valueMap[prop];
}