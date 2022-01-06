import { clamp, delay, LogLevel } from 'bristolboard';

import { logger } from './ClientImports';
let log = logger.local('ImageEditor').allowBelowLvl(LogLevel.naughty);

export type RGBA = [r: number, g: number, b: number, a: number];
export interface ImageEditorOptions {
    yieldOn?: 'pixel' | 'row' | 'none' | number,
    onStart?: (getImageData: () => Promise<string>, stop: () => void) => void
}

export class ImageEditor {

    static async editImage(original: string | HTMLImageElement | ImageData, pixels: (x: number, y: number, oldPixel: RGBA, imgData: ImageData) => RGBA, options: ImageEditorOptions): Promise<string> {
        if (typeof options.yieldOn == 'undefined') {
            options.yieldOn = 'row'
        }
        if (typeof original == 'string') {
            original = await this.loadImage(original);
        }
        if (original == null) {
            log.error(`No image to edit`);
        }
        let size = [original.width, original.height];
        log.info(`Editing image of size ${size[0]} by ${size[1]}`)
        let canvas = new OffscreenCanvas(size[0], size[1]);
        let ctx = canvas.getContext('2d');
        if (original instanceof ImageData) {
            ctx.putImageData(original, 0, 0);
        } else {
            ctx.drawImage(original, 0, 0);
        }

        let data = ctx.getImageData(0, 0, size[0], size[1]);

        let startColor: RGBA = [0, 0, 0, 0];
        let startIndex: number;
        let lastYeildRow = 0;
        let yieldIncrement = typeof options.yieldOn == 'number' ? size[0] / options.yieldOn : 10;

        let stopFlag = false;
        let imageToDataUrl = () => new Promise<string>(async (acc, rej) => {
            let reader = new FileReader();
            reader.onload = () => {
                acc(reader.result as string);
            }
            reader.readAsDataURL(await canvas.convertToBlob());
        });
        if (typeof options.onStart == 'function') {
            options.onStart(imageToDataUrl, () => { stopFlag = false });
        }
        for (let x = 0; x <= size[0] && !stopFlag; x++) {
            for (let y = 0; y < size[1]; y++) {
                startIndex = y * size[0] * 4 + x * 4;
                for (let channel = 0; channel < 4; channel++) {
                    startColor[channel] = data.data[startIndex + channel]
                }

                let color = pixels(x, y, startColor, data);

                for (let channel = 0; channel < 4; channel++) {
                    data.data[startIndex + channel] = clamp(color[channel], 0, 255);
                }
                // if (yieldOn == 'pixel') {
                //     await delay(0);
                // }
            }
            if (options.yieldOn == 'row') {
                await delay(0);
            } else if (typeof options.yieldOn == 'number') {
                if (x - lastYeildRow > yieldIncrement) {
                    lastYeildRow = x;
                    await delay(0);
                }
            }
        }
        ctx.putImageData(data, 0, 0)
        return imageToDataUrl()


    }

    static async loadImage(urlOrImage: string): Promise<HTMLImageElement | null> {
        let image: HTMLImageElement;
        let callback: (img: HTMLImageElement) => void;
        let isLoaded = false;
        image = new Image();
        image.src = urlOrImage;
        image.onload = () => {
            console.log(`Completing listener for ${urlOrImage}`)
            isLoaded = true;
            callback(image);
        }
        image.onerror = (err) => {
            console.log(err);
            isLoaded = true;
            image = null;
            callback(null);
        }
        return new Promise((acc, rej) => {
            if (isLoaded) {
                acc(image);
                return;
            }
            callback = acc;
        });
    }

    static async buildImage(pixels: (x: number, y: number) => RGBA, size: [width: number, height: number]) {
        size[0] = Math.round(size[0])
        size[1] = Math.round(size[1])
        let canvas = new OffscreenCanvas(size[0], size[1]);
        let ctx = canvas.getContext('2d');

        let data = ctx.getImageData(0, 0, size[0], size[1]);
        for (let x = 0; x <= size[0]; x++) {
            for (let y = 0; y < size[1]; y++) {
                let color = pixels(x, y);
                let startIndex = y * size[0] * 4 + x * 4;
                //console.log(`${startIndex} (${x},${y}) -> ${color[0]}`)
                for (let channel = 0; channel < 4; channel++) {
                    data.data[startIndex + channel] = color[channel];
                }
            }
        }
        ctx.putImageData(data, 0, 0)
        return URL.createObjectURL(await canvas.convertToBlob());
    }


}
