import { MouseBtnListener, RawPointerMoveData } from "bristolboard";
import {
    FColor, lerp, MouseDragListener, UIFrame_CornerWidthHeight, KeyboardInputEvent,
    MouseInputEvent, MouseScrolledInputEvent,
    Vector2, UICorner, BristolBoard, UIFrameDescription_CornerWidthHeight, UIFrame, UI_ImageElement, UIFrameResult,
    UIElement, optFunc, MainBristol, RawPointerData
} from "../ClientImports";



export class Lung extends UIElement {


    static instCount = 0;
    lungRef: UI_ImageElement;
    base: Vector2 = null;
    root: Vector2 = null;
    baseOffset = [0.5, 0.3]
    colorsAndAlphas: [color: FColor, alpha: () => number][];
    constructor(colorsAndAlphas: [color: FColor, alpha: () => number][], frame: UIFrameDescription_CornerWidthHeight | UIFrame, brist: BristolBoard<any>) {
        super(`Lung${Lung.instCount++}`, UIFrame.Build(frame), brist)
        this.colorsAndAlphas = colorsAndAlphas;
        this.frame.measureHeight = this.frame.measureWidth;
        let refScale = 0.75
        let ths = this;
        let refOffset = [0.08, 0.15]

        this.base = new Vector2({ t: 'leftX', v: () => ths.frame.leftX() }, { t: 'topY', v: () => ths.frame.topY() }).addFunc(new Vector2(this.baseOffset[0], this.baseOffset[1]).scaleFunc({ t: 'frameWidth', v: () => ths.frame.measureWidth() }));
        this.root = this.base.subtractFunc(new Vector2(0, () => (ths.frame.measureWidth() * 0.2))).setName('root');
        // this.buildVector(this.chainData, this.base);
        let refRatio = 151.99 / 300.26
        this.setChainData(this.chainData);
        //this.editable();
        this.show();
    }
    setChainData(data: ChainLink) {
        this.chainData = data;
        this.setLinkAlpha(this.chainData);
    }
    setLinkAlpha(link: ChainLink, last: ChainLink = null) {
        if (last != null) {
            let distance = Math.sqrt(Math.pow(link.vector[0] - last.vector[0], 2) + Math.pow(link.vector[1] - last.vector[1], 2)) + last.distance;
            link.distance = distance;
        } else {
            link.distance = new Vector2(this.baseOffset[0], this.baseOffset[1]).subtract(link.vector).length

        }

        if (link.next != null) {
            let fullDepth = Math.max(this.setLinkAlpha(link.next[0], link),
                this.setLinkAlpha(link.next[1], link));
            link.alpha = link.distance / fullDepth;
            return fullDepth;
        }
        link.alpha = 1;
        return link.distance;
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
    handles: LungHandle[] = []
    editable(link: ChainLink = null) {
        let ths = this;
        if (link == null) {
            while (this.handles.length > 0) {
                this.handles.pop().removeFromParent();
            }
            link = this.chainData;
            let refScale = 0.75
            let refOffset = [0.08, 0.15]
            let refRatio = 151.99 / 300.26
            this.lungRef = new UI_ImageElement({
                x: () => refOffset[0] * ths.getWidth(),
                y: () => refOffset[1] * ths.getHeight(),
                width: () => ths.getHeight() * refRatio * refScale,
                height: ths.getHeight() * refScale,
                measureCorner: UICorner.upLeft,
                parentCorner: UICorner.upLeft
            }, ths.brist, `./LungOutline.png`);
            this.addChild(this.lungRef);
        }
        if (Array.isArray(link.vector)) {
            link.vector = new Vector2(link.vector[0], link.vector[1])
        }
        let handle = new LungHandle(link, this, UIFrame_CornerWidthHeight.Build({
            x: () => ths.getWidth() * (link.vector as Vector2).x,
            y: () => ths.getHeight() * (link.vector as Vector2).y,
            width: 20,
            height: 20,
            measureCorner: UICorner.center
        } as UIFrameDescription_CornerWidthHeight), this.brist)
        this.addChild(handle);
        this.handles.push(handle);
        if (link.next) {
            this.editable(link.next[0])
            this.editable(link.next[1])
        }
    }
    showStartTime: number = -1
    lineThickness: number = 10;
    lineCap: CanvasLineCap = 'round'
    show() {
        this.showStartTime = Date.now();
    }
    onDrawBackground(frame: UIFrameResult, deltaMs: number) {

        this.brist.strokeWeight(this.lineThickness);
        this.brist.ctx.lineCap = this.lineCap;
        for (let i = 0; i < this.colorsAndAlphas.length; i++) {
            this.brist.strokeColor(this.colorsAndAlphas[i][0]);
            this.drawLung(this.colorsAndAlphas[i][1](), frame);
        }

        // this.brist.fillColor(fColor.blue.accent1);
        // this.brist.ctx.beginPath();
        // this.brist.rectFrame(frame, true, false);
        // if (this.showStartTime != -1) {
        //     this.brist.strokeColor(fColor.lightText[0]);
        //     this.brist.ctx.lineCap = 'round'
        //     let drawDist = Math.min((Date.now() - this.showStartTime) / 1000, 1);
        //     this.drawLung(drawDist, frame);

        //     this.brist.strokeColor(fColor.lightText[1]);
        //     this.drawLung((Math.cos(Date.now() / 1000) + 1) / 2, frame);


        // }
    }
    private drawLung(alpha: number, frame: UIFrameResult) {
        this.brist.ctx.beginPath();
        this.brist.ctx.moveTo(this.root.x, this.root.y);
        this.brist.ctx.lineTo(this.base.x, this.base.y);


        this.brist.ctx.stroke();
        this.brist.ctx.beginPath();
        this.brist.ctx.moveTo(this.base.x, this.base.y);
        // this.brist.strokeColor(fColor.green.base);
        //  console.log(drawDist);
        this.drawChainLink(this.chainData, 0, frame, alpha);
        this.brist.noFill();
        this.brist.ctx.stroke();
        this.brist.ctx.beginPath();
        this.brist.ctx.moveTo(this.base.x, this.base.y);
        this.drawChainLink(this.chainData, 1, frame, alpha);
        this.brist.ctx.stroke();
        // this.brist.ctx.moveTo(this.base.x, this.base.y);
        // this.drawChainLink(this.chainData, 1, frame, null);
        // this.brist.ctx.stroke();
        this.brist.ctx.beginPath();
    }
    drawChainLink(chain: ChainLink | [ChainLink, ChainLink], side: 0 | 1, frame: UIFrameResult, drawDistance: number = -1, last: ChainLink = null) {
        if (last == null && !Array.isArray(chain)) {

        }
        if (Array.isArray(chain)) {
            this.drawChainLink(chain[0], side, frame, drawDistance, last);

            this.drawChainLink(chain[1], side, frame, drawDistance, last);
        } else {
            if (Array.isArray(chain.vector)) {
                chain.vector = new Vector2(chain.vector[0], chain.vector[1]);

            }
            let a: [x: number, y: number]
            let b: [x: number, y: number]
            if (last == null) {
                //this.brist.ctx.moveTo(this.base.x, this.base.y);
                a = [this.base.x, this.base.y];
            } else {
                if (Array.isArray(last.vector)) {
                    last.vector = new Vector2(chain.vector[0], chain.vector[1])
                }
                if (side == 0) {
                    //this.brist.ctx.moveTo(frame.left + last.vector.x * frame.width, frame.top + last.vector.y * frame.height);
                    a = [frame.left + last.vector.x * frame.width, frame.top + last.vector.y * frame.height];
                } else {
                    //this.brist.ctx.moveTo(frame.left + ((-1 * (last.vector.x - 0.5)) + 0.5) * frame.width, frame.top + last.vector.y * frame.height);
                    a = [frame.left + ((-1 * (last.vector.x - 0.5)) + 0.5) * frame.width, frame.top + last.vector.y * frame.height];
                }
            }
            this.brist.ctx.moveTo(a[0], a[1]);
            if (side == 0) {
                // this.brist.ctx.lineTo(frame.left + chain.vector.x * frame.width, frame.top + chain.vector.y * frame.height);
                b = [frame.left + chain.vector.x * frame.width, frame.top + chain.vector.y * frame.height]
            } else {
                // this.brist.ctx.lineTo(frame.left + ((-1 * (chain.vector.x - 0.5)) + 0.5) * frame.width, frame.top + chain.vector.y * frame.height);
                b = [frame.left + ((-1 * (chain.vector.x - 0.5)) + 0.5) * frame.width, frame.top + chain.vector.y * frame.height]
            }
            if (drawDistance == -1) {
                this.brist.ctx.lineTo(b[0], b[1]);
            } else if (last == null) {
                let distance = Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2)) / frame.width
                let alpha = Math.min(drawDistance / distance, 1);
                this.brist.ctx.lineTo(lerp(a[0], b[0], alpha), lerp(a[1], b[1], alpha));
            } else {
                let length = chain.distance - (last?.distance ?? 0);
                let relativeDistance = drawDistance - last.distance;
                let alpha = Math.max(0, Math.min(1, relativeDistance / length));
                this.brist.ctx.lineTo(lerp(a[0], b[0], alpha), lerp(a[1], b[1], alpha));
                // this.brist.fillColor(fColor.red.base);
                // this.brist.textSize(10)
                // this.brist.ctx.fillText(`${alpha}`, b[0], b[1]);
            }

            //   this.brist.ctx.bezierCurveTo(frame.left + last.tangent[0] * frame.width, frame.top + last.tangent[1] * frame.height, frame.left + chain.tangent[0] * frame.width, frame.top + chain.tangent[1] * frame.height, frame.left + chain.base[0] * frame.width, frame.top + chain.base[1] * frame.height)
            if (chain.next != null && typeof chain.next != 'undefined' && drawDistance > chain.distance) {
                this.drawChainLink(chain.next, side, frame, drawDistance, chain);
            }
        }

    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {

    }

}
export class LungHandle extends UIElement implements MouseDragListener, MouseBtnListener {
    link: ChainLink;
    lung: Lung;
    constructor(link: ChainLink, parent: Lung, frame: UIFrame, brist: MainBristol) {
        super(UIElement.createUID('lungHandle'), frame, brist);
        this.link = link;
        this.lung = parent;
        this.link.handle = this;
    }
    shouldDragLock(event: RawPointerData | [start: RawPointerData, lastMove: RawPointerMoveData]): boolean {
        return true;
    }
    onDragEnd(event: RawPointerData | RawPointerMoveData): boolean {
        return true;
    }

    onDrawBackground(frame: UIFrameResult, deltaTime: number): void {
        this.brist.fillColor(this.isDragLocked ? fColor.red.base : fColor.blue.base);
        this.brist.ellipseFrame(frame, false, true)
        this.brist.ctx.beginPath();
    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {

    }
    mousePressed(evt: RawPointerData): boolean {
        if (evt.buttonOrFingerIndex == 3 && !this.link.next) {

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
            this.lung.setLinkAlpha(this.link.next[0], this.link);
            this.lung.setLinkAlpha(this.link.next[1], this.link);
            this.lung.editable(this.link.next[0])
            this.lung.editable(this.link.next[1])
        } else if (evt.buttonOrFingerIndex == 2) {
            this.link.next = undefined
            this.lung.editable();
        }
        return false;
    }
    mouseReleased(evt: { start: RawPointerData; end: RawPointerData; timeDown: number; }): boolean {
        return false;
    }


    mouseDragged(evt: RawPointerMoveData): boolean {
        console.log(JSON.stringify(evt));
        let delta = [evt.delta[0] / this.parent.getWidth(), evt.delta[1] / this.parent.getHeight()];
        if (Array.isArray(this.link.vector)) {
            this.link.vector[0] += delta[0];
            this.link.vector[1] += delta[1];
        } else {
            this.link.vector = [
                this.link.vector.x + delta[0],
                this.link.vector.y + delta[1]
            ]
        }

        return true;
    }

 
}
interface ChainLink {
    vector: Vector2 | [number, number]
    curveWeight?: number
    distance?: number
    alpha?: number
    // angle: optFunc<number>
    // distance: optFunc<number>
    next?: [ChainLink, ChainLink],
    handle?: LungHandle
}