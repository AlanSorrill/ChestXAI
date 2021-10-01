
import { KeyboardInputEvent, MouseBtnInputEvent, MouseDraggedInputEvent, MouseInputEvent, MouseMovedInputEvent, MousePinchedInputEvent, MouseScrolledInputEvent, UIFrameResult, MainBristol, UIElement, UIFrame } from "../ClientImports";

export class NonDeformingImage extends UIElement {
    image: HTMLImageElement = null;
    maxFreeScaleVelocity: number = 0.1;
    maxFreeOffsetVelocity: number = 10;
    scale: number = 1;
    offset: [number, number] = [0, 0]
    constructor(urlOrImage: string | HTMLImageElement, uiFrame: UIFrame, brist: MainBristol) {
        super(UIElement.createUID('NonDefImage'), uiFrame, brist);
        if(urlOrImage == null){
            this.image = new Image();
        } else if (typeof urlOrImage == 'string') {
            this.image = new Image();
            this.image.src = urlOrImage;
        } else {
            this.image = urlOrImage;
        }
    }
    setImage(url: string){
        this.image.src = url;
    }
    get imgLeft() {
        return this.offset[0]
    }
    get imgTop() {
        return this.offset[1];
    }
    get imgRight() {
        return this.imgLeft + this.imgWidth
    }
    get imgBottom() {
        return this.imgTop + this.imgHeight
    }
    get imgWidth() {
        return this.image.width * this.scale;
    }
    get imgHeight() {
        return this.image.height * this.scale;
    }
    fitHorizontally(){
        this.scale = this.width / this.image.width
    }
    centerHorizontally(){
        this.offset[0] = this.width / 2 - this.imgWidth / 2
    }
    centerVertically(){
        this.offset[1] = this.height / 2 - this.height / 2
    }
    onDrawBackground(frame: UIFrameResult, delta: number) {
        if (this.image == null || !this.image.complete) {
            this.brist.strokeColor(fColor.red.base);
            this.brist.strokeWeight(2);
            this.brist.rectFrame(frame, true, false)
            return;
        }
        if (this.imgHeight < frame.height && !this.isDragLocked) {
            this.scale += this.maxFreeScaleVelocity * delta;
        } else if (this.imgRight < this.width && !this.isDragLocked) {
            this.offset[0] += this.maxFreeOffsetVelocity * delta;
        }

        if (this.imgWidth < frame.width && !this.isDragLocked) {
            this.scale += this.maxFreeScaleVelocity * delta;
        } else if (this.imgBottom < this.height && !this.isDragLocked) {
            this.offset[1] += this.maxFreeOffsetVelocity * delta;
        }

        if (this.imgLeft > 0 && !this.isDragLocked) {
            this.offset[0] -= this.maxFreeOffsetVelocity * delta;
        }
        if (this.imgTop > 0 && !this.isDragLocked) {
            this.offset[1] -= this.maxFreeOffsetVelocity * delta;
        }

        if (this.imgBottom > frame.height) { }
        this.brist.ctx.save();
        this.brist.ctx.beginPath();
        this.brist.ctx.rect(frame.left, frame.top, frame.width, frame.height)
        this.brist.ctx.clip();
        if (this.image != null) {
            this.brist.ctx.drawImage(this.image, frame.left + this.imgLeft, frame.top + this.imgTop, this.imgWidth, this.imgHeight)
        }
        this.brist.ctx.restore();
    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {

    }
    mousePressed(evt: MouseBtnInputEvent): boolean {
        // this.brist.cursor('grabbing')
        return false;
    }
    mouseReleased(evt: MouseBtnInputEvent): boolean {
        // this.brist.cursor('grab')
        return false;
    }
    mouseEnter(evt: MouseInputEvent): boolean {
        return false;
    }
    mouseExit(evt: MouseInputEvent): boolean {
        // this.brist.cursor('default')
        return false;
    }
    mouseMoved(evt: MouseMovedInputEvent): boolean {
        return false;
    }
    shouldDragLock(event: MouseBtnInputEvent): boolean {
        return true;
    }
    mouseDragged(evt: MouseDraggedInputEvent): boolean {
        this.offset[0] += evt.deltaX;
        this.offset[1] += evt.deltaY;
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