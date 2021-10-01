

import { ArrayRecyclerAdapter, RecyclerAdapter } from "bristolboard";
import { UIRecycler,UIP_Gallary_V0, UIFrameResult, MouseBtnInputEvent, MouseMovedInputEvent, MouseDraggedInputEvent, MousePinchedInputEvent, KeyboardInputEvent, MouseScrolledInputEvent, LogLevel, UIButton, BristolBoard, UIElement, UICorner, BristolFontFamily, MouseInputEvent, UIFrame_CornerWidthHeight, MouseState, UIProgressBar, logger, UploadResponse, ClientSession, UIFrame, UIFrameDescription_CornerWidthHeight, Lung, linearInterp, UISimilarityCard, SimilarityResult } from "../../ClientImports";
let log = logger.local("UIP_Upload")

log.allowBelowLvl(LogLevel.naughty);


export class UIP_Upload_V0 extends UIElement {


    progress: number = 0;
    lung: Lung;


    constructor(id: string, uiFrame: UIFrame_CornerWidthHeight, brist: BristolBoard<any>) {
        super(id, uiFrame, brist);

        let ths = this;
        let inputElem: HTMLInputElement = document.getElementById('uploadInput') as HTMLInputElement;
        inputElem.style.display = 'inline'
        inputElem.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                ths.uploadFile(this.files[0])
                // Rest.post('./upload', {'Content-Type': ''})
            }
        })

        let uploadButton = new UIButton('Upload', () => {
            log.info('Showing file chooser')
            inputElem.click();
        }, {
            x: () => ths.frame.centerX(),
            y: () => ths.frame.centerY() + 120,
            width: 100,
            height: 100,
            measureCorner: UICorner.center
        }, brist);


        uploadButton.textSize = 36 * 2;
        uploadButton.fontFamily = BristolFontFamily.Roboto
        uploadButton.autoWidth().autoHeight().autoPadding();
        uploadButton.backgroundColor = (mouse: MouseState) => {
            switch (mouse) {
                case MouseState.Gone:
                    return fColor.red.base
                case MouseState.Pressed:
                    return fColor.red.darken1
                case MouseState.Over:
                    return fColor.red.lighten2
            }
        };
        let progressBar = new UIProgressBar(() => ths.progress, {
            x: () => uploadButton.frame.leftX(),
            y: () => uploadButton.frame.bottomY(),
            width: () => uploadButton.frame.measureWidth(),
            height: 20
        }, brist);
        progressBar.foregroundColor = fColor.red.lighten2

        this.addChild(uploadButton);
        this.addChild(progressBar)

        let lung = new Lung(UIFrame.Build<UIFrameDescription_CornerWidthHeight>({
            x: () => ths.centerX,
            y: () => ths.centerY - 250,
            width: 500, height: 500,
            measureCorner: UICorner.center
        }), brist);
        this.lung = lung;
        this.addChild(lung);
        // this.lung.editable();
        // let isOn = true;
        // let tstBtn = new UIButton('test', () => {
        //     isOn = !isOn;
        // }, new UIFrame_CornerWidthHeight({
        //     x: 100,
        //     y: 100,
        //     width: 300,
        //     height: 100
        // }), brist);
        // tstBtn.textSize = 20;

        // let tstProg = new UIProgressBar(linearInterp(0, 1, ()=>isOn ? 'A' : 'B', 1000, 0), new UIFrame_CornerWidthHeight({
        //     x: 100,
        //     y: 200,
        //     width: ()=>tstBtn.width,
        //     height: 100
        // }), brist);
        // this.addChild(tstProg);
        // this.addChild(tstBtn);
        // let data: SimilarityResult[] = [];
        // let adapter = new ArrayRecyclerAdapter<SimilarityResult, UISimilarityCard>(data, {
        //     limit: {columns: 2}
        // })
        // let testRecycler = new UIRecycler(adapter, UIFrame_CornerWidthHeight.Build({
        //     x: 200,
        //     y: 500,
        //     width: 800,
        //     height: 800
        // } ), brist);
        // this.addChild(testRecycler);
        
    }

    uploadFile(file: File) {
        console.log('Uploading file');
        console.log(file);

        // ClientSession.fileToStream(file).then((stream: ReadableStream) => {
        //     log.info('Upload streaming start')
        //     fetch('./uploadStream', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': file.type,
        //             'originalName': file.name
        //         },
        //          body: stream
        //     })
        // })

        let formData = new FormData();
        formData.append('file', file);
        var ajax = new XMLHttpRequest();
        let ths = this;
        // ajax.upload.addEventListener("progress", function (event: ProgressEvent<XMLHttpRequestEventTarget>) {
        //     ths.progress = event.loaded / event.total;
        //     console.log(ths.progress);
        // }, false);
        ajax.upload.onprogress = function (event: ProgressEvent<XMLHttpRequestEventTarget>) {
            ths.progress = event.loaded / event.total;
            console.log(ths.progress);
        }
        ajax.upload.addEventListener("load", function (event: ProgressEvent<XMLHttpRequestEventTarget>) {
            //complete
            log.info('Upload complete', ajax.response);
        }, false);
        ajax.upload.addEventListener("error", function (event: ProgressEvent<XMLHttpRequestEventTarget>) {

            log.error('Upload error', event);
        }, false);
        ajax.addEventListener("abort", function (event: ProgressEvent<XMLHttpRequestEventTarget>) {
            log.error('Upload abort', event)
        }, false);

        ajax.addEventListener('readystatechange', function (event: ProgressEvent<XMLHttpRequestEventTarget>) {
            if (ajax.readyState == XMLHttpRequest.DONE) {
                let resp: UploadResponse = JSON.parse(ajax.responseText)
                log.info(`Upload responded `, resp);
                let gallary: UIP_Gallary_V0 = mainBristol.rootElement.setPage('gallary') as any;
                gallary.setUploadResponse(resp);
                //                 if (resp.success)
                //                     urlManager.set('seshId', resp.uploadId)
            } else {
                log.info('Ready state changed!', event);
            }

        })
        ajax.open("POST", "/upload");
        // ajax.setRequestHeader("multipart/form-data", file.type)
        //  ajax.setRequestHeader("X_FILE_NAME", file.name); 
        //  ajax.setRequestHeader("Content-Length", file.size + '');
        ajax.send(formData);

    }
    // mouseEnter(evt: MouseInputEvent){
    //     this.isMouseOver = true;
    //     return true;
    // }

    // mouseExit(evt: MouseInputEvent){
    //     this.isMouseOver = false;
    //     return true;
    // }
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
export class StreamDebugger<I, O> implements Transformer<any, any>{

}
