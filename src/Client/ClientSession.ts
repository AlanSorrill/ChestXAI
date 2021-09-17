import { Progress } from "../Common/SharedDataDefs";
import { Session, logger, LogLevel, SeshMsg } from "./ClientImports";
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
        this.socket = new WebSocket(urlManager.parsed.origin.replace('http', 'ws') + (id != null ? `?sesh=${id}` : ''));
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
    static async fileToStream(file: File, chunkSize: number = 10): Promise<ReadableStream> {
        return new Promise((acc, rej) => {
            let reader = new FileReader();
            log.info(`Opening file ${file.name}`)
            reader.onload = async (ev: ProgressEvent<FileReader>) => {
                log.info(`Opened file ${file.name}`)
                let data: ArrayBuffer = ev.target.result as ArrayBuffer;
                let length = data.byteLength;
                let index = 0;
                let getNextChunk = () => {
                    if (index > length) {
                        log.info(`File stream over because ${index} > ${length}`)
                        return null;
                    }
                    log.debug(`Reading chunk ${index} to ${index + chunkSize}`)
                    let chunk = data.slice(index, index + chunkSize);
                    index += chunkSize;
                    return chunk;
                }
                const readableStream = new ReadableStream({
                    start(controller) {
                        /* … */
                        controller.enqueue(getNextChunk())
                    },

                    pull(controller) {
                        /* … */
                        let chunk = getNextChunk();
                        if (chunk == null) {
                            controller.close();
                        } else {
                            controller.enqueue(getNextChunk())
                        }

                    },

                    cancel(reason) {
                        /* … */
log.error(reason);
                    },
                });
                acc(readableStream);
            }
            reader.readAsArrayBuffer(file);
        });

    }
    onSocketOpened() {
        log.info(`Sesh Socket opened for ${this.id}`);
    }
    onSocketClosed(): void {

        log.error(`Sesh Socket closed for ${this.id}`);
    }
    send(data: SeshMsg) {
        this.socket?.send(JSON.stringify(data))
    }
    onRecieve(data: any): void {
        log.info(`SeshSocket ${this.id} recieved`, data);
    }


}