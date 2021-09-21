
import {FHTML, BristolBoard, UIFrame, UIFrameDescription_CornerWidthHeight, UIFrameResult ,UIElement, optFunc, KeyboardInputEvent, MouseBtnInputEvent, MouseDraggedInputEvent, MouseInputEvent, MouseMovedInputEvent, MousePinchedInputEvent, MouseScrolledInputEvent } from "../ClientImports";


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
 
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {
       
    }
    mousePressed(evt: MouseBtnInputEvent): boolean {
        return false;
    }
    mouseReleased(evt: MouseBtnInputEvent): boolean {
        return false;
    }
    mouseEnter(evt: MouseInputEvent): boolean {
        return false;
    }
    mouseExit(evt: MouseInputEvent): boolean {
        return false;
    }
    mouseMoved(evt: MouseMovedInputEvent): boolean {
        return false;
    }
    shouldDragLock(event: MouseBtnInputEvent): boolean {
        return false;
    }
    mouseDragged(evt: MouseDraggedInputEvent): boolean {
        return false;
    }
    mousePinched(evt: MousePinchedInputEvent): boolean {
        return false;
    }
    mouseWheel(delta: MouseScrolledInputEvent): boolean {
        return false;
    }
    keyPressed(evt: KeyboardInputEvent): boolean {
        return false;
    }
    keyReleased(evt: KeyboardInputEvent): boolean {
        return false;
    }
}