import { Progress } from "../Common/SharedDataDefs";
import { Session, logger, LogLevel } from "./ClientImports";
let log = logger.local('ClientSession');
log.allowBelowLvl(LogLevel.naughty)
export class ClientSession extends Session {
    get progress(): Progress {
        return this.progressValue
    }
    protected progressValue: Progress = null

    socket: WebSocket
    constructor(id: string) {
        super(id);
        let ths = this;
        this.socket = new WebSocket(urlManager.parsed.origin.replace('http', 'ws') + `?sesh=${id}`);
        this.socket.onopen = (ev: Event) => {
            ths.onSocketOpened();
        }
        this.socket.onmessage = (ev: MessageEvent<any>) => {
            ths.onRecieve(ev.data);
        }
        this.socket.onclose = (ev: CloseEvent) => {
            ths.onSocketClosed();
        }
    }
    onSocketOpened() {
        log.info(`Sesh Socket opened for ${this.id}`);
    }
    onSocketClosed(): void {

        log.error(`Sesh Socket closed for ${this.id}`);
    }
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        this.socket?.send(data)
    }
    onRecieve(data: any): void {
        log.info(`SeshSocket ${this.id} recieved`, data);
    }
}