import { delay } from "bristolboard/lib/Helper";
import { HeatMapperMessage, HMM_Complete, HMM_IS, HMM_Progress, HMM_Request, HMM_Stop, HMM_Type, MapID, RGBA } from "./HeatMapper_Defs";

let sendMsg = self.postMessage
export class HeatMapper_Worker {
    //#region Messaging & Singlton Stuff
    static singlton: HeatMapper_Worker = new HeatMapper_Worker();
    heatmapCancels: Map<string, Map<string, () => void>> = new Map();
    addCancel(ogSrc: string, bitString: string, cancel: () => void) {
        if (!this.heatmapCancels.has(ogSrc)) {
            this.heatmapCancels.set(ogSrc, new Map());
        }
        this.heatmapCancels.get(ogSrc).set(bitString, cancel);
    }
    getCancels(ogSrc: string, bitString: (string) = 'all'): (() => void) | (() => void)[] | null {
        if (!this.heatmapCancels.has(ogSrc)) {
            return null;
        }
        if (bitString == 'all') {
            return this.heatmapCancels.get(ogSrc).toArray()
        }
        return this.heatmapCancels.get(ogSrc).get(bitString);
    }
    private constructor() {

    }
    sendMessage(message: HeatMapperMessage) {
        //console.log(`Worker sending`, message)
        sendMsg(message);
    }
    //#endregion
    recieveMessage(message: HeatMapperMessage) {
        // console.log(`Worker Recived`, message);
        if (HMM_IS<HMM_Request>(message, HMM_Type.request)) {
            this.requestHeatmap(message.ogSrc, message.diseaseBitString);
        } else if (HMM_IS<HMM_Stop>(message, HMM_Type.stop)) {
            console.log(`Canceling for `, message)
            let cancels = this.getCancels(message.ogSrc, message.diseaseBitString)
            if (cancels == null) {
            } else if (Array.isArray(cancels)) {
                cancels.forEach((cancel: () => void) => { cancel() })
            } else {
                cancels();
            }
            if (message.diseaseBitString == 'all') {
                this.heatmapCancels.get(message.ogSrc);
            }
        }
    }

    ogImages: Map<string, ImageData> = new Map();
    results: Map<string, Map<string, Blob>> = new Map();

    private setResult(ogSrc: string, diseaseBitString: string, result: Blob) {
        if (!this.results.has(ogSrc)) {
            this.results.set(ogSrc, new Map());
        }
        this.results.get(ogSrc).set(diseaseBitString, result);
    }
    private getResult(ogSrc: string, diseaseBitString: string): Blob | null {
        if (this.results.has(ogSrc)) {
            let maps = this.results.get(ogSrc)
            if (maps.has(diseaseBitString)) {
                return maps.get(diseaseBitString);
            }
            return null;
        }
        return null
    }

    async getOriginalImage(ogSrc: string) {
        if (this.ogImages.has(ogSrc)) {
            console.log(`Using ogImage from cache ${ogSrc}`)
            return this.ogImages.get(ogSrc);
        } else {
            console.log(`Downloading image ${ogSrc}`);
            let result = await HeatMapper_Worker.downloadImage(ogSrc);
            if (result instanceof Error) {
                console.log(`Failed to download ${ogSrc} because`, result);
                return null;
            }
            this.ogImages.set(ogSrc, result);
            return result;
        }
    }

    async requestHeatmap(ogSrc: string, diseaseBitString: string) {
        let res = this.getResult(ogSrc, diseaseBitString);
        if (res != null) {
            this.sendHeatmap(ogSrc, diseaseBitString, res);
            return 'success';
        }
        let originalImage = await this.getOriginalImage(ogSrc);
        if (originalImage == null) {
            return 'fail'
        }
        let ths = this;


        let heatmapLink = `${location.origin}/${ogSrc}${(ogSrc.includes('?') ? '&' : '?')}heatmap=${diseaseBitString}`;
        let text = await fetch(heatmapLink);
        let data = await (text).json();
        let dataWidth = data.length;

        let getHeat = (xAlpha: number, yAlpha: number): number => {
            let xCoord = Math.floor(dataWidth * xAlpha);
            let yCoord = Math.floor(dataWidth * yAlpha);
            let output = data[yCoord][xCoord]
            return output;
        }

        let mapId = MapID(ogSrc, diseaseBitString);
        let lastP = -1;
        let img = (await HeatMapper_Worker.editImage(originalImage, (x: number, y: number, oldPixel: RGBA, imgData: ImageData): RGBA => {
            let p = (x * imgData.width + y) / (imgData.width * imgData.height);
            if (lastP == -1 || p - lastP > 0.1) {
                ths.sendProgress(ogSrc, diseaseBitString, p);
                lastP = p;
            }
            //console.log(`Edit image at (${x}, ${y}) alpha=(${p})`);
            // ths.heatmapProgress.set(diseaseBitString, p);
            //listener(diseaseBitString, p);
            return [oldPixel[0], oldPixel[1], oldPixel[1], getHeat(x / imgData.width, y / imgData.height)];
        }, (stop: () => void) => {
            // ths.heatmapAquisitions.set(diseaseBitString, [getImageData, false]);
            ths.addCancel(ogSrc, diseaseBitString, stop);

        }
        ))
        ths.heatmapCancels.delete(mapId)
        ths.sendProgress(ogSrc, diseaseBitString, 1);
        ths.setResult(ogSrc, diseaseBitString, img);
        ths.sendHeatmap(ogSrc, diseaseBitString, img);
    }

    private sendProgress(ogSrc: string, diseaseBitString: string, progress: number) {
        let message: HMM_Progress = {
            type: HMM_Type.progress,
            progress: progress,
            ogSrc: ogSrc,
            diseaseBitString: diseaseBitString
        }
        this.sendMessage(message);
    }
    private sendHeatmap(ogSrc: string, diseaseBitString: string, result: Blob) {
        let message: HMM_Complete = {
            type: HMM_Type.complete,
            ogSrc: ogSrc,
            diseaseBitString: diseaseBitString,
            result: result
        }
        this.sendMessage(message)
    }

    //#region Image Helpers
    static async editImage(original: ImageData, pixels: (x: number, y: number, oldPixel: RGBA, imgData: ImageData) => RGBA, onStart: (cancel: () => void) => void = () => { }): Promise<Blob> {

        let size = [original.width, original.height];
        console.log(`Threaded Editing image of size ${size[0]} by ${size[1]}`)
        let canvas = new OffscreenCanvas(size[0], size[1]);
        let ctx = canvas.getContext('2d');
        ctx.putImageData(original, 0, 0);

        let data = ctx.getImageData(0, 0, size[0], size[1]);

        let startColor: RGBA = [0, 0, 0, 0];
        let startIndex: number;


        let stopFlag = false;
        // let imageToDataUrl = () => new Promise<string>(async (acc, rej) => {
        //     let reader = new FileReader();
        //     reader.onload = () => {
        //         acc(reader.result as string);
        //     }

        //     reader.readAsDataURL(await canvas.convertToBlob());
        // });
        let lastYield = 0;
        onStart(() => { stopFlag = false });
        for (let x = 0; x <= size[0] && !stopFlag; x++) {
            for (let y = 0; y < size[1]; y++) {
                startIndex = y * size[0] * 4 + x * 4;
                for (let channel = 0; channel < 4; channel++) {
                    startColor[channel] = data.data[startIndex + channel]
                }

                let color = pixels(x, y, startColor, data);

                for (let channel = 0; channel < 4; channel++) {
                    data.data[startIndex + channel] = Math.max(Math.min(color[channel], 255), 0);
                }
                // if (yieldOn == 'pixel') {
                //     await delay(0);
                // }
            }
            if (x - lastYield > size[0] / 4) {
                lastYield = x;
                // console.log(`Worker Yield`)
                await delay(0);
            }
        }
        ctx.putImageData(data, 0, 0)

        return await canvas.convertToBlob();


    }
    static async downloadImage(src: string): Promise<ImageData | Error> {
        if (src[0] != '/') {
            src = location.origin + '/' + src;
        }
        let response = await fetch(src);
        if (response.status == 200) {
            let img = await createImageBitmap(await response.blob())
            let canvas = new OffscreenCanvas(img.width, img.height);
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0);
            return ctx.getImageData(0, 0, canvas.width, canvas.height);
        } else {
            return new Error(response.statusText);
        }
    }
    //#endregion
}


self.onmessage = function (event: MessageEvent<HeatMapperMessage>) {
    // console.log('~~~~~~~~~~~~~~~~~~~~')
    HeatMapper_Worker.singlton.recieveMessage(event.data);
}


