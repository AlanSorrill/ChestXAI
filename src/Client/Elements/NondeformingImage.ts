import { UIFrameResult } from "bristolboard";
import { MainBristol, UIElement, UIFrame } from "../ClientImports";

export class NonDeformingImage extends UIElement {
    image: HTMLImageElement;
    constructor(urlOrImage: string | HTMLImageElement, uiFrame: UIFrame, brist: MainBristol) {
        super(UIElement.createUID('NonDefImage'), uiFrame, brist);
        if(typeof urlOrImage == 'string'){
            this.image = new Image();
            this.image.src = urlOrImage;
        } else {
            this.image = urlOrImage;
        }
    }
    onDrawBackground(frame: UIFrameResult, delta: number){
        this.brist.rectFrame(frame, false, false);
        this.brist.ctx.save();
        this.brist.ctx.clip();
        if(this.image != null){
            this.brist.ctx.drawImage(this.image, frame.left, frame.top)
        }
    }
}