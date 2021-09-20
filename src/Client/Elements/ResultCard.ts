
import { BristolFontFamily, BristolHAlign, BristolVAlign, UIFrameResult, UIFrame_CornerWidthHeight } from "bristolboard";
import { MainBristol, UIElement, UIFrame, UploadResponse } from "../ClientImports";

export class UIResultCard extends UIElement {
    
    uploadResponse: UploadResponse;
    image: HTMLImageElement = null;
    padding: number = 16;
    constructor(data: UploadResponse, uiFrame: UIFrame_CornerWidthHeight, brist: MainBristol) {
        super(UIElement.createUID('ResultCard'), uiFrame, brist)
        this.uploadResponse = data;
        this.image = new Image();
        this.image.src = `./userContent/${this.uploadResponse.fileName}`


    }
    onDrawBackground(frame: UIFrameResult, deltaMs: number) {
        this.brist.fillColor(fColor.darkMode[5]);
        this.brist.roundedRectFrame(frame, 3, true, false)
    }
    onDrawForeground(frame: UIFrameResult, deltaMs: number) {
        let topCardHeight = frame.height / 3;
        if (this.image != null) {
            this.brist.ctx.drawImage(this.image, frame.left, frame.top + topCardHeight, frame.width, frame.height - topCardHeight);
        }

        if (this.uploadResponse) {
            let textHeight = ((topCardHeight - this.padding * 2) / Math.max(this.uploadResponse.diagnosis.length, 3));
            this.brist.textSize(textHeight - this.padding);
            this.brist.fontFamily(BristolFontFamily.Roboto);
            this.brist.textAlign(BristolHAlign.Left, BristolVAlign.Top);
            this.brist.fillColor(fColor.lightText[1])
            for (let i = 0; i < this.uploadResponse.diagnosis.length; i++) {
                this.brist.text(this.removeCammelCase(this.uploadResponse.diagnosis[i][0]), frame.left + this.padding, frame.top + this.padding + i * textHeight)
            }
        }
    }

    removeCammelCase(input: string): string {
        let out: string[] = [];
        out.push(input[0].toUpperCase());
        for (let i = 1; i < input.length; i++) {
            if(input[i] == input[i].toUpperCase()){
                out.push(' ');
            }
            out.push(input[i]);
        }
        return out.join('');
    }

}
