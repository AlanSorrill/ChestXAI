

import { BristolBoard, UIResultCard, UIElement, UIFrame_CornerWidthHeight, UploadResponse, UIFrame, KeyboardInputEvent, MouseBtnInputEvent, MouseDraggedInputEvent, MouseInputEvent, MouseMovedInputEvent, MousePinchedInputEvent, MouseScrolledInputEvent, UIFrameDescription_CornerWidthHeight, UIFrameResult } from "../../ClientImports";
import { UISimilarityCard } from "../UISimilarity";



export class UIP_Gallary_V0 extends UIElement {
    similarityCards: UISimilarityCard[];
    constructor(id: string, uiFrame: UIFrame_CornerWidthHeight, brist: BristolBoard<any>) {
        super(id, uiFrame, brist);
    }

    yourResult: UploadResponse
    similarResults: UploadResponse[]
    resultCards: (UIResultCard | UISimilarityCard)[] = []
    clearResults() {
        while (this.resultCards.length > 0) {
            this.resultCards.pop().removeFromParent();
        }
    }
    setUploadResponse(resp: UploadResponse) {
        this.clearResults();
        let ths = this;
        let diagnosisCard = new UIResultCard(resp, UIFrame.Build({
            x: () => ths.margin,
            y: () => ths.margin,
            width: () => (0.5 * (ths.frame.measureWidth() - (ths.margin * 2))),
            height: () => (ths.frame.measureHeight() - (ths.margin * 2))
        } as UIFrameDescription_CornerWidthHeight) as any, this.brist);

        this.addChild(diagnosisCard);
        this.resultCards.push(diagnosisCard)

        let box = {
            left: () => (ths.margin * 2 + (0.5 * (ths.frame.measureWidth() - (ths.margin * 2)))),
            right: () => (ths.frame.measureWidth() - ths.margin),
            top: () => (ths.margin),
            bottom: () => (ths.frame.measureHeight() - ths.margin),
            width: () => (box.right() - box.left()),
            height: () => (box.bottom() - box.top())
        }
        // let adapter = new ArrayGridRecyclerAdapter<[string,number], UISimilarityCard>(resp.similarity, {
        //     limit: {
        //         columns: 3
        //     }
        // });
        // let recycler = new UIGridRecycler(adapter, UIFrame.Build(
        //     {
        //         x: box.left,
        //         y: box.top,
        //         width: box.width,
        //         height: box.height
        //     }
        // ), this.brist);
        // this.addChild(recycler);
        // let cardWidth = () => (box.width() - ths.padding) / 2
        // let cardHeight = () => (box.height() - this.padding) / 2
        // this.similarityCards = [
        //     new UISimilarityCard(UIFrame.Build({
        //         x: box.left,
        //         y: box.top,
        //         width: cardWidth,
        //         height: cardHeight
        //     }), this.brist),
        //     new UISimilarityCard(UIFrame.Build({
        //         x: () => (box.left() + ths.padding + cardWidth()),
        //         y: box.top,
        //         width: cardWidth,
        //         height: cardHeight
        //     }), this.brist),
        //     new UISimilarityCard(UIFrame.Build({
        //         x: box.left,
        //         y: ()=>(box.top() + ths.padding + cardHeight()),
        //         width: cardWidth,
        //         height: cardHeight
        //     }), this.brist),
        //     new UISimilarityCard(UIFrame.Build({
        //         x: () => (box.left() + ths.padding + cardWidth()),
        //         y: ()=>(box.top() + ths.padding + cardHeight()),
        //         width: cardWidth,
        //         height: cardHeight
        //     }), this.brist)
        // ]
        // for (let i = 0; i < Math.min(ths.similarityCards.length, resp.similarity.length); i++) {
        //     ths.similarityCards[i].setData(resp.similarity[i])
        //     this.addChild(ths.similarityCards[i]);
        //     this.resultCards.push(ths.similarityCards[i])
        // }
    }


    private marginAlpha: number = 0.05;
    private paddingAlpha: number = 0.025;
    get margin() {
        return this.frame.measureWidth() * this.marginAlpha;
    }
    get padding() {
        return this.frame.measureWidth() * this.paddingAlpha;
    }


    onDrawBackground(frame: UIFrameResult, deltaTime: number): void {

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