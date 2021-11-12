import { removeCammelCase } from "./CommonImports";


export interface Progress {
    task: string,
    alpha: number// percentage zero to one
}

// out_prediction, out_images_and_similarities = obj.run(fileName)
// outPrediction = {'fileName': fileName, 'diagnosis': out_prediction }
// # outPrediction = "{fileName: '8310923871.png', diagnosis: [[0, 0.85], [1, 0.25], [2, 0.99]]}"
// outSimilarity = {'inputFileName': fileName, 'outputFileNames': out_images_and_similarities}

// # outSimilarity = "{inputFileName: '1980138012.png', outputFileNames: [['190329.png', 0.3,'00010'], 
// # ['819023.png', 0.4, '00000'], ['934.png', 0.3, '10000']]}"
export type MsgType = 'prototypeResponse' | 'inferenceResponse' | 'inferenceRequest' | 'status' | 'diseaseDefs' | 'heatmapRequest';
export interface DiseaseDefinition {
    bitStringID: string
    displayName: string
}
export interface PythonInterfaceMessage {
    msgType: MsgType
}
export interface DiseaseDefsMessage {
    msgType: "diseaseDefs",
    names: string[]
}

export class DiseaseManager {
    private static nameIndex: Map<string, DiseaseDefinition> = new Map();
    private static bitIndex: Map<string, DiseaseDefinition> = new Map();
    private static integerIndex: DiseaseDefinition[] = [];
    static initDiseases(names: string[]) {
        this.clear();
        let buildBitString = (index: number) => {
            let out = '';
            for (let i = 0; i < names.length; i++) {
                out += (index == i ? '1' : '0');
            }
            return out;
        }
        for (let i = 0; i < names.length; i++) {
            this.addDisease({
                bitStringID: buildBitString(i),
                displayName: removeCammelCase(names[i])
            })
        }
    }



    static bitStringToDiseases(bitString: string): DiseaseDefinition[] | null {
        if (DiseaseManager.isEmpty) {
            return null;
        }
        let out: DiseaseDefinition[] = []
        for (let i = 0; i < Math.min(bitString.length, this.integerIndex.length); i++) {
            if (bitString[i] == '1') {
                out.push(this.integerIndex[i]);
            }
        }
        return out;
    }
    static get isEmpty() {
        return DiseaseManager.nameIndex.size == 0
    };
    static addDisease(disease: DiseaseDefinition) {
        this.nameIndex.set(disease.displayName, disease);
        this.bitIndex.set(disease.bitStringID, disease);
        this.integerIndex.push(disease);
        return disease;
    }
    static getDiseaseByName(name: string) {
        return this.nameIndex.get(name);
    }
    static getDiseaseByBitStringId(bitId: string) {
        return this.bitIndex.get(bitId);
    }
    static clear() {
        this.nameIndex.clear();
        this.bitIndex.clear();
        this.integerIndex = [];
    }
    static toJson() {
        return JSON.stringify(this.integerIndex);
    }
    static fromJson(json: string | DiseaseDefinition[]) {
        if (typeof json == 'string') {
            json = JSON.parse(json) as DiseaseDefinition[];
        }
        let ths = this;
        this.clear();
        json.forEach((value: DiseaseDefinition, index: number) => {
            ths.addDisease(value);
        })
    }
}
declare global {
    var DiseaseManagerClass: typeof DiseaseManager
}
if (typeof window != 'undefined') {
    console.log("Shiming disease manager into window")
    window.DiseaseManagerClass = DiseaseManager;
}
export class PythonMessage {
    private static isType<T extends PythonInterfaceMessage>(typeName: MsgType, obj: PythonInterfaceMessage): obj is T {
        return obj.msgType == typeName
    }
    static isInterfaceRequest(obj: PythonInterfaceMessage): obj is InferenceRequest {
        return this.isType('inferenceRequest', obj);
    }
    static isInterfaceResponse(obj: PythonInterfaceMessage): obj is InferenceResponse {
        return this.isType('inferenceResponse', obj);
    }
    static isStatus(obj: PythonInterfaceMessage): obj is PythonStatusMessage {
        return this.isType('status', obj);
    }
    static isDiseaseDefs(obj: PythonInterfaceMessage): obj is DiseaseDefsMessage {
        return this.isType('diseaseDefs', obj);
    }
}
export interface InferenceRequest extends PythonInterfaceMessage {
    msgType: 'inferenceRequest',
    fileName: string
}
export interface InferenceResponse extends PythonInterfaceMessage {
    msgType: 'inferenceResponse'
    fileName: string
    prediction: Array<[string, number]>
    similarity: Array<[string, number, string]>
}


export interface HeatmapRequest extends PythonInterfaceMessage {
    msgType: 'heatmapRequest'
    fileName: string
    disease: string
}

export interface PrototypeResponse extends PythonInterfaceMessage {
    msgType: 'prototypeResponse',
    inputDisease: string, // bit string eg 00010
    prototype: string, // full file path of large image
    boundingBox: {
        left: number,
        right: number,
        top: number,
        bottom: number
    }
}



export interface PythonStatusMessage extends PythonInterfaceMessage {
    msgType: 'status'
    message: string
}
export interface UploadResponse {
    success: boolean,
    uploadId: string,
    fileName: string,
    imageBlob?: string
    //diseaseName, percentage
    diagnosis: [disease: DiseaseDefinition, confidence: number][]
    //filePath, matchPercentage, diseaseName[]
    similarity: [otherImageUrl: string, matchConfidence: number, diseases: DiseaseDefinition[]][]
}
// export interface PredictionResult {
//     fileName: string,
//     diagnosis: Array<[Disease, number]>
// }
// export interface SimilarityResult {
//     inputFileName: string,
//     outputFileNames: Array<[string, number, Disease]>
// }
