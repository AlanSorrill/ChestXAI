

import { BristolHAlign, BristolVAlign, UIStackOptions } from "bristolboard";
import { UIP_Gallary_V0, UIFrameResult, MouseBtnInputEvent, MouseMovedInputEvent, MouseDraggedInputEvent, MousePinchedInputEvent, KeyboardInputEvent, MouseScrolledInputEvent, LogLevel, UIButton, BristolBoard, UIElement, UICorner, BristolFontFamily, MouseInputEvent, UIFrame_CornerWidthHeight, MouseState, UIProgressBar, logger, UploadResponse, ClientSession, UIFrame, UIFrameDescription_CornerWidthHeight, Lung, linearInterp, UISimilarityCard,  UIStackRecycler } from "../../ClientImports";
let log = logger.local("UIP_Upload")

log.allowBelowLvl(LogLevel.naughty);

//TODO remove this
export class TestElement extends UIElement {
    data: [number, string] = [-1, ''];
    onDrawBackground(frame: UIFrameResult, deltaTime: number): void {
        this.brist.ctx.beginPath();
        this.brist.fillColor(fColor.purple.base)
        this.brist.rectFrame(frame, false, true);

        this.brist.strokeColor(fColor.purple.darken4);
        this.brist.strokeWeight(4);
        this.brist.rectFrame(frame, true, false)
        this.brist.noStroke();


        this.brist.fillColor(fColor.lightText[1])
        this.brist.textSize(frame.height / 8);
        this.brist.fontFamily(BristolFontFamily.Raleway)
        this.brist.textAlign(BristolHAlign.Left, BristolVAlign.Top);
        this.brist.text(`${this.data[0]}`, frame.left, frame.top);
        this.brist.textAlign(BristolHAlign.Right, BristolVAlign.Bottom);
        this.brist.text(`${this.data[1]}`, frame.right, frame.bottom)
    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {

    }
    setData(index: number, name: string) {
        this.data = [index, name]
    }

}

export class UIP_Upload_V0 extends UIElement {


    progress: number = 0;
    lung: Lung;


    constructor(brist: BristolBoard<any>) {
        super(UIElement.createUID('Upload'), UIFrame.Build({
            x: 0,
            y: 0,
            width: () => brist.width,
            height: () => brist.height
        }), brist)

        let ths = this;
        let inputElem: HTMLInputElement = document.getElementById('uploadInput') as HTMLInputElement;
        inputElem.style.display = 'inline'
        inputElem.addEventListener('change', function () {
            ths.lung.show();
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
        uploadButton.fontFamily = BristolFontFamily.Raleway
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
        // let testData: [string, number][] = [['patient64700/study1/view1_frontal.jpg', 0.3],
        // ['patient64701/study1/view1_frontal.jpg', 0.4], ['patient64702/study1/view1_frontal.jpg', 0.4], ['patient64703/study1/view1_frontal.jpg', 0.4]]


        // let verticalAdapter: UIStackOptions<[string, number], UISimilarityCard> = {
        //     childLength: function (index: number): number {
        //         return 300
        //     },
        //     buildChild: function (frame: UIFrame, brist: BristolBoard<any>): UISimilarityCard {
        //         return new UISimilarityCard(frame, brist);
        //     },
        //     bindData: function (index: number, data: [string, number], child: UISimilarityCard): void {
        //         child.setData(data);
        //     },
        //     isVertical: true
        // }
        // let horizontalAdapter: UIStackOptions<[string, number], UISimilarityCard> = {
        //     childLength: function (index: number): number {
        //         return 200
        //     },
        //     buildChild: function (frame: UIFrame, brist: BristolBoard<any>): UISimilarityCard {
        //         return new UISimilarityCard(frame, brist);
        //     },
        //     bindData: function (index: number, data: [string, number], child: UISimilarityCard): void {
        //         child.setData(data);
        //     },
        //     isVertical: false
        // }

        // let verticalTestRecycler = new UIStackRecycler<[string, number], UISimilarityCard>(testData, verticalAdapter, UIFrame_CornerWidthHeight.Build({
        //     x: 200,
        //     y: 500,
        //     width: 200,
        //     height: 900
        // }), brist);
        // this.addChild(verticalTestRecycler);


        // let horizontalTestRecycler = new UIStackRecycler<[string, number], UISimilarityCard>(testData, horizontalAdapter, UIFrame_CornerWidthHeight.Build({
        //     x: 400,
        //     y: 200,
        //     width: 900,
        //     height: 300
        // }), brist);
        // this.addChild(horizontalTestRecycler);


         let testData = ['valueA', 'valueB', 'valueC', 'valueD', 'valueE', 'valueF', 'valueG', 'valueH', 'valueI', 'valueJ', 'valuek', 'valuem', 'valuen'];
        // let gridUI = UIStackRecycler.GridFixedColumns<string, TestElement>(testData, {
        //     buildCell: function (frame: UIFrame, brist: BristolBoard<any>): TestElement {
        //         return new TestElement(UIElement.createUID('testElement'), frame, brist);
        //     },
        //     bindData: function (index: number, data: string, child: TestElement): void {
        //         child.setData(index, data);
        //     },
            
        //     cols: 3
        // }, UIFrame_CornerWidthHeight.Build({
        //     x: 200,
        //     y: 200,
        //     width: brist.width / 3,
        //     height: brist.height - 400
        // }), brist);
        // this.addChild(gridUI);
        let verticalAdapter: UIStackOptions<string, TestElement> = {
            childLength: function (index: number): number {
                return 300
            },
            buildChild: function (frame: UIFrame, brist: BristolBoard<any>): TestElement {
                return new TestElement(UIElement.createUID('testElement'), frame, brist);
            },
            bindData: function (index: number, data: string, child: TestElement): void {
                child.setData(index, data);
            },
            isVertical: true
        }
        let horizontalAdapter: UIStackOptions<string, TestElement> = {
            childLength: function (index: number): number {
                return 200
            },
            buildChild: function (frame: UIFrame, brist: BristolBoard<any>): TestElement {
                return new TestElement(UIElement.createUID('testElement'), frame, brist);
            },
            bindData: function (index: number, data: string, child: TestElement): void {
                child.setData(index, data);
            },
            isVertical: false
        }

        // let verticalTestRecycler = new UIStackRecycler<string, TestElement>(testData, verticalAdapter, UIFrame_CornerWidthHeight.Build({
        //     x: 200,
        //     y: 500,
        //     width: 200,
        //     height: 900
        // }), brist);
        // this.addChild(verticalTestRecycler);


        // let horizontalTestRecycler = new UIStackRecycler<string, TestElement>(testData, horizontalAdapter, UIFrame_CornerWidthHeight.Build({
        //     x: 400,
        //     y: 200,
        //     width: 900,
        //     height: 300
        // }), brist);
        // this.addChild(horizontalTestRecycler);
    }

    static async fileToBlob(file: File){
        return URL.createObjectURL(new Blob([new Uint8Array(await file.arrayBuffer())], {type: file.type }));
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
        console.log('Uploading file ', file)
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

        ajax.addEventListener('readystatechange', async function (event: ProgressEvent<XMLHttpRequestEventTarget>) {
            if (ajax.readyState == XMLHttpRequest.DONE) {
                let resp: UploadResponse = JSON.parse(ajax.responseText)
                log.info(`Upload responded `, resp);
                let blob = await UIP_Upload_V0.fileToBlob(file);
                resp.imageBlob = blob;
                urlManager.set('upload',resp.fileName,false);
                let gallary: UIP_Gallary_V0 = mainBristol.rootElement.showGallary(resp);
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
