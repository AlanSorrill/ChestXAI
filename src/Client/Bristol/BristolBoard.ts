import * as Hammer from 'hammerjs'
import { UIFrame, Averager, fColor, FColor, FHTML, SortedLinkedList, UIElement } from "../clientImports";
import { UIFrameResult } from './UIFrame';
export enum BristolHAlign {
    Left = 'left', Center = 'center', Right = 'right'
}

export enum BristolVAlign {
    Top = 'top',
    Bottom = 'bottom',
    Middle = 'middle',
    Alphabetic = 'alphabetic',
    Hanging = 'hanging'
}
export enum BristolFontStyle {
    Normal = 'normal',
    Italic = 'italic',
    Oblique = 'oblique'
}
export enum BristolFontFamily {
    Arial = 'Arial',
    Verdana = 'Verdana',
    TimesNewRoman = 'TimesNewRoman',
    CourierNew = 'Courier New',
    Monospace = 'Monospace',
    CascadiaCode = 'Cascadia Code',
    MaterialIcons = "Material Icons",
    MaterialIconsOutlined = "Material Icons Outlined"
}
export enum FontSize {
    Small = 8,
    Medium = 16,
    Large = 20
}
export enum BristolFontWeight {

    normal = 'normal',
    bold = 'bold',
    bolder = 'bolder',
    lighter = 'lighter',

}
export class BristolFont {
    style: BristolFontStyle = BristolFontStyle.Normal
    weight: BristolFontWeight | number = BristolFontWeight.normal;
    family: BristolFontFamily = BristolFontFamily.Monospace;
    size: number = 12;
    toString() {
        return `${this.size}px ${this.family}`// ${this.style} ${this.weight}
    }
}
var MOUSE_INPUT_MAP = {
    mousedown: Hammer.INPUT_START,
    mousemove: Hammer.INPUT_MOVE,
    mouseup: Hammer.INPUT_END
};
//override
let baseClass = Hammer.MouseInput
namespace HammerStatic {
    export interface MouseInput extends Function { }
}

export class InputEvent {
    constructor() {

    }
}
export enum InputEventAction {
    Down, Up
}

export enum KeyboardInputKey {
    a = 'a', b = 'b', c = 'c', d = 'd', e = 'e', f = 'f', g = 'g', h = 'h', i = 'i', j = 'j', k = 'k', l = 'l', m = 'm', n = 'n', o = '0', p = 'p',
    q = 'q', r = 'r', s = 's', t = 't', u = 'u', v = 'v', w = 'w', x = 'x', y = 'y', z = 'z', shift = 'shift', enter = 'enter', ctrl = 'ctrl', alt = 'alt'
}
export class KeyboardInputEvent extends InputEvent {
    key: string
    isAlt: boolean;
    isCtrl: boolean;
    isShift: boolean;
    action: InputEventAction
    constructor(action: InputEventAction, key: string, isShift: boolean, isCtrl: boolean, isAlt: boolean) {
        super();
        this.action = action;
        this.key = key;
        this.isShift = isShift;
        this.isCtrl = isCtrl;
        this.isAlt = isAlt;
    }
}
export class MouseInputEvent extends InputEvent {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }
}
export class MouseBtnInputEvent extends MouseInputEvent {
    btn: number;
    action: InputEventAction;
    constructor(x: number, y: number, btn: number, action: InputEventAction = null) {
        super(x, y);
        this.action = action;
        this.btn = btn;
    }
}
export class MouseMovedInputEvent extends MouseInputEvent {
    deltaX: number;
    deltaY: number;
    constructor(x: number, y: number, deltaX: number, deltaY: number) {
        super(x, y);
        this.deltaX = deltaX;
        this.deltaY = deltaY;
    }
}
export class MouseScrolledInputEvent extends MouseInputEvent {
    amount: number
    constructor(x: number, y: number, amount: number) {
        super(x, y);
        this.amount = amount;
    }
}
export class MouseDraggedInputEvent extends MouseMovedInputEvent {
    btn: number
    constructor(x: number, y: number, btn: number, deltaX: number, deltaY: number) {
        super(x, y, deltaX, deltaY);
        this.btn = btn;
    }
}
export interface CornerRadius {
    upperLeft: number
    upperRight: number
    lowerLeft: number
    lowerRight: number
}
export class BristolBoard<RootElementType extends UIElement> {

    containerDiv: FHTML<HTMLDivElement>;
    canvas: FHTML<HTMLCanvasElement>;
    canvasElem: HTMLCanvasElement;
    containerDivElem: HTMLDivElement;
    ctx: CanvasRenderingContext2D;
    // jobExecutor: JobExecutor = null;
    keyboardState: Map<string, boolean> = new Map()
    isKeyPressed(key: KeyboardInputKey): boolean {
        return this.keyboardState.get(key) || false;
    }
    debuggerFlags: {
        uiFrameOutlines: boolean
    } = {
            uiFrameOutlines: false
        }
    constructor(containerDivElem: HTMLDivElement, buildRootElement: (brist: BristolBoard<RootElementType>) => Promise<RootElementType>) {
        let ths = this;
        //this.uiElements = SortedLinkedList.Create((a: UIElement, b: UIElement) => (a.depth - b.depth));
        this.containerDiv = new FHTML(containerDivElem);
        this.containerDivElem = containerDivElem;
        this.canvas = new FHTML(document.createElement('canvas'));
        this.canvas.attr('oncontextmenu', 'return false');
        this.containerDiv.append(this.canvas);

        this.ctx = this.canvas.element.getContext('2d');
        // if (this.shouldExecJobs()) {
        //     this.jobExecutor = new JobExecutor();
        //     CerealBox.jobExecutor = this.jobExecutor;
        // }
        this.canvas.element.addEventListener('resize', (event)=>{
            ths.onResize();
        })
        this.onResize();

        this.lastDrawTime = Date.now();
        this.canvas.element.addEventListener('wheel', (evt: WheelEvent) => {
            ths.mouseScrolled(new MouseScrolledInputEvent(ths.iMouseX, ths.iMouseY, evt.deltaY));
        })
        this.hammerManager = new Hammer.Manager(this.canvas.element);
        this.rotateRecognizer = new Hammer.Rotate();
        this.panRecognizer = new Hammer.Pan();
        this.hammerManager.add(this.rotateRecognizer);
        this.hammerManager.add(this.panRecognizer);

        this.hammerManager.on('panstart', (evt: HammerInput) => {
            this.lastScrollOffset = [0, 0];
            if (this.mousePressed(new MouseBtnInputEvent(evt.center.x, evt.center.y, 1, InputEventAction.Down))) {
                evt.preventDefault();
            }
        })
        this.hammerManager.on('panend', (evt: HammerInput) => {
            this.lastScrollOffset = [0, 0];

            if (this.mouseReleased(new MouseBtnInputEvent(evt.center.x, evt.center.y, 1, InputEventAction.Up))) {
                evt.preventDefault();
            }
        })
        this.hammerManager.on('pan', (evt: HammerInput) => {
            ths.scrollDeltaX += evt.deltaX - ths.lastScrollOffset[0];
            ths.scrollDeltaY += evt.deltaY - ths.lastScrollOffset[1];
            ths.lastScrollOffset[0] = evt.deltaX;
            ths.lastScrollOffset[1] = evt.deltaY;
            if (Math.max(Math.abs(this.scrollDeltaX), Math.abs(this.scrollDeltaY)) > 1) {
                //  console.log(`${this.scrollDeltaX}, ${this.scrollDeltaY}`);
                ths.mouseDragged(new MouseDraggedInputEvent(evt.center.x, evt.center.y, 1, ths.scrollDeltaX, ths.scrollDeltaY))
                // ths.mouseDragged(evt, this.scrollDeltaX, this.scrollDeltaY);
                this.scrollDeltaX = 0;
                this.scrollDeltaY = 0;
            }
        })

        document.addEventListener('keydown', (evt: KeyboardEvent) => {
            // var inputKey: KeyboardInputKey
            // if(evt.shiftKey){
            //     inputKey = KeyboardInputKey.shift;
            // } else if(evt.ctrlKey){
            //     inputKey = KeyboardInputKey.ctrl;
            // } else if(evt.altKey){
            //     inputKey = KeyboardInputKey.alt;

            // } else {
            //     inputKey = KeyboardInputKey[evt.key.toLowerCase()];
            // }
            this.keyboardState.set(evt.key, true);
            let event = new KeyboardInputEvent(InputEventAction.Down, evt.key, this.isKeyPressed(KeyboardInputKey.shift), this.isKeyPressed(KeyboardInputKey.ctrl), this.isKeyPressed(KeyboardInputKey.alt))
            if (ths.keyDown(event)) {
                evt.preventDefault();
            }
        })
        document.addEventListener('keyup', (evt: KeyboardEvent) => {

            this.keyboardState.set(evt.key, false);
            let event = new KeyboardInputEvent(InputEventAction.Down, evt.key, this.isKeyPressed(KeyboardInputKey.shift), this.isKeyPressed(KeyboardInputKey.ctrl), this.isKeyPressed(KeyboardInputKey.alt))
            if (ths.keyUp(event)) {
                evt.preventDefault();
            }
        })
        document.addEventListener('mousemove', (evt: MouseEvent) => {
            var parentOffset = ths.canvas.offset();
            //or $(this).offset(); if you really just want the current element's offset
            var relX = evt.pageX - parentOffset.left;
            var relY = evt.pageY - parentOffset.top;
            let deltaX = relX - ths.iMouseX;
            let deltaY = relY - ths.iMouseY;
            ths.iMouseX = relX;
            ths.iMouseY = relY;
            ths.mouseMoved(new MouseMovedInputEvent(relX, relY, deltaX, deltaY));
        })
        document.addEventListener('mousedown', (evt: MouseEvent) => {
            var parentOffset = ths.canvas.offset();
            //or $(this).offset(); if you really just want the current element's offset
            var relX = evt.pageX - parentOffset.left;
            var relY = evt.pageY - parentOffset.top;
            if (relX >= 0 && relX <= parentOffset.left + ths.canvas.width &&
                relY >= 0 && relY <= parentOffset.top + ths.canvas.height) {

                if (this.mousePressed(new MouseBtnInputEvent(relX, relY, evt.which, InputEventAction.Down))) {
                    evt.preventDefault();
                }
            }
        })
        document.addEventListener('mouseup', (evt: MouseEvent) => {
            var parentOffset = ths.canvas.offset();
            //or $(this).offset(); if you really just want the current element's offset
            var relX = evt.pageX - parentOffset.left;
            var relY = evt.pageY - parentOffset.top;
            if (relX >= 0 && relX <= parentOffset.left + ths.canvas.width &&
                relY >= 0 && relY <= parentOffset.top + ths.canvas.height) {
                if (this.mouseReleased(new MouseBtnInputEvent(relX, relY, evt.which, InputEventAction.Up))) {
                    evt.preventDefault();
                }
            }
        })
        // this.canvas.on('keydown', (event: JQuery.KeyDownEvent<HTMLCanvasElement, null, HTMLCanvasElement, HTMLCanvasElement>)=>{
        //     return ths.keyDown(event);
        // })
        // this.canvas.on('keyup',(event: KeyboardEvent)=>{
        //     return ths.keyUp(event);
        // })

        buildRootElement(ths).then((rootElem: RootElementType)=>{
            if(ths.rootElement == null){
                ths.rootElement = rootElem;
            }
            ths.draw();
        })
     
    }
    rootElement: RootElementType = null;
    mousePressed(evt: MouseBtnInputEvent) {
        return this.rootElement.mousePressed(evt);
    }
    mouseReleased(evt: MouseBtnInputEvent) {
        return false;
    }
    mouseMoved(event: MouseMovedInputEvent) {
        return false;
    }
    keyUp(event: KeyboardInputEvent): boolean {
        return false;
    }
    keyDown(event: KeyboardInputEvent): boolean {
        return false;
    }
    pixelDensity(): number {
        return window.devicePixelRatio;
    }
    private lastScrollOffset: [number, number] = [0, 0];
    private scrollDeltaY: number = 0;
    private scrollDeltaX: number = 0;
    private hammerManager: HammerManager
    private rotateRecognizer: RotateRecognizer;
    private panRecognizer: PanRecognizer;
    private lastDrawTime: number;
    private currentDrawTime: number;
    private deltaDrawTime: number;
    get targetFrameTime(): number {
        return 1000 / this.targetFps;
    }
    get fps() {
        return 1 / (this.deltaDrawTime / 1000)
    }
    get performanceRatio() {
        return this.targetFps / this.deltaDrawTime
    }
    get avgPerfRatio() {
        return this.perfAvg.val;
    }
    perfAvg: Averager = new Averager(20);
    targetFps: number = 20;
    private drawProm: Promise<void> = null;
    private async draw() {
        if (this.drawProm != null) {
            await this.drawProm;
            return;
        }
        this.currentDrawTime = Date.now();
        this.deltaDrawTime = (this.currentDrawTime - this.lastDrawTime);
        this.perfAvg.add(this.performanceRatio);
        this.drawProm = this.onDraw(this.deltaDrawTime);
        await this.drawProm;
        this.lastDrawTime = this.currentDrawTime;
        let ths = this;
        // if (this.shouldExecJobs()) {
        //     await this.jobExecutor.execJobs();
        // }
        this.drawProm = null;
        if (this.autoFrames) {
            setTimeout(() => {
                window.requestAnimationFrame(this.draw.bind(this));
            }, Math.max(this.targetFrameTime - this.deltaDrawTime, 0))
        }

    }
    drawFrame() {
        if (this.drawProm == null && !this.autoFrames) {
            window.requestAnimationFrame(this.draw.bind(this));
            return true;
        }
        return false;
    }
    autoFrames: boolean = true;
    get width() {
        return this.iWidth * this.resolutionScale;
    }
    get height() {
        return this.iHeight * this.resolutionScale;
    }
    private iWidth: number;
    private iHeight: number;
    private iMouseX: number;
    private iMouseY: number;
    get mouseX(): number {
        return this.iMouseX;
    }
    get mouseY(): number {
        return this.iMouseY;
    }
    protected resolutionScale: number = 2;
    private onResize() {
        this.iWidth = this.containerDiv.width;
        this.iHeight = this.containerDiv.height;
        this.canvas.element.width = this.iWidth * this.resolutionScale;
        this.canvas.element.height = this.iHeight * this.resolutionScale;
        this.canvas.setCss('width', `${this.iWidth}px`);
        this.canvas.setCss('height', `${this.iHeight}px`);
    }
    displayDensity() {
        return 1;
    }
    static noStyle: string = ''
    strokeColor(style: FColor) {
        this.ctx.strokeStyle = style?.toHexString() ?? '#000000';
    }
    roundedRect(x: number, y: number, w: number, h: number, rad: number | CornerRadius) {
        if (typeof rad == 'number') {
            rad = {
                lowerLeft: rad,
                lowerRight: rad,
                upperLeft: rad,
                upperRight: rad
            }
        }
        let upperLeft: [number, number] = [x, y];
        let upperRight: [number, number] = [x + w, y];
        let lowerRight: [number, number] = [x + w, y + h];
        let lowerLeft: [number, number] = [x, y + h];

        this.ctx.beginPath();
        this.ctx.moveTo(upperLeft[0] + rad.upperLeft, upperLeft[1]);
        this.ctx.lineTo(upperRight[0] - rad.upperRight, upperRight[1]);
        this.ctx.arcTo(upperRight[0], upperRight[1], upperRight[0], upperRight[1] + rad.upperRight, rad.upperRight);
        this.ctx.lineTo(lowerRight[0], lowerRight[1] - rad.lowerRight);
        this.ctx.arcTo(lowerRight[0], lowerRight[1], lowerRight[0] - rad.lowerRight, lowerRight[1], rad.lowerRight);
        this.ctx.lineTo(lowerLeft[0] + rad.lowerLeft, lowerLeft[1]);
        this.ctx.arcTo(lowerLeft[0], lowerLeft[1], lowerLeft[0], lowerLeft[1] - rad.lowerLeft, rad.lowerLeft);
        this.ctx.lineTo(upperLeft[0], upperLeft[1] + rad.upperLeft);
        this.ctx.arcTo(upperLeft[0], upperLeft[1], upperLeft[0] + rad.upperLeft, upperLeft[1], rad.upperLeft);
        this.ctx.closePath();
    }
    roundedRectFrame(frame: UIFrame, rad: number | CornerRadius, fill: boolean = false, stroke: boolean = false) {
        if (typeof rad == 'number') {
            rad = {
                lowerLeft: rad,
                lowerRight: rad,
                upperLeft: rad,
                upperRight: rad
            }
        }
        let upperLeft: [number, number] = [frame.leftX(), frame.topY()];
        let upperRight: [number, number] = [frame.rightX(), frame.topY()];
        let lowerRight: [number, number] = [frame.rightX(), frame.bottomY()];
        let lowerLeft: [number, number] = [frame.leftX(), frame.bottomY()];

        this.ctx.beginPath();
        this.ctx.moveTo(upperLeft[0] + rad.upperLeft, upperLeft[1]);
        this.ctx.lineTo(upperRight[0] - rad.upperRight, upperRight[1]);
        this.ctx.arcTo(upperRight[0], upperRight[1], upperRight[0], upperRight[1] + rad.upperRight, rad.upperRight);
        this.ctx.lineTo(lowerRight[0], lowerRight[1] - rad.lowerRight);
        this.ctx.arcTo(lowerRight[0], lowerRight[1], lowerRight[0] - rad.lowerRight, lowerRight[1], rad.lowerRight);
        this.ctx.lineTo(lowerLeft[0] + rad.lowerLeft, lowerLeft[1]);
        this.ctx.arcTo(lowerLeft[0], lowerLeft[1], lowerLeft[0], lowerLeft[1] - rad.lowerLeft, rad.lowerLeft);
        this.ctx.lineTo(upperLeft[0], upperLeft[1] + rad.upperLeft);
        this.ctx.arcTo(upperLeft[0], upperLeft[1], upperLeft[0] + rad.upperLeft, upperLeft[1], rad.upperLeft);
        this.ctx.closePath();

        if (fill) {
            this.ctx.fill();
        }
        if (stroke) {
            this.ctx.stroke();
        }
    }
    // rectFrame(frame: UIFrame, rad: number | CornerRadius) {
    //     let upperLeft: [number, number] = [frame.upLeftX(), frame.topY()];
    //     let upperRight: [number, number] = [frame.upRightX(), frame.upRightY()];
    //     let lowerRight: [number, number] = [frame.rightX(), frame.bottomY()];
    //     let lowerLeft: [number, number] = [frame.leftX(), frame.bottomY()];

    //     this.ctx.beginPath();
    //     this.ctx.moveTo(frame.upLeftX(), frame.topY());
    //     this.ctx.lineTo(frame.upRightX(), frame.upRightY());
    //     this.ctx.lineTo(frame.rightX(), frame.bottomY());
    //     this.ctx.lineTo(frame.leftX(), frame.downLeftY());
    //     this.ctx.lineTo(frame.upLeftX(), frame.topY());
    //     this.ctx.closePath();
    // }


    candleIcon(x: number, y: number, w: number, h: number, rad: number = 2, wiskerSize: [number, number] = [0.2, 0.9], boxSize: [number, number] = [0.4, 0.6], padding: number = 2) {
        let boxVPadding = (h - (h * boxSize[1])) / 2;
        let boxWPadding = (w - (w * boxSize[0])) / 2;
        let wiskerVPadding = (h - (h * wiskerSize[1])) / 2;
        let wiskerWPadding = (w - (w * wiskerSize[0])) / 2;
        let boxTop = y + boxVPadding;
        let boxBottom = y + h - boxVPadding;
        let boxLeft = x + boxWPadding;
        let boxRight = x + w - boxWPadding;

        let wiskerTop = y + wiskerVPadding;
        let wiskerBottom = y + h - wiskerVPadding;
        let wiskerLeft = x + wiskerWPadding;
        let wiskerRight = x + w - wiskerWPadding;
        let data: Array<[number, number] | [[number, number], [number, number], [number, number], number]> = [
            [wiskerLeft, boxTop],
            [[wiskerLeft, wiskerTop + rad], [wiskerLeft, wiskerTop], [wiskerLeft + rad, wiskerTop], rad],

            [[wiskerRight - rad, wiskerTop], [wiskerRight, wiskerTop], [wiskerRight, wiskerTop + rad], rad],
            [wiskerRight, boxTop],
            [[boxRight - rad, boxTop], [boxRight, boxTop], [boxRight, boxTop + rad], rad],
            [[boxRight, boxBottom - rad], [boxRight, boxBottom], [boxRight - rad, boxBottom], rad],
            [wiskerRight, boxBottom],
            [[wiskerRight, wiskerBottom - rad], [wiskerRight, wiskerBottom], [wiskerRight - rad, wiskerBottom], rad],
            [[wiskerLeft + rad, wiskerBottom], [wiskerLeft, wiskerBottom], [wiskerLeft, wiskerBottom - rad], rad],
            [wiskerLeft, boxBottom],
            [[boxLeft + rad, boxBottom], [boxLeft, boxBottom], [boxLeft, boxBottom - rad], rad],
            [[boxLeft, boxTop + rad], [boxLeft, boxTop], [boxLeft + rad, boxTop], rad],
            [wiskerLeft, boxTop]
        ]
        //[x, y] | [[x,y],[x,y],[x,y],radius]
        this.ctx.beginPath();

        var startPoint: [number, number] = data[0] as [number, number];
        this.ctx.moveTo(startPoint[0], startPoint[1]);
        var points: [[number, number], [number, number], [number, number], number]
        for (let i = 1; i < data.length; i++) {
            if (data[i].length == 2) {//[x,y]
                this.ctx.lineTo(data[i][0] as number, data[i][1] as number);
            } else {//[[x, y], [x, y], [x, y], radius]
                points = data[i] as any;
                this.ctx.lineTo(points[0][0], points[0][1]);//A
                this.ctx.arcTo(points[1][0], points[1][1], points[2][0], points[2][1], points[3]);
            }
        }
    }
    fillColor(style: FColor) {
        this.ctx.fillStyle = style.toHexString();
    }
    noStroke() {
        this.ctx.strokeStyle = BristolBoard.noStyle;
    }
    noFill() {
        this.ctx.fillStyle = BristolBoard.noStyle
    }
    strokeWeight(weight: number) {
        this.ctx.lineWidth = weight;
    }
    cursor(cursorCss: string) {
        this.canvas.setCss('cursor', cursorCss);
    }
    background(color: FColor) {
        this.noStroke();
        this.fillColor(color);
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    line(x1: number, y1: number, x2: number, y2: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
    ellipse(centerX: number, centerY: number, width: number, height: number, stroke: boolean = true, fill: boolean = false) {
        this.ellipseBounds(centerX - width / 2.0, centerY - height / 2.0, width, height, stroke, fill);
    }
    ellipseFrame(frame: UIFrameResult | UIFrame, stroke: boolean = true, fill: boolean = false) {
        if(frame instanceof UIFrame){
            return this.ellipseFrame(frame.lastResult, stroke, fill);
        }
        this.ellipseBounds(frame.left, frame.top, frame.width, frame.height, stroke, fill)
    }
    // ellipseFrame(uiFrame: UIFrame, stroke: boolean = true, fill: boolean = false) {
    //     this.ellipseBounds(uiFrame.leftX(), uiFrame.topY(), uiFrame.measureWidth(), uiFrame.measureHeight())
    // }
    ellipseBounds(cornerX: number, cornerY: number, w: number, h: number, stroke: boolean = true, fill: boolean = false) {
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = cornerX + w,           // x-end
            ye = cornerY + h,           // y-end
            xm = cornerX + w / 2,       // x-middle
            ym = cornerY + h / 2;       // y-middle

        this.ctx.beginPath();
        this.ctx.moveTo(cornerX, ym);
        this.ctx.bezierCurveTo(cornerX, ym - oy, xm - ox, cornerY, xm, cornerY);
        this.ctx.bezierCurveTo(xm + ox, cornerY, xe, ym - oy, xe, ym);
        this.ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        this.ctx.bezierCurveTo(xm - ox, ye, cornerX, ym + oy, cornerX, ym);

        if (stroke) {
            this.ctx.stroke();
        }
        if (fill) {
            this.ctx.fill();
        }
    }
    text(str: string, x: number, y: number) {
        this.ctx.fillText(str, x, y);
    }
    protected font: BristolFont = new BristolFont();
    getFontText() {
        return this.font.toString();
    }
    textWeight(weight: BristolFontWeight) {
        this.font.weight = weight;
        this.ctx.font = this.font.toString();
    }
    textSize(size: number) {
        this.font.size = size;
        this.ctx.font = this.font.toString()
    }
    fontFamily(family: BristolFontFamily) {
        this.font.family = family;
        this.ctx.font = this.font.toString();
    }
    textAlign(horizontal: BristolHAlign, vertical: BristolVAlign) {
        this.ctx.textAlign = horizontal;
        this.ctx.textBaseline = vertical;
    }
    textWidth(text: string): number {
        return this.ctx.measureText(text).width;
    }
    rect(x: number, y: number, w: number, h: number) {
        this.ctx.rect(x, y, w, h)
    }
    rectFrame(frame: UIFrame) {
        return this.ctx.rect(frame.leftX(), frame.topY(), frame.measureWidth(), frame.measureHeight());
    }
    fillRectFrame(frame: UIFrame) {
        return this.ctx.fillRect(frame.leftX(), frame.topY(), frame.measureWidth(), frame.measureHeight());
    }
    mouseScrolled(event: MouseScrolledInputEvent) {

    }

    mouseDragged(event: MouseDraggedInputEvent) {

    }

    //overridable methods--------------------------------------------------
    shouldExecJobs(): boolean {
        return false;
    }
    
    // addUiElement(element: UIElement) {
    //     element.parent = this as any;//bad type
    //     this.uiElements.add(element);
    //     // for (let i = 0; i < this.uiElements.length; i++) {
    //     //     if (this.uiElements[i].depth >= element.depth) {
    //     //         this.uiElements.splice(i, 0, element);
    //     //         return;
    //     //     }
    //     // }
    //     // this.uiElements.push(element);

    // }
    // removeUIElement(element: UIElement) {
    //     element.parent = null;
    //     this.uiElements.remove((elem: UIElement) => (elem.id == element.id));
    //     // var removeIndex = this.uiElements.map(item => item.id)
    //     //     .indexOf(element.id);
    //     // if (removeIndex !== -1) {
    //     //     ~removeIndex && this.uiElements.splice(removeIndex, 1);
    //     // }
    // }
    async onDraw(deltaMs: number): Promise<void> {
        let ths = this;
        this.noStroke();
        this.fillColor(fColor.grey.darken3);
        this.ctx.fillRect(0, 0, this.width, this.height);

        // this.currentContentPanel.drawBackground(deltaMs);

        //  this.ctx.fillStyle = fColor.green.darken2.toHexString();
        // this.ctx.fillRect(0,0, 500, 500);
        //         console.log(this.ctx);
        this.rootElement?.measure(deltaMs);
        this.rootElement?.draw(deltaMs);
        // this.uiElements.forEach((element: UIElement) => {

        //     if (element.frame.isVisible()) {
        //         element.draw(deltaMs, ths.ctx);
        //     }
        // })
        // if (this.debuggerFlags.uiFrameOutlines && this.lastMouseOverElem != null) {
        //     this.lastMouseOverElem.drawUIFrame(true, 1);
        //     this.fillColor(this.lastMouseOverElem.debugFrameColor);
        //     this.textAlign(BristolHAlign.Left, BristolVAlign.Bottom)
        //     this.textSize(8);
        //     this.ctx.fillText(this.lastMouseOverElem.id, this.mouseX, this.mouseY)
        // }






    }
}