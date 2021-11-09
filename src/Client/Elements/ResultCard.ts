
import { BristolCursor, Interp, linearInterp, MouseBtnListener, MouseMovementListener, MouseState } from "bristolboard";
import { BristolFontFamily, BristolHAlign, BristolVAlign, KeyboardInputEvent, MouseBtnInputEvent, MouseDraggedInputEvent, MouseInputEvent, MouseMovedInputEvent, MousePinchedInputEvent, MouseScrolledInputEvent, UIFrameResult, UIFrame_CornerWidthHeight, MainBristol, UI_Image, UIElement, UIFrame, UploadResponse, UIProgressBar, removeCammelCase, logger, UIP_Gallary_V0, DiseaseDefinition } from "../ClientImports";
let log = logger.local('ResultCard');


export class UIResultCard extends UIElement {

    uploadResponse: UploadResponse;
    image: UI_Image = null;
    displayCount = 3;
    parent: UIP_Gallary_V0
    constructor(data: UploadResponse, uiFrame: UIFrame_CornerWidthHeight, brist: MainBristol) {
        super(UIElement.createUID('ResultCard'), uiFrame, brist)
        this.uploadResponse = data;
        let ths = this;
        if (typeof data.imageBlob == 'undefined') {
            data.imageBlob = null;
        }
        let imageHeight = linearInterp(
            () => (ths.height - ths.bottomCardHeight),
            () => (ths.height - ths.bottomCardHeight / 3),
            () => ths.hasPrototype ? 'A' : 'B',
            {}
        );
        this.image = new UI_Image(data.imageBlob != null ? data.imageBlob : `./userContent/${this.uploadResponse.fileName}`, UIFrame.Build({
            x: 0,
            y: 0,
            width: () => (ths.width),
            height: imageHeight
        }), brist);
        let tst = true;
        this.image.setOnLoaded((img: UI_Image) => {
            console.log(img);
            // img.centerHorizontally();
            // img.centerVertically();
            img.addOnAttachToBristolListener(() => {
                img.fitHorizontally();
                log.info(`Resizing ${ths.uploadResponse.fileName}`)
                if (tst) {
                    tst = false;
                    //classes.ImageEditor.testBuilder()
                }
            })

        })
        this.addChild(this.image);
        let buildFrame = (index: number) => {

            let yAnim = linearInterp(
                () => (ths.height - ths.bottomCardHeight) + (ths.bottomCardHeight / 3) * index,
                () => (ths.height - (ths.bottomCardHeight / 3)),
                () => (ths.parent?.prototypeData != null && ths.parent?.prototypeData == this.uploadResponse.diagnosis[index][0] ? 'A' : 'B'), {
                onAnimStart() {
                    console.log('Starting transition')
                }
            }
            )
            let widthAnim = linearInterp(
                () => 0,
                () => ths.width,
                () => (ths.parent?.prototypeData != null && ths.parent?.prototypeData != this.uploadResponse.diagnosis[index][0] ? 'B' : 'A'), {
                onAnimStart(interp: Interp<number>) {
                    ths.brist.requestHighFps(() => interp.isTransitioning)
                }
            }
            )
            let out = new UIFrame_CornerWidthHeight({
                x: () => 0,
                y: yAnim,
                width: widthAnim,
                height: () => ((ths.bottomCardHeight / ths.displayCount)),

            })

            return out;
        }
        for (let i = 0; i < this.uploadResponse.diagnosis.length; i++) {
            let display = new DiseaseDisplay(this.uploadResponse.diagnosis[i], (selectedDisease: [disease: DiseaseDefinition, prediction: number]) => {
                ths.parent.prototypeData = selectedDisease[0]
            }, buildFrame(i), brist);
            this.addChild(display);
            // let txt = removeCammelCase(Disease[this.uploadResponse.diagnosis[i][0]])
            // this.brist.textSizeMaxWidth(this.topCardHeight - textHeight - this.padding, txt, frame.width - (this.padding * 4));
            // this.brist.text(txt, frame.left + this.padding, (frame.height - this.topCardHeight) + frame.top + this.padding + i * textHeight)
        }
    }

    get hasPrototype() {
        return (this.parent?.prototypeData != null);
    }
    get bottomCardHeight() {
        return this.height * 0.3;
    }
    onDrawBackground(frame: UIFrameResult, deltaMs: number) {
        this.brist.fillColor(fColor.darkMode[5]);
        this.brist.ctx.save();
        this.brist.roundedRectFrame(frame, 4, true, false)
        this.brist.ctx.clip();
        this.brist.ctx.beginPath();
    }
    onDrawForeground(frame: UIFrameResult, deltaMs: number) {
        this.brist.ctx.restore();
        ;
        // if (this.image != null) {
        //     this.brist.ctx.drawImage(this.image, frame.left, frame.top + topCardHeight, frame.width, frame.height - topCardHeight);
        // }

        //         if (this.uploadResponse) {
        //             let textHeight = ((this.bottomCardHeight - this.padding * 4) / Math.max(this.uploadResponse.diagnosis.length, 3));
        //             this.brist.fontFamily(BristolFontFamily.Roboto);
        //             this.brist.textAlign(BristolHAlign.Left, BristolVAlign.Top);
        //             this.brist.fillColor(fColor.lightText[1])


        //         }
    }





}

export class DiseaseDisplay extends UIElement implements MouseMovementListener, MouseBtnListener {
    private data: [DiseaseDefinition, number];
    progress: UIProgressBar;
    barWidth: number = 0.6;
    onClick: (value: [DiseaseDefinition, number]) => void;
    get padding(): number {
        return this.height * (3 / 12);
    };

    constructor(data: [DiseaseDefinition, number], onClick: (value: [DiseaseDefinition, number]) => void, frame: UIFrame, brist: MainBristol) {
        super(UIElement.createUID('DiseaseDisplay'), frame, brist)
        this.data = data;
        let ths = this;
        this.progress = new UIProgressBar(
            () => ths.data[1]//(1 + Math.cos(Date.now() / 1000)) / 2
            , new UIFrame_CornerWidthHeight({
                x: () => ths.padding,
                y: () => (ths.height / 2 - (ths.progress.height / 2)),
                width: () => (ths.width * this.barWidth) - (ths.padding * 2),
                height: () => ths.height - (ths.padding * 2)
            }), brist);
        this.progress.text = {
            align: BristolHAlign.Right,
            getText: (prog: number) => `${(prog * 100).toFixed(1)}%`,
            backgroundColor: fColor.darkMode[11],
            foregroundColor: fColor.lightText[1]
        };
        this.progress.foregroundColor = fColor.green.base;
        this.progress.backgroundColor = fColor.darkMode[4];
        this.addChild(this.progress);
        this.onClick = onClick;
    }
    mousePressed(evt: MouseBtnInputEvent): boolean {
        return true;
    }
    mouseReleased(evt: MouseBtnInputEvent): boolean {
        this.onClick(this.data)
        return true;
    }

    mouseMoved(evt: MouseMovedInputEvent): boolean {
        return true;
    }
    mouseState: MouseState = MouseState.Gone;
    mouseEnter(evt: MouseInputEvent) {
        this.mouseState = MouseState.Over;
        this.brist.cursor(BristolCursor.pointer)
        return true;
    }
    mouseExit(evt: MouseInputEvent) {
        this.mouseState = MouseState.Gone;
        this.brist.cursor(BristolCursor.default)
        return true;
    }
    onDrawBackground(frame: UIFrameResult, deltaTime: number): void {
        this.brist.ctx.save();
        this.brist.fillColor(fColor.darkMode[this.mouseState == MouseState.Over ? 7 : 5])
        this.brist.rectFrame(frame, false, true)
        this.brist.ctx.clip();
    }
    onDrawForeground(frame: UIFrameResult, deltaTime: number): void {
        this.brist.textAlign(BristolHAlign.Right, BristolVAlign.Middle)
        this.brist.fontFamily(BristolFontFamily.Raleway)
        this.brist.textSize(this.progress.height * 0.9);//, this.diseaseName, frame.width * (1 - this.barWidth) - this.padding * 2);
        this.brist.fillColor(fColor.lightText[1]);
        this.brist.text(this.data[0].displayName, frame.right - this.padding, frame.centerY);
        this.brist.strokeColor(fColor.darkMode[2]);
        this.brist.strokeWeight(1);
        this.brist.ctx.beginPath();
        this.brist.ctx.moveTo(frame.left, frame.bottom);
        this.brist.ctx.lineTo(frame.right, frame.bottom);
        this.brist.ctx.stroke();
        this.brist.ctx.restore();
    }


}