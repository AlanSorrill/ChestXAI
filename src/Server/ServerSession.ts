
import { Progress } from "../Common/SharedDataDefs";
import { SeshMsg, Session, logger, WebSocket } from "./ServerImports";
let log = logger.local('ServerSession')

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
            if (!ths.isInitialized) {
                ths.isInitialized = true;
                ths.onInitialized();
            }
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
    static uidCounter: number = 0
    static getFreshId(): string {
        return `bigSesh${this.uidCounter++}`
    }
    isInitialized: boolean = false;
    onInitialized(): void {

    }
    onSocketOpened(): void {

    }
    onSocketClosed(): void {
        this.sockets.removeInPlace((sock: WebSocket) => (sock.readyState == WebSocket.OPEN || sock.readyState == WebSocket.CONNECTING))
    }
    send(data: SeshMsg): void {
        this.sockets.forEach((socket: WebSocket, index: number) => {
            socket?.send(JSON.stringify(data))
        })
    }
    onRecieve(data: any, socket: WebSocket): void {
        log.info(`${socket.url} Recieved `)
    }
}