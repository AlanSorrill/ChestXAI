import { MouseBtnInputEvent, MouseInputEvent, MouseMovedInputEvent, MouseDraggedInputEvent, MousePinchedInputEvent, MouseScrolledInputEvent, KeyboardInputEvent } from "bristolboard";
import {FColor, BristolBoard, UIFrame, UIFrameDescription, UIFrameResult ,UIElement, optFunc } from "../ClientImports";


export class TestDot extends UIElement {
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {
        throw new Error("Method not implemented.");
    }
    shouldDragLock(event: MouseBtnInputEvent): boolean {
        throw new Error("Method not implemented.");
    }
    mousePressed(evt: MouseBtnInputEvent): boolean {
        throw new Error("Method not implemented.");
    }
    mouseReleased(evt: MouseBtnInputEvent): boolean {
        throw new Error("Method not implemented.");
    }
    mouseEnter(evt: MouseInputEvent): boolean {
        throw new Error("Method not implemented.");
    }
    mouseExit(evt: MouseInputEvent): boolean {
        throw new Error("Method not implemented.");
    }
    mouseMoved(evt: MouseMovedInputEvent): boolean {
        throw new Error("Method not implemented.");
    }
    mouseDragged(evt: MouseDraggedInputEvent): boolean {
        throw new Error("Method not implemented.");
    }
    mousePinched(evt: MousePinchedInputEvent): boolean {
        throw new Error("Method not implemented.");
    }
    mouseWheel(delta: MouseScrolledInputEvent): boolean {
        throw new Error("Method not implemented.");
    }
    keyPressed(evt: KeyboardInputEvent): boolean {
        throw new Error("Method not implemented.");
    }
    keyReleased(evt: KeyboardInputEvent): boolean {
        throw new Error("Method not implemented.");
    }
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