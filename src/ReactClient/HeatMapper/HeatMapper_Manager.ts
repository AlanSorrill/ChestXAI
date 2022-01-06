import { HeatMapperMessage, HMM_Complete, HMM_IS, HMM_Progress, HMM_Request, HMM_Stop, HMM_Type } from "./HeatMapper_Defs";

export interface HeatMapper_Callbacks {
    onProgress: (progress: number) => void,
    onComplete: (dataUrl: string) => void
    onFail: (err: Error) => void,
}
export class HeatMapper_Manager {
    // stopAll(ogSrc: string) {
    //     console.log(new Error("HeatMapper_Manager.stopAll Method not implemented."));
    // }
    //#region Messaging & Singlton Stuff
    static singlton: HeatMapper_Manager = new HeatMapper_Manager();
    worker: Worker;

    private constructor() {
        let ths = this;
        this.worker = new Worker('./wp/heatMapperWorker.js');
        this.worker.addEventListener('message', (event: MessageEvent<HeatMapperMessage>) => {
            ths.recieveMessage(event.data);
        })
        this.worker.addEventListener('error', (event: ErrorEvent) => {
            console.log(`Manager recieved error from worker`, event);
        })
    }
    sendMessage(message: HeatMapperMessage) {
        this.worker.postMessage(message);
    }
    //#endregion

    private callbacks: Map<string, Map<string, HeatMapper_Callbacks[]>> = new Map();
    private resultDataUrls: Map<string, Map<string, string>> = new Map();
    private setResult(ogSrc: string, diseaseBitString: string, result: string) {
        if (!this.resultDataUrls.has(ogSrc)) {
            this.resultDataUrls.set(ogSrc, new Map());
        }
        this.resultDataUrls.get(ogSrc).set(diseaseBitString, result);
    }
    getResult(ogSrc: string, diseaseBitString: string): string | null {
        if (this.resultDataUrls.has(ogSrc)) {
            let maps = this.resultDataUrls.get(ogSrc)
            if (maps.has(diseaseBitString)) {
                return maps.get(diseaseBitString);
            }
            return null;
        }
        return null
    }

    private getCallbacks(ogSrc: string) {
        if (this.callbacks.has(ogSrc)) {
            return this.callbacks.get(ogSrc);
        } 
        return null;
    }
    private getCallback(ogSrc: string, diseaseBitString: string) {
        let forImage = this.getCallbacks(ogSrc);
        if (forImage == null) {
            return null;
        }
        return forImage.get(diseaseBitString);
    }

    //return 'remove' to delete this from the list
    private forEachCallback(ogSrc: string, diseaseBitString: string, onEach: (callBack: HeatMapper_Callbacks) => (void | 'remove')) {
        let list = this.getCallback(ogSrc, diseaseBitString);
        if (list == null) {
            return;
        }
        for (let i = 0; i < list.length; i++) {
            if (onEach(list[i]) == 'remove') {
                list.splice(i, 1);
            }
        }

    }
    private setCallback(ogSrc: string, diseaseBitString: string, callback: HeatMapper_Callbacks) {
        let forImage = this.getCallbacks(ogSrc);
        if (forImage == null) {
            forImage = new Map();
            this.callbacks.set(ogSrc, forImage);
        }
        if (!forImage.has(diseaseBitString)) {
            forImage.set(diseaseBitString, [callback]);
        } else {
            forImage.get(diseaseBitString).push(callback);
        }
    }

    private recieveMessage(message: HeatMapperMessage) {
        // console.log(`Manager Recived`, message);
        let ths = this;
        if (HMM_IS<HMM_Progress>(message, HMM_Type.progress)) {
            this.forEachCallback(message.ogSrc, message.diseaseBitString, (callbacks: HeatMapper_Callbacks) => {
                callbacks.onProgress(message.progress)
            })
        } else if (HMM_IS<HMM_Complete>(message, HMM_Type.complete)) {
            this.forEachCallback(message.ogSrc, message.diseaseBitString, (callback: HeatMapper_Callbacks) => {
                let dataUrl: string = URL.createObjectURL(message.result);
                ths.setResult(message.ogSrc, message.diseaseBitString, dataUrl);
                callback.onProgress(1);
                callback.onComplete(dataUrl);
                return 'remove'
            })
        }
    }
    cancel(ogSrc: string, bitString: string = 'all'){
        let message: HMM_Stop = {
            type: HMM_Type.stop,
            diseaseBitString: bitString,
            ogSrc: ogSrc
        }
        this.sendMessage(message);
    }
    getHeatMap(ogSrc: string, diseaseBitString: string, callback: HeatMapper_Callbacks) {
        console.log(`HeatMapper_Manager.getHeatMap(${ogSrc}, ${diseaseBitString})`)
        let result = this.getResult(ogSrc, diseaseBitString);
        if (result != null) {
            console.log(`Returning (${ogSrc}, ${diseaseBitString})`)
            callback.onProgress(1);
            callback.onComplete(result);
        } else {
            console.log(`Requesting (${ogSrc}, ${diseaseBitString})`)
            this.setCallback(ogSrc, diseaseBitString, callback);
            this.sendHeatmapRequest(ogSrc, diseaseBitString);
        }

    }

    private sendHeatmapRequest(ogSrc: string, diseaseBitString: string) {
        let message: HMM_Request = {
            type: HMM_Type.request,
            ogSrc: ogSrc,
            diseaseBitString: diseaseBitString
        }
        this.sendMessage(message);
    }

}