import { ImageEditor, RGBA } from "../Client/ImageEditing";

export class XRayManager {
    constructor() {

    }
}

export class HeatMapper {

    ogSrc: string
    heatmapImages: Map<string, string> = new Map();
    heatmapProgress: Map<string, number> = new Map();
    resolution: number;
    constructor(ogImage: string, resolution: number = -1) {
        this.ogSrc = ogImage;
        this.resolution = resolution;
    }
    async preloadHeatmap(diseaseBitString: string, yeildCount: number = 25, listener: (bitString: string, progress: number) => void = () => { }) {
        let heatmapLink = `${this.ogSrc}${(this.ogSrc.includes('?') ? '&' : '?')}heatmap=${diseaseBitString}`;
        let text = await fetch(heatmapLink);
        let data = await (text).json();
        let dataWidth = data.length;
        let ths = this;

        let getHeat = (xAlpha: number, yAlpha: number): number => {
            let xCoord = Math.floor(dataWidth * xAlpha);
            let yCoord = Math.floor(dataWidth * yAlpha);
            let output = data[yCoord][xCoord]
            return output;
        }



        this.heatmapImages.set(diseaseBitString, (await ImageEditor.editImage(await this.getOriginalImage(), (x: number, y: number, oldPixel: RGBA, imgData: ImageData): RGBA => {
            let p = (x * imgData.height + y) / (imgData.width * imgData.height);
            //console.log(`Edit image at (${x}, ${y}) alpha=(${p})`);
            ths.heatmapProgress.set(diseaseBitString, p);
            listener(diseaseBitString, p);
            return [oldPixel[0], oldPixel[1], oldPixel[1], getHeat(x / imgData.width, y / imgData.height)];
        }, yeildCount)));
        listener(diseaseBitString, 1);
        console.log(`Completed heatmap`)
    }

    async getHeatmap(diseaseBitString: string, yieldCount: number = 25) {
        if (!this.heatmapImages.has(diseaseBitString)) {
            await this.preloadHeatmap(diseaseBitString, yieldCount);
        }
        return this.heatmapImages.get(diseaseBitString);
    }
    // async displayHeatmap(diseaseBitString: string) {
    //     if(diseaseBitString == null){
    //         this.currentHeatmap = null;
    //         this.setImage(await this.getOriginalImage(20));
    //         console.log(`Displaying defalt heatmap`);
    //         return;
    //     }
    //     if (!this.heatmapImages.has(diseaseBitString)) {
    //         this.setImage(await this.getOriginalImage(20));
    //         this.currentHeatmap = null;
    //         await this.preloadHeatmap(diseaseBitString);
    //     }
    //     this.setImage(this.heatmapImages.get(diseaseBitString))
    //     this.currentHeatmap = diseaseBitString;
    //    // this.fitHorizontally();
    //     //this.centerHorizontally();
    //    // this.centerVertically();
    //     console.log(`Displaying heatmap ${diseaseBitString}`)
    // }

    private originalImage: HTMLImageElement = null
    async getOriginalImage() {
        if (this.originalImage == null) {
            this.originalImage = await ImageEditor.loadImage(this.ogSrc + (this.resolution != -1 ? `?res=${this.resolution}` : ''));
        }
        return this.originalImage;
    }
}