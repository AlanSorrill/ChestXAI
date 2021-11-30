
import { clamp, MouseDragListener, RawPointerData, RawPointerMoveData, RawPointerScrollData } from "bristolboard";
import { KeyboardInputEvent,UIFrameResult, MainBristol, UIElement, UIFrame } from "../ClientImports";
import { ImageEditor, RGBA } from "../ImageEditing";

export class UI_Image extends UIElement implements MouseDragListener {
    async setHeatmap(heatmapLink: string) {
        let data = await (await fetch(heatmapLink)).json();
        let dataWidth = data.length;

        let lastValTstTmpDeleteThis: [number,number,number] = [0,0,0];
        let getHeat = (xAlpha: number, yAlpha: number) => {
            let xCoord = Math.floor(dataWidth * xAlpha);
            let yCoord = Math.floor(dataWidth * yAlpha);
            let output = data[yCoord][xCoord] 
            
            if (xCoord != lastValTstTmpDeleteThis[0] || yCoord != lastValTstTmpDeleteThis[1]) {
               // console.log(`getHeat[${xCoord},${yCoord}](${xAlpha},${yAlpha}) = ${output}`);
                lastValTstTmpDeleteThis[0] = xCoord;
                lastValTstTmpDeleteThis[1] = yCoord;
            }
            //let index = yCoord * dataWidth + xCoord;
            return output;//(Math.cos(yAlpha * Math.PI) + 1) / 2 * 255;
        }
        // let canvas = new OffscreenCanvas(this.image.width, this.image.height);
        // let ctx = canvas.getContext('2d');
        // ctx.drawImage(this.image, 0, 0);
        // let originalData = ctx.getImageData(0, 0, this.image.width, this.image.height, {});


        // let setPixelData = (xx: number, yy: number, pixel: [r: number, g: number, b: number, a: number]) => {
        //     let index = yy * originalData.width * 4 + xx * 4;
        //     for (let channel = 0; channel < pixel.length; channel++) {
        //         originalData[index + channel] = pixel[channel];
        //     }

        // }
        // // for (let x = 0; x < this.image.width; x++) {
        // //     for (let y = 0; y < this.image.height; y++) {
        // //         setPixelData(x, y, [255, 0, y % 255, 255]);
        // //     }
        // // }
        // ctx.putImageData(originalData, 0, 0);
        let imageSize = [this.image.width, this.image.height];
        
        this.image.src = await ImageEditor.editImage(this.image, (x: number, y: number, oldPixel: RGBA) => {
          //  console.log(`Edit image at (${x}, ${y}) alpha=(${x / imageSize[0]}, ${y / imageSize[1]})`);
            return [oldPixel[0], oldPixel[1],oldPixel[1], getHeat(x / imageSize[0], y / imageSize[1])];
        });//URL.createObjectURL(await canvas.convertToBlob());
        console.log(`Completed heatmap`)
    }
    image: HTMLImageElement = null;
    maxFreeScaleVelocity: number = 0.001;
    maxFreeOffsetVelocity: number = 10;
    scale: number = 1;
    offset: [x: number, y: number] = [0, 0]

    constructor(urlOrImage: string | HTMLImageElement, uiFrame: UIFrame, brist: MainBristol) {
        super(UIElement.createUID('NonDefImage'), uiFrame, brist);
        this.setImage(urlOrImage);
    }
    onDragEnd(event: RawPointerData | RawPointerMoveData): boolean {
        return true;
    }
    get isLoaded() {
        return this._isLoaded;
    }
    private _isLoaded = false;
    private loadedListener: ((ths: UI_Image) => void)[] = [];
    private notifyOnLoadedListeners() {
        this._isLoaded = true;
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

    async setImage(urlOrImage: string | HTMLImageElement): Promise<UI_Image> {

        let ths = this;
        this._isLoaded = false;
        if (urlOrImage == null) {
            this.image = new Image();
        } else if (typeof urlOrImage == 'string') {
            this.image = new Image();
            this.image.src = urlOrImage;
            this.image.onload = () => {
                if(ths.image.width == 0){
                    console.log(`Failed to load image ${urlOrImage}, trying again`)
                    ths.setImage(urlOrImage);
                }
                console.log(`Completing listener for ${urlOrImage}`)
                ths.notifyOnLoadedListeners()
            }
            this.image.onerror = (err) => {
                console.log(err);
                this.image = null;
            }

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
            if (isNaN(this.scale)) {
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
    mousePressed(evt: RawPointerData): boolean {
        // this.brist.cursor('grabbing')
        return false;
    }
    mouseReleased(evt: RawPointerData): boolean {
        // this.brist.cursor('grab')
        return false;
    }
    mouseEnter(evt: RawPointerMoveData): boolean {
        return false;
    }
    mouseExit(evt: RawPointerMoveData): boolean {
        // this.brist.cursor('default')
        return false;
    }
    mouseMoved(evt: RawPointerData): boolean {
        return false;
    }
    shouldDragLock(event: RawPointerData): boolean {
        return true;
    }
    mouseDragged(evt: RawPointerMoveData): boolean {
        if (this.offset[0] + evt.delta[0] > 0) {
            let leftoverX = (this.offset[0] + evt.delta[0]);
            evt.delta[0] = leftoverX;
            this.offset[0] = 0;
            console.log(`<0 LeftoverX ${leftoverX}`)
            return true;
        } else if (this.offset[0] + evt.delta[0] + this.imgWidth < this.getWidth()) {
            let leftoverX = this.getWidth() - (this.offset[0] + evt.delta[0] + this.imgWidth);
            evt.delta[0] = leftoverX;
            this.offset[0] += evt.delta[0] - leftoverX;
            console.log(`>${this.getWidth()} LeftoverX ${leftoverX}`)
            return true;
        }
        if (this.offset[1] + evt.delta[1] > 0) {
            let leftoverY = (this.offset[1] + evt.delta[1]);
            evt.delta[1] = leftoverY;
            this.offset[1] = 0;
            console.log(`<0 LeftoverY ${leftoverY}`)
            return true;
        } else if (this.offset[1] + evt.delta[1] + this.imgHeight < this.getHeight()) {
            let leftoverY = this.getHeight() - (this.offset[1] + evt.delta[1] + this.imgHeight);
            evt.delta[1] = leftoverY;
            this.offset[1] += evt.delta[1] - leftoverY;
            console.log(`>${this.getHeight()} LeftoverY ${leftoverY}`)
            return true;
        }
        this.offset[0] += evt.delta[0];
        this.offset[1] += evt.delta[1];
        return true;
    }

    mouseWheel(delta: RawPointerScrollData): boolean {
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

