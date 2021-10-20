import { Progress } from "./CommonImports";

export abstract class Session {
    id: string;
    hasSocket: boolean = false
    constructor(id: string) {
        this.id = id;
    }
    abstract onSocketOpened(): void
    abstract onSocketClosed(): void
    abstract send(data: SeshMsg): void
    abstract get progress(): Progress;
}

export interface SeshMsg {
    typeName: string
}
export interface SeshConnect extends SeshMsg{
    requestId: string
}
