import { BristolBoard, CoordType, KeyboardInputEvent, logger, RawPointerData, UIElement, UIFrame, UIFrameResult, UIP_Gallary_V0, UIP_Loading, UIP_Upload_V0, UploadResponse, UrlDataType, UrlListener } from "../ClientImports";







let log = logger.local('RootElement');



// export class CardBristol extends BristolBoard {

//     padding: number = 8;
//     // machine: SlotMachine;
//    // message: SpecialMessage;
//     constructor(containerDivElem: HTMLDivElement, buildRootElement: (brist: CardBristol) => Promise<UIElement>) {
//         super(containerDivElem, buildRootElement as (board: BristolBoard)=> Promise<UIElement>);
//         let ths = this;
//         // this.machine = new SlotMachine('theMachine', new UIFrame_CornerWidthHeight(0, 0, this.width), this);
//         // this.machine.frame.relY = () => (ths.height / 2 - ths.machine.frame.measureHeight() / 2);
//         // this.message = new SpecialMessage('message', ()=>'Happy Birthday Christina!', new UIFrame_CornerWidthHeight(0,0, ths.width, ths.machine.frame.relY), this)
//         // this.addUiElement(this.message)
//         // this.addUiElement(this.machine);

//     }

//     async onInit(): Promise<void> {
//         let ths = this;

//     }
//     // mousePressed(evt: MouseBtnInputEvent) {
//     //     return this.machine.lever.mousePressed(evt);
//     // }

//     //  mouseReleased(evt: { start: RawPointerData; end: RawPointerData; timeDown: number; }) {
//     //     return this.machine.lever.mouseReleased(evt);
//     // }
//     // mouseDragged(evt: MouseDraggedInputEvent) {
//     //     return this.machine.lever.mouseDragged(evt);
//     // }




// }

export class UI_ChestXAI extends UIElement implements UrlListener {

    currentPage: UIP_Upload_V0 | UIP_Gallary_V0 | UIP_Loading = null




    constructor(brist: BristolBoard<UI_ChestXAI>) {
        super('rootElem', UIFrame.Build({
            x: 0,
            y: 0,
            coordType: CoordType.Absolute,
            width: () => brist.getWidth(),
            height: () => brist.getHeight()
        }), brist);
        this.parent = brist;
        // let lung = new Lung({
        //     x: () => (ths.frame.result.width / 2),
        //     y: () => (ths.frame.result.height / 2),
        //     measureCorner: UICorner.center,
        //     width: 800, height: 800
        // }, this.brist);
        // this.addChild(lung);
        // this.pageTypes = {
        //     upload: [UIP_Upload_V0],
        //     gallary: [UIP_Gallary_V0]
        // }
    }
    showUpload(): UIP_Upload_V0 {
        this.currentPage?.removeFromParent();
        this.currentPage = new UIP_Upload_V0(this.brist);
        this.addChild(this.currentPage)
        return this.currentPage;
    }
    showGallary(uploadResponse: UploadResponse): UIP_Gallary_V0 {
        this.currentPage?.removeFromParent();
        this.currentPage = new UIP_Gallary_V0(this.brist);
        this.addChild(this.currentPage)
        this.currentPage.setUploadResponse(uploadResponse);
        return this.currentPage;
    }
    showLoading(message: string) {
        this.currentPage?.removeFromParent();
        this.currentPage = new UIP_Loading(message, this.brist);
        this.addChild(this.currentPage);
        return this.currentPage;
    }

    onUrlParamSet(key: string, value: UrlDataType): void {
        switch (key) {
            case 'upload':
                this.showLoading('Loading');
                let ths = this;
                fetch(`${window.location.origin}/reuse?upload=${value}`).then(async (httpResp: Response) => {
                    let resp: UploadResponse = await httpResp.json();
                    log.info(`Upload responded `, resp);
                    // let blob = await UIP_Upload_V0.fileToBlob(file);
                    // resp.imageBlob = blob;
                    // urlManager.set('upload',resp.fileName,false);
                    let gallary: UIP_Gallary_V0 = ths.showGallary(resp);
                    gallary.setUploadResponse(resp);
                }).catch()
                break;
            default:
                log.error(`Unknown URL parameter: ${key}`)
                break;
        }
        // this.setPage(urlManager.page, urlManager.version);
    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {
    }

    // mousePressed(evt: MouseBtnInputEvent) {
    //     this.addChild(new TestDot(UIFrame.Build({ x: evt.x, y: evt.y, radius: 10 }), this.brist, fColor.green.accent1));
    //     return true;
    // }
    //  mouseReleased(evt: { start: RawPointerData; end: RawPointerData; timeDown: number; }) {

    //     return true;
    // }
    onDrawBackground(frame: UIFrameResult, deltaMs: number) {
        this.brist.fillColor(fColor.darkMode[0]);
        this.brist.rectFrame(this.frame, false, true);
        this.brist.ctx.beginPath();
        // this.brist.strokeColor(fColor.green.lighten2);
        // this.brist.strokeWeight(2);
        // this.brist.line(frame.left, frame.top, frame.right, frame.bottom);
    }
}