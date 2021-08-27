import { FColor, BristolBoard, UIFrame, UIFrameDescription, UIFrameResult, UIElement, optFunc } from "../clientImports";


export class Lung extends UIElement {
    static instCount = 0;
    
    constructor(frame: UIFrameDescription | UIFrame, brist: BristolBoard<any>) {
        super(`Lung${Lung.instCount++}`, UIFrame.Build(frame), brist)
        

    }
    onDrawBackground(frame: UIFrameResult, deltaMs: number) {

        this.brist.ellipseFrame(frame)
    }
}