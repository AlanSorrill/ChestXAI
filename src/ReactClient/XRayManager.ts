import { ImageEditor, RGBA } from "../Client/ImageEditing";
// import { HMWM_Init, HMWM_Is_Complete, HMWM_Is_Init, HMWM_Is_Progress, HMWM_Start, HMWM_Stop, HMW_Message } from "./HeatMapper/WorkerDefs";

// export class XRayManager {
//     constructor() {

//     }
// }
// export class HeatMapperThreaded {
//     stopAll() {
//         let msg: HMWM_Stop = {
//             type: 'stop',
//             disease: 'all'
//         }
//         this.worker.postMessage(msg)
//     }
//     ogSrc: string;
//     worker: Worker;
//     completedBlobs: Map<string, Blob> = new Map();
//     completedDataUrls: Map<string, string> = new Map();
//     completedWaiters: Map<string, ((dataUrl: string) => void)[]> = new Map()
//     initWaiters: (() => void)[] = []
//     isReady: boolean = false
//     private notifyReady() {
//         this.isReady = true;
//         while (this.initWaiters.length > 0) {
//             this.initWaiters.pop()();
//         }
//     }
//     hasHeatmap(bitString: string) {
//         return this.completedDataUrls.has(bitString);
//     }
//     getHeatmapUrl(bitString: string) {
//         return this.completedDataUrls.get(bitString);
//     }
//     constructor(ogImage: string) {
//         this.ogSrc = ogImage;
//         this.init();
//     }


//     init() {
//         this.worker = new Worker('./wp/heatmapWorker.js');
//         let ths = this;
//         let msg: HMWM_Init = {
//             type: 'init',
//             ogSrc: ths.ogSrc
//         }
//         return new Promise<this>((acc, rej) => {
//             ths.worker.addEventListener('message', (msg: MessageEvent<HMW_Message>) => {
//                 console.log(`UI thread recieved `, msg.data)
//                 if (HMWM_Is_Init(msg.data)) {
//                     acc(ths);
//                     ths.notifyReady();
//                 }
//                 ths.onMessage(msg.data);
//             })
//             ths.worker.postMessage(msg)
//         })

//     }
//     onMessage(msg: HMW_Message) {
//         if (HMWM_Is_Progress(msg)) {
//             console.log(`HeatProgress: ${msg.value}`);
//         } else if (HMWM_Is_Complete(msg)) {
//             console.log(`Heatmap Completed ${msg.disease}`);
//             this.completedBlobs.set(msg.disease, msg.image);
//             let url = URL.createObjectURL(msg.image);
//             this.completedDataUrls.set(msg.disease, url);
//             let waiters = this.completedWaiters.get(msg.disease);
//             this.completedWaiters.delete(msg.disease);
//             while(waiters.length > 0){
//                 waiters.pop()(url);
//             }
//         } else {
//             console.log(msg);
//         }
//     }
//     async buildHeatmap(bitString: string) {

//         let ths = this;
//         return new Promise<string>((acc, rej) => {
//             let msg: HMWM_Start = {
//                 type: 'start',
//                 disease: bitString
//             }
//             if (!ths.completedWaiters.has(bitString)) {
//                 ths.completedWaiters.set(bitString, [(dataUrl: string) => {
//                     acc(dataUrl);
//                 }]);
//             }
//             ths.worker.postMessage(msg);
//         });

//     }
// }

// export class HeatMapper {
//     async jumpImage(bitStringID: string) {
//         if (this.heatmapAquisitions.has(bitStringID)) {
//             let aquisitor = this.heatmapAquisitions.get(bitStringID)
//             if (!aquisitor[1]) {//is not locked
//                 this.heatmapAquisitions.set(bitStringID, [aquisitor[0], true]);
//                 let imgData = await aquisitor[0]();
//                 this.heatmapImages.set(bitStringID, imgData);
//                 this.heatmapAquisitions.set(bitStringID, [aquisitor[0], false]);
//             }
//         }
//     }

//     ogSrc: string
//     heatmapImages: Map<string, string> = new Map();
//     heatmapAquisitions: Map<string, [getImage: () => Promise<string>, lock: boolean]> = new Map();
//     heatmapCancels: Map<string, () => void> = new Map();
//     heatmapProgress: Map<string, number> = new Map();
//     resolution: number;
//     worker: Worker
//     constructor(ogImage: string, resolution: number = -1) {
//         this.ogSrc = ogImage;
//         this.resolution = resolution;



//     }
//     async preloadHeatmap(diseaseBitString: string, yeildCount: number = 25, listener: (bitString: string, progress: number) => void = () => { }) {
//         let heatmapLink = `${this.ogSrc}${(this.ogSrc.includes('?') ? '&' : '?')}heatmap=${diseaseBitString}`;
//         let text = await fetch(heatmapLink);
//         let data = await (text).json();
//         let dataWidth = data.length;
//         let ths = this;

//         let getHeat = (xAlpha: number, yAlpha: number): number => {
//             let xCoord = Math.floor(dataWidth * xAlpha);
//             let yCoord = Math.floor(dataWidth * yAlpha);
//             let output = data[yCoord][xCoord]
//             return output;
//         }



//         this.heatmapImages.set(diseaseBitString, (await ImageEditor.editImage(await this.getOriginalImage(), (x: number, y: number, oldPixel: RGBA, imgData: ImageData): RGBA => {
//             let p = (x * imgData.height + y) / (imgData.width * imgData.height);
//             //console.log(`Edit image at (${x}, ${y}) alpha=(${p})`);
//             ths.heatmapProgress.set(diseaseBitString, p);
//             listener(diseaseBitString, p);
//             return [oldPixel[0], oldPixel[1], oldPixel[1], getHeat(x / imgData.width, y / imgData.height)];
//         }, {
//             yieldOn: yeildCount,
//             onStart: function (getImageData: () => Promise<string>, stop: () => void): void {
//                 ths.heatmapAquisitions.set(diseaseBitString, [getImageData, false]);
//                 ths.heatmapCancels.set(diseaseBitString, stop);
//             }
//         })));
//         listener(diseaseBitString, 1);
//         console.log(`Completed heatmap`)
//     }

//     async getHeatmap(diseaseBitString: string, yieldCount: number = 25) {
//         if (!this.heatmapImages.has(diseaseBitString)) {
//             await this.preloadHeatmap(diseaseBitString, yieldCount);
//         }
//         return this.heatmapImages.get(diseaseBitString);
//     }

//     stopAll() {
//         this.heatmapCancels.forEach((value: () => void) => {
//             value();
//         })
//     }
//     // async displayHeatmap(diseaseBitString: string) {
//     //     if(diseaseBitString == null){
//     //         this.currentHeatmap = null;
//     //         this.setImage(await this.getOriginalImage(20));
//     //         console.log(`Displaying defalt heatmap`);
//     //         return;
//     //     }
//     //     if (!this.heatmapImages.has(diseaseBitString)) {
//     //         this.setImage(await this.getOriginalImage(20));
//     //         this.currentHeatmap = null;
//     //         await this.preloadHeatmap(diseaseBitString);
//     //     }
//     //     this.setImage(this.heatmapImages.get(diseaseBitString))
//     //     this.currentHeatmap = diseaseBitString;
//     //    // this.fitHorizontally();
//     //     //this.centerHorizontally();
//     //    // this.centerVertically();
//     //     console.log(`Displaying heatmap ${diseaseBitString}`)
//     // }

//     private originalImage: HTMLImageElement = null
//     async getOriginalImage() {
//         if (this.originalImage == null) {
//             this.originalImage = await ImageEditor.loadImage(this.ogSrc + (this.resolution != -1 ? `?res=${this.resolution}` : ''));
//         }
//         return this.originalImage;
//     }
//     async getOriginalImageData() {
//         let ogImage = await this.getOriginalImage();
//         let canvas = new OffscreenCanvas(ogImage.width, ogImage.height);
//         let ctx = canvas.getContext('2d')
//         ctx.drawImage(ogImage, 0, 0);
//         return ctx.getImageData(0, 0, canvas.width, canvas.height)
//     }
// }