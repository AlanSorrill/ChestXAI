import {UIFrame_CornerWidthHeight,
    BristolFontFamily, BristolHAlign, BristolVAlign, linearInterp, UIStackRecycler,
    BristolBoard, UIResultCard, UIElement, UISimilarityCard, UploadResponse,
    UIFrame, UIPrototypeCard,
    UIFrameDescription_CornerWidthHeight, UIFrameResult, Interp, DiseaseDefinition, UI_Image, PrototypeData
} from "../../ClientImports";





export class UIP_Gallary_V0 extends UIElement {
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
    setPrototypeData(def: DiseaseDefinition) {
        this.prototypeDataDef = def;
        if (def == null) {
            return
        }
        let ths = this;
        let protoData = this.yourResult.prototypes[def.bitStringID];




        let prototypeAnimation = linearInterp(
            () => ths.getHeight(),
            () => ths.margin,
            () => (ths.hasPrototype ? 'A' : 'B'), {
            durration: 400,
            startAlpha: 1,
            onAnimStart(interp: Interp<number>) {
                ths.brist.requestHighFps(() => interp.isTransitioning)
            }
        });
        if (this.prototypeRecycler != null) {
            this.prototypeRecycler.removeFromParent();
        }
        this.prototypeRecycler = UIStackRecycler.GridFixedColumns<PrototypeData, UIPrototypeCard>(protoData, {
            buildCell: (frame: UIFrame, brist: BristolBoard<any>) => {
                return new UIPrototypeCard(frame, brist);
            },
            bindData: (index: number, data: PrototypeData, child: UIPrototypeCard) => {
                console.log(`Binding ${index}: ${JSON.stringify(data)}`)
                child.setData(data);
                
            },
            cols: 2,
            rowHeight: () => ((ths.getHeight() - ths.margin * 2) / 3)
        }, UIFrame.Build({
            x: () => (ths.getWidth() / 2 + ths.margin / 2),
            y: prototypeAnimation,
            width: () => ((0.5 * (ths.frame.measureWidth() - (ths.margin * 4)))),
            height: () => (ths.getHeight() - ths.margin * 2)
        }), this.brist);
        this.addChild(this.prototypeRecycler)

        // this.similarityRecycler = UIStackRecycler.GridFixedColumns<[string, number, DiseaseDefinition[]], UISimilarityCard>(resp.similarity, {
        //     buildCell: (frame: UIFrame, brist: BristolBoard<any>) => {
        //         return new UISimilarityCard(frame, brist);
        //     },
        //     bindData: (index: number, data: [string, number, DiseaseDefinition[]], child: UISimilarityCard) => {
        //         console.log(`Binding ${index}: ${JSON.stringify(data)}`)
        //         child.setData(data);
        //     },
        //     cols: 3,
        //     rowHeight: () => ((ths.getHeight() - ths.margin * 2) / 3)
        // }, UIFrame.Build({
        //     x: prototypeAnimation,
        //     y: () => ths.margin,
        //     width: () => ((0.5 * (ths.frame.measureWidth() - (ths.margin * 4)))),
        //     height: () => (ths.getHeight() - ths.margin * 2)
        // }), this.brist);
    }
    similarityCards: UISimilarityCard[];
    prototypeRecycler: UIStackRecycler<PrototypeData, any>
    constructor(brist: BristolBoard<any>) {
        super(UIElement.createUID('gallary'), UIFrame.Build({
            x: 0,
            y: 0,
            width: () => brist.getWidth(),
            height: () => brist.getHeight()
        }), brist);
    }

    private prototypeDataDef: DiseaseDefinition = null;
    yourResult: UploadResponse
    yourResultCard: UIResultCard;

    get prototypeData(): DiseaseDefinition {
        return this.prototypeDataDef;
    }

    similarityRecycler: UIStackRecycler<[string, number, DiseaseDefinition[]], UISimilarityCard>

    get hasPrototype() {
        return this.prototypeData != null;
    }


    clearResults() {
        this.yourResultCard?.removeFromParent();
        this.yourResultCard = null;
        this.similarityRecycler?.removeFromParent();
        this.similarityRecycler = null;
    }
    setUploadResponse(resp: UploadResponse) {
        this.clearResults();
        this.yourResult = resp;
        let ths = this;
        this.yourResultCard = new UIResultCard(resp, UIFrame.Build({
            x: () => ths.margin,
            y: () => ths.margin,
            width: () => (0.5 * (ths.frame.measureWidth() - (ths.margin * 2))),
            height: () => (ths.frame.measureHeight() - (ths.margin * 2))
        } as UIFrameDescription_CornerWidthHeight) as any, this.brist);

        this.addChild(this.yourResultCard);


        let similarityAnimation = linearInterp(
            () => (ths.getWidth() / 2 + ths.margin),
            () => ths.getWidth(),
            () => (ths.hasPrototype ? 'A' : 'B'), {
            durration: 400,
            startAlpha: 1,
            onAnimStart(interp: Interp<number>) {
                ths.brist.requestHighFps(() => interp.isTransitioning)
            }
        });

        this.similarityRecycler = UIStackRecycler.GridFixedColumns<[string, number, DiseaseDefinition[]], UISimilarityCard>(resp.similarity, {
            buildCell: (frame: UIFrame, brist: BristolBoard<any>) => {
                return new UISimilarityCard(frame, brist);
            },
            bindData: (index: number, data: [string, number, DiseaseDefinition[]], child: UISimilarityCard) => {
                console.log(`Binding ${index}: ${JSON.stringify(data)}`)
                child.setData(data);
            },
            cols: 3,
            rowHeight: () => ((ths.getHeight() - ths.margin * 2) / 3)
        }, UIFrame.Build({
            x: similarityAnimation,
            y: () => ths.margin,
            width: () => ((0.5 * (ths.frame.measureWidth() - (ths.margin * 4)))),
            height: () => (ths.getHeight() - ths.margin * 2)
        }), this.brist);

        this.addChild(this.similarityRecycler);

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



    private marginAlpha: number = 0.03;
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
        this.brist.textAlign(BristolHAlign.Left, BristolVAlign.Bottom);
        this.brist.textSize(this.margin * 0.4);
        this.brist.fontFamily(BristolFontFamily.Raleway);
        this.brist.fillColor(fColor.lightText[1])
        this.brist.text(`Your Result`, this.margin, this.margin);
        this.brist.textAlign(BristolHAlign.Right, BristolVAlign.Bottom);
        this.brist.text(this.hasPrototype ? `Prototypical ${this.prototypeData.displayName}` : `Similar Results`, this.getWidth() - this.margin, this.margin)
    }

}