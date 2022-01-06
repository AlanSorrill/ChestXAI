export type RGBA = [r: number, g: number, b: number, a: number];
export enum HMM_Type {
    request, complete, progress, stop
}
export interface HeatMapperMessage {
    type: HMM_Type
    ogSrc: string
    diseaseBitString: string
}
export interface HMM_Request extends HeatMapperMessage {
    type: HMM_Type.request
}
export interface HMM_Complete extends HeatMapperMessage {
    type: HMM_Type.complete
    result: Blob
}
export interface HMM_Progress extends HeatMapperMessage {
    type: HMM_Type.progress
    progress: number
}
export interface HMM_Stop extends HeatMapperMessage {
    type: HMM_Type.stop
    diseaseBitString: string | 'all'
    
}
export function MapID(ogSrc: string, diseaseBitString: string) {
    return `${ogSrc}~${diseaseBitString}`;
}
export function MapID_Reverse(mapId: string): [ogSrc: string, diseaseBitString: string] | null {
    let out = mapId.split('~')
    if (out.length == 2) {
        return out as [string, string];
    }
    return null
}
export function HMM_IS<T extends HeatMapperMessage>(msg: HeatMapperMessage, type: HMM_Type): msg is T {
    return msg.type == type;
}
