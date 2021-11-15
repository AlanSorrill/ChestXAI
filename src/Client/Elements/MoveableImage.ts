
import { MouseDragListener } from "bristolboard";
import { KeyboardInputEvent, MouseBtnInputEvent, MouseDraggedInputEvent, MouseInputEvent, MouseMovedInputEvent, MousePinchedInputEvent, MouseScrolledInputEvent, UIFrameResult, MainBristol, UIElement, UIFrame } from "../ClientImports";

export class UI_Image extends UIElement implements MouseDragListener {
    image: HTMLImageElement = null;
    maxFreeScaleVelocity: number = 0.001;
    maxFreeOffsetVelocity: number = 10;
    scale: number = 1;
    offset: [x: number, y: number] = [0, 0]

    constructor(urlOrImage: string | HTMLImageElement, uiFrame: UIFrame, brist: MainBristol) {
        super(UIElement.createUID('NonDefImage'), uiFrame, brist);
        this.setImage(urlOrImage);
    }
    get isLoaded(){
        return this._isLoaded;
    }
    private _isLoaded = false;
    private loadedListener: ((ths: UI_Image) => void)[] = [];
    private notifyOnLoadedListeners() {
        for (let i = 0; i < this.loadedListener.length; i++) {
            this.loadedListener[i](this);
        }
    }
    setOnLoaded(loadedListener: (ths: UI_Image) => void) {
        this.loadedListener.push(loadedListener);
        if (this._isLoaded) {
            console.log(`Already completed listener for ${this.image.src}`)
            loadedListener(this);
        }
    }
    onDragEnd(event: MouseBtnInputEvent): boolean {
        return true;
    }
    async setImage(urlOrImage: string | HTMLImageElement): Promise<UI_Image> {

        let ths = this;
        this._isLoaded = false;
        if (urlOrImage == null) {
            this.image = new Image();
        } else if (typeof urlOrImage == 'string') {
            this.image = new Image();
            this.image.src = urlOrImage;
            this.image.onload = () => {
                console.log(`Completing listener for ${urlOrImage}`)
                ths.notifyOnLoadedListeners()
            }
            this.image.onerror = (err) => {
                console.log(err);
                this.image = null;
            }
            this._isLoaded = true;

        } else {
            this.image = urlOrImage;
            ths.notifyOnLoadedListeners()
            this._isLoaded = true;
        }
        return new Promise((acc, rej) => {
            ths.setOnLoaded(acc);
        });
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
    fitHorizontally(retries: number = 1000) {

        this.scale = this.getWidth() / this.image.width;


      //  console.log(`Resizing to ${this.scale}`)
        if (isNaN(this.scale) || this.image.width == 0) {
            let ths = this;
            let count = 0;
            if(isNaN(this.scale)){
                this.scale = 1;
            }
            setTimeout(() => {
                if (count++ > retries) {
                    return;
                }
             //   console.log('retrying horizontal fit');
                ths.fitHorizontally();
            }, 1)
        }
    }
    centerHorizontally() {
        this.offset[0] = this.getWidth() / 2 - this.imgWidth / 2
    }
    centerVertically() {
        this.offset[1] = this.getHeight() / 2 - this.getHeight() / 2
    }
    onDrawBackground(frame: UIFrameResult, delta: number) {
        if (this.image == null || !this.image.complete) {
            this.brist.strokeColor(fColor.red.base);
            this.brist.strokeWeight(2);
            this.brist.rectFrame(frame, true, false)
            return;
        }
        if (this.imgHeight < frame.height && !this.isDragLocked && delta < 50) {
            this.scale += this.maxFreeScaleVelocity * delta;
        } else if (this.imgRight < this.getWidth() && !this.isDragLocked && delta < 50) {
            this.offset[0] += this.maxFreeOffsetVelocity * delta;
        }

        if (this.imgWidth < frame.width && !this.isDragLocked && delta < 50) {
            this.scale += this.maxFreeScaleVelocity * delta;
        } else if (this.imgBottom < this.getHeight() && !this.isDragLocked && delta < 50) {
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
            try {
                this.brist.ctx.drawImage(this.image, frame.left + this.imgLeft, frame.top + this.imgTop, this.imgWidth, this.imgHeight)
            } catch (err) {
                console.log(err);
                this.image = null;
            }
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
        if (this.offset[0] + evt.deltaX > 0) {
            let leftoverX = (this.offset[0] + evt.deltaX);
            evt.deltaX = leftoverX;
            this.offset[0] = 0;
            console.log(`<0 LeftoverX ${leftoverX}`)
            return true;
        } else if (this.offset[0] + evt.deltaX + this.imgWidth < this.getWidth()) {
            let leftoverX = this.getWidth() - (this.offset[0] + evt.deltaX + this.imgWidth);
            evt.deltaX = leftoverX;
            this.offset[0] += evt.deltaX - leftoverX;
            console.log(`>${this.getWidth()} LeftoverX ${leftoverX}`)
            return true;
        }
        if (this.offset[1] + evt.deltaY > 0) {
            let leftoverY = (this.offset[1] + evt.deltaY);
            evt.deltaY = leftoverY;
            this.offset[1] = 0;
            console.log(`<0 LeftoverY ${leftoverY}`)
            return true;
        } else if (this.offset[1] + evt.deltaY + this.imgHeight < this.getHeight()) {
            let leftoverY = this.getHeight() - (this.offset[1] + evt.deltaY + this.imgHeight);
            evt.deltaY = leftoverY;
            this.offset[1] += evt.deltaY - leftoverY;
            console.log(`>${this.getHeight()} LeftoverY ${leftoverY}`)
            return true;
        }
        this.offset[0] += evt.deltaX;
        this.offset[1] += evt.deltaY;
        return true;
    }
    mousePinched(evt: MousePinchedInputEvent): boolean {
        return false;
    }
    mouseWheel(delta: MouseScrolledInputEvent): boolean {
        console.log(`Image Mouse wheel${delta.amount}`)
        this.scale += delta.amount / 10.0;
        return false;
    }
    keyPressed(evt: KeyboardInputEvent): boolean {
        return false;
    }
    keyReleased(evt: KeyboardInputEvent): boolean {
        return false;
    }
}