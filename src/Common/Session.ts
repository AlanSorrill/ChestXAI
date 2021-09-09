import { Progress } from "./commonImports";

export abstract class Session {
    id: string;
    hasSocket: boolean = false
    constructor(id: string) {
        this.id = id;
    }
    abstract onSocketOpened(): void
    abstract onSocketClosed(): void
    abstract send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void
    abstract get progress(): Progress;
}