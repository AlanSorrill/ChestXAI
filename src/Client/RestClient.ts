import { urlParse, logger, LogLevel } from "./ClientImports";
let log = logger.local('RestClient')
log.allowBelowLvl(LogLevel.naughty)
export interface RestHeaders {
    'Content-Type'?: string,
}
export abstract class Socker {
    static async get<ReturnType>(url: string, headers: Map<string, string> | RestHeaders = new Map(), body: any = null) {
        return await this.requesteHTTP<ReturnType>(url, RestMethod.GET, headers, body);
    }
    static async post<ReturnType>(url: string, headers: Map<string, string> | RestHeaders = new Map(), body: any = null) {
        return await this.requesteHTTP<ReturnType>(url, RestMethod.POST, headers, body);
    }
    static async requesteHTTP<ReturnType>(url: string, method: RestMethod, headers: Map<string, string> | RestHeaders, body: any = null) {
        if (!(headers instanceof Map)) {
            let description = headers;
            headers = new Map();
            for (const key in description) {
                headers.set(key, description[key]);
            }
        }
        if (!headers.has('Content-Type')) {
            headers.set("Content-Type", "application/json")
        }
        return new Promise<ReturnType>((acc, rej) => {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    let out: ReturnType = JSON.parse(xmlhttp.responseText);
                    acc(out);
                    return;
                }
                rej({
                    status: xmlhttp.status,
                    response: xmlhttp.responseText
                })
            }
            xmlhttp.open(method, url, false);
            if (body != null) {
                xmlhttp.send(body);
                return;
            }
            xmlhttp.send();
        });
    }
    socket: WebSocket
    url: urlParse
    constructor(url: string) {
        let ths = this;
        this.url = urlParse(url, true);
        this.socket = new WebSocket(url);
        this.socket.onopen = function (event: Event) {
            log.info(`Socket opened`, event)
            ths.onOpen();
        }
        this.socket.onmessage = function (this: WebSocket, ev: MessageEvent<any>) {
            log.info(`Socket msg recieved`, ev);
            ths.onRecieve(ev.data);
        }
    }
    sendRaw(data: any) {
        this.socket.send(data);
    }
    send(data: string) {
        this.sendRaw(data);
    }
    sendJson<T extends Object>(jsonData: T) {
        this.send(JSON.stringify(jsonData));
    }
    abstract onOpen(): void
    abstract onRecieve(data: string): void

}
export class HTTPSocker extends Socker {
    method: RestMethod;
    headers: Map<string, string>;
    constructor(url: string, method: RestMethod, headers: Map<string, string>) {
        super(url);
        this.method = method;
        this.headers = headers;
    }
    onOpen() {
        let ths = this;
        let headerPayload: string[];
        headerPayload.push(`${this.method} ${this.url.pathname} HTTP/1.1\n`);
        this.headers.forEach((value: string, key: string) => {
            headerPayload.push(`${key}: ${value}\n`);
        })
        this.send(headerPayload.join('\n') + '\n');
    }
    private recievedHeader
    onRecieve(data: string): void {
        throw new Error("Method not implemented.");
    }

}

export enum RestMethod {
    GET = 'GET',
    POST = 'POST'
}


