
import { Vector2 } from "../../Common/Vector";
import { UICorner, BristolBoard, UIFrameDescription_CornerWidthHeight, UIFrame, UI_ImageElement, UIFrameResult, UIElement, optFunc } from "../ClientImports";



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
    chainData: ChainLink = {
        vector: [0.42, 0.4],
        next: [
            { vector: [0.32, 0.35] },
            { vector: [0.38, 0.5] }
        ]
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
        this.brist.ctx.moveTo(this.base.x, this.base.y);
        this.drawChainLink(this.chainData, 1, frame, null);
        this.brist.ctx.stroke();
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
}

interface ChainLink {
    vector: Vector2 | [number, number]
    curveWeight?: number
    // angle: optFunc<number>
    // distance: optFunc<number>
    next?: [ChainLink, ChainLink]
}