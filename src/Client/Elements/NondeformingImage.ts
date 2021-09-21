
import { KeyboardInputEvent, MouseBtnInputEvent, MouseDraggedInputEvent, MouseInputEvent, MouseMovedInputEvent, MousePinchedInputEvent, MouseScrolledInputEvent, UIFrameResult,MainBristol, UIElement, UIFrame } from "../ClientImports";

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