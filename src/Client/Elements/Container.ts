import { UIFrameResult, MouseBtnInputEvent, MouseInputEvent, MouseMovedInputEvent, MouseDraggedInputEvent, MousePinchedInputEvent, MouseScrolledInputEvent, KeyboardInputEvent } from "bristolboard";
import { UIElement } from "../ClientImports";

export class VerticalContainer extends UIElement {
    
    onDrawBackground(frame: UIFrameResult, deltaTime: number): void {
    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {
    }
    shouldDragLock(event: MouseBtnInputEvent): boolean {
        return false
    }
    mousePressed(evt: MouseBtnInputEvent): boolean {
        return false
    }
    mouseReleased(evt: MouseBtnInputEvent): boolean {
        return false
    }
    mouseEnter(evt: MouseInputEvent): boolean {
        return false
    }
    mouseExit(evt: MouseInputEvent): boolean {
        return false
    }
    mouseMoved(evt: MouseMovedInputEvent): boolean {
        return false
    }
    mouseDragged(evt: MouseDraggedInputEvent): boolean {
        return false
    }
    mousePinched(evt: MousePinchedInputEvent): boolean {
        return false
    }
    mouseWheel(delta: MouseScrolledInputEvent): boolean {
        return false
    }
    keyPressed(evt: KeyboardInputEvent): boolean {
        return false
    }
    keyReleased(evt: KeyboardInputEvent): boolean {
        return false
    }

}