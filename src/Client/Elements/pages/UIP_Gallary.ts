

import { UIStackRecycler } from "bristolboard";
import { NumericLiteral } from "typescript";
import { BristolBoard, UIResultCard, UIElement, UIFrame_CornerWidthHeight, UploadResponse, UIFrame, KeyboardInputEvent, MouseBtnInputEvent, MouseDraggedInputEvent, MouseInputEvent, MouseMovedInputEvent, MousePinchedInputEvent, MouseScrolledInputEvent, UIFrameDescription_CornerWidthHeight, UIFrameResult } from "../../ClientImports";
import { UISimilarityCard } from "../UISimilarity";



export class UIP_Gallary_V0 extends UIElement {
    similarityCards: UISimilarityCard[];
    constructor( brist: BristolBoard<any>) {
        super(UIElement.createUID('gallary'), UIFrame.Build({
            x: 0,
            y: 0,
            width: () => brist.width,
            height: () => brist.height
        }), brist);
    }

    yourResult: UploadResponse
    similarResults: UploadResponse[]
    resultCards: (UIResultCard | UIStackRecycler<[string, number, string[]], UISimilarityCard>)[] = []
   
    clearResults() {
        while (this.resultCards.length > 0) {
            this.resultCards.pop().removeFromParent();
        }
    }
    setUploadResponse(resp: UploadResponse) {
        this.clearResults();
        this.yourResult = resp;
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
        let similarityRecycler = UIStackRecycler.GridFixedColumns<[string, number, string[]], UISimilarityCard>(resp.similarity, {
            buildCell: (frame: UIFrame, brist: BristolBoard<any>) => {
                return new UISimilarityCard(frame, brist);
            },
            bindData: (index: number, data: [string, number, string[]], child: UISimilarityCard) => {
                child.setData(data);
            },
            cols: 3,
            rowHeight: () => ((ths.height - ths.margin * 2) / 3)
        }, UIFrame.Build({
            x: () => (ths.width / 2 + ths.margin),
            y: () => ths.margin,
            width: () => ((0.5 * (ths.frame.measureWidth() - (ths.margin * 4)))),
            height: () => (ths.height - ths.margin * 2)
        }), this.brist);

        this.addChild(similarityRecycler);
        this.resultCards.push(similarityRecycler);
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