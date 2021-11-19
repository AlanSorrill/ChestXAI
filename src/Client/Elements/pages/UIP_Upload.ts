import { BristolBoard, BristolFontFamily, BristolHAlign, BristolVAlign, logger, LogLevel, Lung, MouseState, smoothFloat, UIButton, UICorner, UIElement, UIFrame, UIFrameDescription_CornerWidthHeight, UIFrameResult, UIP_Gallary_V0, UploadResponse } from "../../ClientImports";




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
            width: () => brist.getWidth(),
            height: () => brist.getHeight()
        }), brist)

        let ths = this;
        let inputElem: HTMLInputElement = document.getElementById('uploadInput') as HTMLInputElement;
        inputElem.style.display = 'inline'
        inputElem.addEventListener('change', function () {
            ths.lung.show();
            if (this.files && this.files[0]) {
                ths.uploadFile(this.files[0]);
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
                case 'Gone':
                    return fColor.red.base
                case 'Hover':
                    return fColor.red.lighten2
                default:
                    return fColor.red.darken1
            }
        };

        this.addChild(uploadButton);

        let startTime = Date.now();
        let lung = new Lung([
            [fColor.lightText[0], () => Math.min(1, (Date.now() - startTime) / 2000)],
            [fColor.green.lighten2, smoothFloat(() => ths.progress, 0.005)]
        ], UIFrame.Build<UIFrameDescription_CornerWidthHeight>({
            x: () => ths.getCenterX(),
            y: () => ths.getCenterY() - 250,
            width: 500, height: 500,
            measureCorner: UICorner.center
        }), brist);
        this.lung = lung;
        this.addChild(lung);
        // this.lung.editable();


    }



    uploadFile(file: File) {
        console.log('Uploading file');
        console.log(file);


        console.log('Uploading file ', file)
        let formData = new FormData();
        formData.append('file', file);
        var ajax = new XMLHttpRequest();
        let ths = this;

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
                let blob = URL.createObjectURL(new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type }))
                resp.imageBlob = blob;
                urlManager.set('upload', resp.fileName, false);
                let gallary: UIP_Gallary_V0 = mainBristol.rootElement.showGallary(resp);
                gallary.setUploadResponse(resp);

            } else {
                log.info('Ready state changed!', event);
            }

        })
        ajax.open("POST", "/upload");

        ajax.send(formData);

    }

    onDrawBackground(frame: UIFrameResult, deltaTime: number): void {

    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {

    }


}