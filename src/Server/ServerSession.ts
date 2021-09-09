
import { Progress } from "../Common/SharedDataDefs";
import { Session, WebSocket } from "./ServerImports";


export class ServerSession extends Session {
    get progress(): Progress {
        return this.progressValue
    }
    protected progressValue: Progress = {
        task: 'starting',
        alpha: 0
    }
    registerSocket(clientSocket: WebSocket) {
        let ths = this;
        this.sockets.push(clientSocket);
        clientSocket.onopen = (ev: WebSocket.OpenEvent) => {
            ths.onSocketOpened();
        }
        clientSocket.onmessage = (ev: WebSocket.MessageEvent) => {
            ths.onRecieve(ev.data, clientSocket);
        }
        clientSocket.onclose = (ev: WebSocket.CloseEvent) => {
            ths.onSocketClosed();
        }
    }
    sockets: WebSocket[] = []


    constructor(id: string) {
        super(id);
    }
    onSocketOpened(): void {

    }
    onSocketClosed(): void {
        this.sockets.removeInPlace((sock: WebSocket) => (sock.readyState == WebSocket.OPEN || sock.readyState == WebSocket.CONNECTING))
    }
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {

    }
    onRecieve(data: any, socket: WebSocket): void {

    }
}