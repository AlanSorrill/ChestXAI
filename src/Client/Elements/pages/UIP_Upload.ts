import { LogLevel, UIButton, BristolBoard, UIElement, UICorner, BristolFontFamily, MouseInputEvent, UIFrame_CornerWidthHeight, MouseState, UIProgressBar, logger } from "../../clientImports";
let log = logger.local("UIP_Upload")

log.allowBelowLvl(LogLevel.naughty);


export class UIP_Upload_V0 extends UIElement {
    progress: number = 0;


    constructor(id: string, uiFrame: UIFrame_CornerWidthHeight, brist: BristolBoard<any>) {
        super(id, uiFrame, brist);

        let ths = this;
        let inputElem: HTMLInputElement = document.getElementById('uploadInput') as HTMLInputElement;
        inputElem.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                ths.uploadFile(this.files[0])
                // Rest.post('./upload', {'Content-Type': ''})
            }
        })

        let uploadButton = new UIButton('Upload', {
            x: () => ths.frame.centerX(),
            y: () => ths.frame.centerY(),
            width: 100,
            height: 100,
            measureCorner: UICorner.center
        }, brist);
        uploadButton.onClick = () => {
            inputElem.click();
        }
        
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
            height: 12
        }, brist);

        this.addChild(uploadButton);
        this.addChild(progressBar)
    }

    uploadFile(file: File) {
        console.log('Uploading file');
        console.log(file);
        let formData = new FormData();
        formData.append('file', file);
        var ajax = new XMLHttpRequest();
        let ths = this;
        ajax.upload.addEventListener("progress", function (event: ProgressEvent<XMLHttpRequestEventTarget>) {
            ths.progress = event.loaded / event.total;
        }, false);
        ajax.addEventListener("load", function (event: ProgressEvent<XMLHttpRequestEventTarget>) {
            //complete
            log.info('Upload complete');
        }, false);
        ajax.addEventListener("error", function (event: ProgressEvent<XMLHttpRequestEventTarget>) {

            log.error('Upload error', event);
        }, false);
        ajax.addEventListener("abort", function (event: ProgressEvent<XMLHttpRequestEventTarget>) {
            log.error('Upload abort', event)
        }, false);
        ajax.open("POST", "/upload.api", true);
        ajax.setRequestHeader("Content-type", file.type)
         ajax.setRequestHeader("X_FILE_NAME", file.name); 
      //  ajax.setRequestHeader("Content-Length", file.size + '');
        ajax.send(file);
    }
    // mouseEnter(evt: MouseInputEvent){
    //     this.isMouseOver = true;
    //     return true;
    // }

    // mouseExit(evt: MouseInputEvent){
    //     this.isMouseOver = false;
    //     return true;
    // }

}