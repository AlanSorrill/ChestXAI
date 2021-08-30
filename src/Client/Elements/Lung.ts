import { UICorner } from "../Bristol/UIFrame";
import { FHTML, BristolBoard, UIFrameDescription_CornerWidthHeight, UIFrame, UIFrameDescription, UIFrameResult, UIElement, optFunc } from "../clientImports";
import { UI_ImageElement } from "./UI_ImageElement";


export class Lung extends UIElement {
    static instCount = 0;
    lungRef: UI_ImageElement;

    constructor(frame: UIFrameDescription_CornerWidthHeight | UIFrame, brist: BristolBoard<any>) {
        super(`Lung${Lung.instCount++}`, UIFrame.Build(frame), brist)
        this.frame.measureHeight = this.frame.measureWidth;
        let refScale = 2
        this.lungRef = new UI_ImageElement({ x: 60, y: 110, width: 151.99 * refScale, height: 300.26 * refScale, measureCorner: UICorner.upLeft, parentCorner: UICorner.upLeft }, brist, `./LungOutline.png`);
        this.addChild(this.lungRef);
    }
    chainData: ChainLink = {
        base: [0.5, 0.1],
      //  tangent: [0.5, 0.32],
        next: {
            base: [0.5, 0.35],
           // tangent: [0.5, 0.37]
        }
    }
    onDrawBackground(frame: UIFrameResult, deltaMs: number) {


        this.brist.fillColor(fColor.blue.accent1);
        this.brist.ctx.beginPath();
        this.brist.strokeColor(fColor.lightText[1]);
        this.brist.strokeWeight(10);
        this.brist.rectFrame(frame, true, false);

        this.drawChainLink(this.chainData, frame, null);
        this.brist.ctx.stroke();
    }
    drawChainLink(chain: ChainLink | [ChainLink, ChainLink], frame: UIFrameResult, last: ChainLink = null) {
        if (last == null && !Array.isArray(chain)) {
            this.brist.ctx.beginPath();
            this.brist.ctx.moveTo(frame.left + chain.base[0] * frame.width, frame.top + chain.base[1] * frame.height);
            this.drawChainLink(chain.next, frame, chain);
            return;
        }
        if (Array.isArray(chain)) {
            this.drawChainLink(chain[0], frame, last);
            this.drawChainLink(chain[1], frame, last);
        } else {
         //   this.brist.ctx.bezierCurveTo(frame.left + last.tangent[0] * frame.width, frame.top + last.tangent[1] * frame.height, frame.left + chain.tangent[0] * frame.width, frame.top + chain.tangent[1] * frame.height, frame.left + chain.base[0] * frame.width, frame.top + chain.base[1] * frame.height)
            if (chain.next != null && typeof chain.next != 'undefined') {
                this.drawChainLink(chain.next, frame, chain);
            }
        }

    }
}

 interface ChainLink {
    base: [number, number],//x,y
    curveWeight?: number
    angle?: number
    length?: number
    next?: ChainLink | [ChainLink, ChainLink]
}