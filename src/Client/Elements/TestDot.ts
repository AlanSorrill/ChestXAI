import {FColor, BristolBoard, UIFrame, UIFrameDescription, UIFrameResult ,UIElement, optFunc } from "../ClientImports";


export class TestDot extends UIElement {
    static instCount = 0;
    fillColor: optFunc<FColor>;
    constructor(frame: UIFrameDescription | UIFrame, brist: BristolBoard<any>, fillColor: optFunc<FColor> = fColor.red.base){
        super(`${TestDot.instCount++}TestDot`, UIFrame.Build(frame), brist)
        this.fillColor = fillColor;
        
    }
    onDrawBackground(frame: UIFrameResult, deltaMs: number){
      
        this.brist.ellipseFrame(frame)
    }
}