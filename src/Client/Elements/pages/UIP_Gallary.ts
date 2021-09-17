import { UIFrameDescription_CenterRadius, UIFrameDescription_CornerWidthHeight } from "bristolboard";
import { BristolBoard, UIResultCard, UIElement, UIFrame_CornerWidthHeight, UploadResponse, UIFrame } from "../../ClientImports";



export class UIP_Gallary_V0 extends UIElement {
    constructor(id: string, uiFrame: UIFrame_CornerWidthHeight, brist: BristolBoard<any>) {
        super(id, uiFrame, brist);
    }
    yourResult: UploadResponse
    similarResults: UploadResponse[]
    resultCards: UIResultCard[] = []
    clearResults() {
        while (this.resultCards.length > 0) {
            this.resultCards.pop().removeFromParent();
        }
    }
    setUploadResponse(resp: UploadResponse) {
        this.clearResults();
        let ths = this;
        let card = new UIResultCard(resp, UIFrame.Build({
            x: () => ths.margin,
            y: () => ths.margin,
            width: () => (ths.frame.measureWidth() - (ths.margin * 2)) / 3,
            height: () => (ths.frame.measureHeight() - (ths.margin * 2))
        } as UIFrameDescription_CornerWidthHeight) as any, this.brist);
        
        this.addChild(card);
        this.resultCards.push(card)
    }


    private marginAlpha: number = 0.05;
    get margin() {
        return this.frame.measureWidth() * this.marginAlpha;
    }
}