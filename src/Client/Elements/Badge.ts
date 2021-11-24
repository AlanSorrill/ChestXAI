import { BristolBoard, UIFrame, UIFrameResult } from "bristolboard";
import { UIElement } from "../ClientImports";


export class UIBadge extends UIElement{
    constructor(frame: UIFrame, brist: BristolBoard<any>){
        super(UIElement.createUID('UIBadge'), frame, brist);
    }
    onDrawBackground(frame: UIFrameResult, deltaTime: number): void {
        throw new Error("Method not implemented.");
    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {
        throw new Error("Method not implemented.");
    }

}