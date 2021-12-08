import { ImageEditor, MainBristol, RGBA, UIFrame, UI_Image } from "../ClientImports";

export class UI_XRay_Image extends UI_Image {

    async preloadHeatmap(diseaseBitString: string, yeildCount: number = 25) {
        let heatmapLink = `${this.ogSrc}${(this.ogSrc.includes('?') ? '&' : '?')}heatmap=${diseaseBitString}`;
        let data = await (await fetch(heatmapLink)).json();
        let dataWidth = data.length;
        let ths = this;

        let getHeat = (xAlpha: number, yAlpha: number) => {
            let xCoord = Math.floor(dataWidth * xAlpha);
            let yCoord = Math.floor(dataWidth * yAlpha);
            let output = data[yCoord][xCoord]
            return output;
        }

        

        this.heatmapImages.set(diseaseBitString, await ImageEditor.editImage(await this.getOriginalImage(20), (x: number, y: number, oldPixel: RGBA, imgData: ImageData) => {
           let p = (x * imgData.height + y) / (imgData.width * imgData.height);
           //console.log(`Edit image at (${x}, ${y}) alpha=(${p})`);
            ths.heatmapProgress.set(diseaseBitString, p);
            return [oldPixel[0], oldPixel[1], oldPixel[1], getHeat(x / imgData.width, y / imgData.height)];
        }, yeildCount));
        console.log(`Completed heatmap`)
    }
    currentHeatmap: string = null

    async displayHeatmap(diseaseBitString: string) {
        if(diseaseBitString == null){
            this.currentHeatmap = null;
            this.setImage(await this.getOriginalImage(20));
            console.log(`Displaying defalt heatmap`);
            return;
        }
        if (!this.heatmapImages.has(diseaseBitString)) {
            this.setImage(await this.getOriginalImage(20));
            this.currentHeatmap = null;
            await this.preloadHeatmap(diseaseBitString);
        }
        this.setImage(this.heatmapImages.get(diseaseBitString))
        this.currentHeatmap = diseaseBitString;
       // this.fitHorizontally();
        //this.centerHorizontally();
       // this.centerVertically();
        console.log(`Displaying heatmap ${diseaseBitString}`)
    }
    ogSrc: string = null;
    private originalImage: HTMLImageElement = null
    async getOriginalImage(resolution: number = -1) {
        if (this.originalImage == null) {
            this.originalImage = await ImageEditor.loadImage(this.ogSrc + (resolution != -1 ? `?res=${resolution}` : ''));
        }
        return this.originalImage;
    }
    getHeatmapProgress(diseaseBitString: string){
        if(this.heatmapProgress.has(diseaseBitString)){
            return this.heatmapProgress.get(diseaseBitString);
        }
        return -1;
    }
    constructor(urlOrImage: string, uiFrame: UIFrame, brist: MainBristol) {
        super(urlOrImage, uiFrame, brist);
        this.ogSrc = urlOrImage;
        let ths = this;
        ImageEditor.loadImage(urlOrImage).then((img: HTMLImageElement) => {
            ths.originalImage = img;
        })
    }
    heatmapImages: Map<string, string | HTMLImageElement> = new Map();
    heatmapProgress: Map<string, number> = new Map();
}