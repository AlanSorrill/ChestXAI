import { UIFrameDescription_CornerWidthHeight } from "../Bristol/UIFrame";
import {FHTML, BristolBoard, UIFrame, UIFrameDescription, UIFrameResult ,UIElement, optFunc } from "../clientImports";


export class UI_ImageElement extends UIElement {
    static instCount = 0;
    imageData: HTMLImageElement = null;
    
    constructor(frame: UIFrameDescription_CornerWidthHeight, brist: BristolBoard<any>, url: string){
        super(`${UI_ImageElement.instCount++}ImageElem`, UIFrame.Build(frame), brist)
        let ths = this;
        FHTML.loadImage(url).then((image: HTMLImageElement) => { ths.imageData = image; })
        
    }
    onDrawBackground(frame: UIFrameResult, deltaMs: number){
        if (this.imageData != null) {
            this.brist.ctx.drawImage(this.imageData, frame.left, frame.top, frame.width, frame.height);
        }
    }
    measure(deltaTime: number){
        super.measure(deltaTime);
    }
}