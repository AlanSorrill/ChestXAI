import { UIFrame_CornerWidthHeight } from "bristolboard";
import { KeyboardInputEvent, MouseBtnInputEvent, MouseDraggedInputEvent, MouseInputEvent, MouseMovedInputEvent, MousePinchedInputEvent, MouseScrolledInputEvent, UIFrame_CenterRadius, Vector2, UICorner, BristolBoard, UIFrameDescription_CornerWidthHeight, UIFrame, UI_ImageElement, UIFrameResult, UIElement, optFunc, MainBristol } from "../ClientImports";



export class Lung extends UIElement {


    static instCount = 0;
    lungRef: UI_ImageElement;
    base: Vector2 = null;
    root: Vector2 = null;
    constructor(frame: UIFrameDescription_CornerWidthHeight | UIFrame, brist: BristolBoard<any>) {
        super(`Lung${Lung.instCount++}`, UIFrame.Build(frame), brist)
        this.frame.measureHeight = this.frame.measureWidth;
        let refScale = 0.75
        let ths = this;
        let refOffset = [0.08, 0.15]
        this.base = new Vector2({ t: 'leftX', v: () => ths.frame.leftX() }, { t: 'topY', v: () => ths.frame.topY() }).addFunc(new Vector2(0.5, 0.3).scaleFunc({ t: 'frameWidth', v: () => ths.frame.measureWidth() }));
        this.root = this.base.subtractFunc(new Vector2(0, () => (ths.frame.measureWidth() * 0.2))).setName('root');
        // this.buildVector(this.chainData, this.base);
        let refRatio = 151.99 / 300.26
        this.lungRef = new UI_ImageElement({
            x: () => refOffset[0] * ths.width,
            y: () => refOffset[1] * ths.height,
            width: () => ths.height * refRatio * refScale,
            height: ths.height * refScale,
            measureCorner: UICorner.upLeft,
            parentCorner: UICorner.upLeft
        }, brist, `./LungOutline.png`);
        this.addChild(this.lungRef);
    }
    setChainData(data: ChainLink) {

    }
    // buildVector(chain: ChainLink, parent: Vector2 = null) {
    //     let ths = this;
    //     let baseVector = Vector2.scaleFunc(Vector2.polar(chain.angle, chain.distance), () => ths.width);
    //     if (parent != null) {
    //         chain.vector = Vector2.addFunc(baseVector, parent);
    //     } else {
    //         chain.vector = baseVector;
    //     }
    //     if (typeof chain.next != 'undefined') {
    //         if (Array.isArray(chain.next)) {
    //             this.buildVector(chain.next[0], chain.vector)
    //             this.buildVector(chain.next[1], chain.vector)
    //         } else {
    //             this.buildVector(chain.next, chain.vector)
    //         }
    //     }
    // }
    exportChainString() {
        console.log(JSON.stringify(this.exportChainData()).replaceAll('"', ''))
    }
    exportChainData(chain: ChainLink = null) {
        if (chain == null) {
            chain = this.chainData;
        }
        if (!Array.isArray(chain.vector)) {
            chain.vector = [chain.vector.x, chain.vector.y];
        }
        let out: ChainLink = {
            vector: chain.vector,

        }
        if (chain.next) {
            out.next = [null, null]
            if (chain.next[0]) {
                out.next[0] = this.exportChainData(chain.next[0])
            }
            if (chain.next[1]) {
                out.next[1] = this.exportChainData(chain.next[1])
            }
        }
        return out;
    }
    chainData: ChainLink = { vector: [0.42, 0.384], next: [{ vector: [0.34800000000000003, 0.32199999999999995], next: [{ vector: [0.3600000000000001, 0.24199999999999994], next: [{ vector: [0.3600000000000002, 0.16599999999999995] }, { vector: [0.44800000000000006, 0.2579999999999999] }] }, { vector: [0.2799999999999999, 0.3019999999999998], next: [{ vector: [0.24399999999999997, 0.23399999999999985] }, { vector: [0.18799999999999972, 0.33799999999999975] }] }] }, { vector: [0.44000000000000006, 0.472], next: [{ vector: [0.3700000000000001, 0.4760000000000001], next: [{ vector: [0.2940000000000001, 0.4440000000000002], next: [{ vector: [0.2180000000000001, 0.4760000000000003], next: [{ vector: [0.16600000000000015, 0.4240000000000004] }, { vector: [0.12999999999999995, 0.5240000000000002] }] }, { vector: [0.27, 0.368] }] }, { vector: [0.32599999999999996, 0.528], next: [{ vector: [0.24199999999999997, 0.5480000000000002] }, { vector: [0.30999999999999983, 0.604] }] }] }, { vector: [0.44000000000000006, 0.5879999999999999], next: [{ vector: [0.3640000000000001, 0.652], next: [{ vector: [0.24400000000000005, 0.6760000000000002], next: [{ vector: [0.18800000000000008, 0.6120000000000002] }, { vector: [0.17199999999999993, 0.7040000000000001], next: [{ vector: [0.10799999999999996, 0.6000000000000001] }, { vector: [0.09199999999999978, 0.724] }] }] }, { vector: [0.30799999999999994, 0.776], next: [{ vector: [0.21199999999999994, 0.7880000000000001], next: [{ vector: [0.0799999999999999, 0.7800000000000002] }, { vector: [0.1599999999999998, 0.8920000000000001] }] }, { vector: [0.2919999999999998, 0.876] }] }] }, { vector: [0.43199999999999994, 0.7759999999999999], next: [{ vector: [0.388, 0.74] }, { vector: [0.3759999999999998, 0.8639999999999999] }] }] }] }] };
    editable(link: ChainLink = null) {
        if (link == null) {
            link = this.chainData;
        }
        if (Array.isArray(link.vector)) {
            link.vector = new Vector2(link.vector[0], link.vector[1])
        }
        let ths = this;
        let handle = new LungHandle(link, this, UIFrame_CornerWidthHeight.Build({
            x: () => ths.width * (link.vector as Vector2).x,
            y: () => ths.height * (link.vector as Vector2).y,
            width: 20,
            height: 20,
            measureCorner: UICorner.center
        } as UIFrameDescription_CornerWidthHeight), this.brist)
        this.addChild(handle);
        if (link.next) {
            this.editable(link.next[0])
            this.editable(link.next[1])
        }
    }
    onDrawBackground(frame: UIFrameResult, deltaMs: number) {


        this.brist.fillColor(fColor.blue.accent1);
        this.brist.ctx.beginPath();
        this.brist.strokeColor(fColor.lightText[1]);
        this.brist.strokeWeight(10);
        this.brist.rectFrame(frame, true, false);
        this.brist.ctx.beginPath();
        this.brist.ctx.moveTo(this.root.x, this.root.y);
        this.brist.ctx.lineTo(this.base.x, this.base.y);
        this.brist.strokeColor(fColor.lightText[1]);


        this.brist.ctx.stroke();
        this.brist.ctx.beginPath();
        this.brist.ctx.moveTo(this.base.x, this.base.y);
        this.brist.strokeColor(fColor.green.base);
        this.drawChainLink(this.chainData, 0, frame, null);
        this.brist.noFill();
        this.brist.ctx.stroke();
        this.brist.ctx.beginPath();
        this.brist.ctx.moveTo(this.base.x, this.base.y);
        this.drawChainLink(this.chainData, 1, frame, null);
        this.brist.ctx.stroke();
        // this.brist.ctx.moveTo(this.base.x, this.base.y);
        // this.drawChainLink(this.chainData, 1, frame, null);
        // this.brist.ctx.stroke();
        this.brist.ctx.beginPath();
    }
    drawChainLink(chain: ChainLink | [ChainLink, ChainLink], side: 0 | 1, frame: UIFrameResult, last: ChainLink = null) {
        if (last == null && !Array.isArray(chain)) {

        }
        if (Array.isArray(chain)) {
            this.drawChainLink(chain[0], side, frame, last);

            this.drawChainLink(chain[1], side, frame, last);
        } else {
            if (Array.isArray(chain.vector)) {
                chain.vector = new Vector2(chain.vector[0], chain.vector[1]);

            }
            if (last == null) {
                this.brist.ctx.moveTo(this.base.x, this.base.y);
            } else {
                if (Array.isArray(last.vector)) {
                    last.vector = new Vector2(chain.vector[0], chain.vector[1])
                }
                if (side == 0) {
                    this.brist.ctx.moveTo(frame.left + last.vector.x * frame.width, frame.top + last.vector.y * frame.height);
                } else {
                    this.brist.ctx.moveTo(frame.left + ((-1 * (last.vector.x - 0.5)) + 0.5) * frame.width, frame.top + last.vector.y * frame.height);
                }
            }
            if (side == 0) {
                this.brist.ctx.lineTo(frame.left + chain.vector.x * frame.width, frame.top + chain.vector.y * frame.height);
            } else {

                this.brist.ctx.lineTo(frame.left + ((-1 * (chain.vector.x - 0.5)) + 0.5) * frame.width, frame.top + chain.vector.y * frame.height);
            }
            //   this.brist.ctx.bezierCurveTo(frame.left + last.tangent[0] * frame.width, frame.top + last.tangent[1] * frame.height, frame.left + chain.tangent[0] * frame.width, frame.top + chain.tangent[1] * frame.height, frame.left + chain.base[0] * frame.width, frame.top + chain.base[1] * frame.height)
            if (chain.next != null && typeof chain.next != 'undefined') {
                this.drawChainLink(chain.next, side, frame, chain);
            }
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
export class LungHandle extends UIElement {
    link: ChainLink;
    lung: Lung;
    constructor(link: ChainLink, parent: Lung, frame: UIFrame, brist: MainBristol) {
        super(UIElement.createUID('lungHandle'), frame, brist);
        this.link = link;
        this.lung = parent;
    }
    onDrawBackground(frame: UIFrameResult, deltaTime: number): void {
        this.brist.fillColor(this.isDragLocked ? fColor.red.base : fColor.blue.base);
        this.brist.ellipseFrame(frame, false, true)
        this.brist.ctx.beginPath();
    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {

    }
    mousePressed(evt: MouseBtnInputEvent): boolean {
        if (evt.btn == 3 && !this.link.next) {

            let offset: (x: number, y: number) => [number, number] = (x: number, y: number) => {
                if (Array.isArray(this.link.vector)) {
                    this.link.vector = new Vector2(this.link.vector[0], this.link.vector[1]);
                }
                return [this.link.vector.x + x, this.link.vector.y + y]
            }
            this.link.next = [
                { vector: offset(-0.1, -0.1) },
                { vector: offset(0.1, 0.1) }
            ]
            this.lung.editable(this.link.next[0])
            this.lung.editable(this.link.next[1])
        }
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
        return true;
    }
    mouseDragged(evt: MouseDraggedInputEvent): boolean {
        console.log(JSON.stringify(evt));
        let delta = [evt.deltaX / this.parent.width, evt.deltaY / this.parent.height];
        if (Array.isArray(this.link.vector)) {
            this.link.vector[0] += delta[0];
            this.link.vector[1] += delta[1];
        } else {
            this.link.vector = [
                this.link.vector.x + delta[0],
                this.link.vector.y + delta[1]
            ]
        }

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
interface ChainLink {
    vector: Vector2 | [number, number]
    curveWeight?: number
    // angle: optFunc<number>
    // distance: optFunc<number>
    next?: [ChainLink, ChainLink]
}