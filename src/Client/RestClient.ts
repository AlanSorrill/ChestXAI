import { urlParse } from "./clientImports";

export interface RestHeaders {
    'Content-Type'?: string,
}
export class Rest {
    static async get<ReturnType>(url: string, headers: Map<string, string> | RestHeaders = new Map(), body: any = null) {
        return await this.request<ReturnType>(url, RestMethod.GET, headers, body);
    }
    static async post<ReturnType>(url: string, headers: Map<string, string> | RestHeaders = new Map(), body: any = null) {
        return await this.request<ReturnType>(url, RestMethod.POST, headers, body);
    }
    static async request<ReturnType>(url: string, method: RestMethod, headers: Map<string, string> | RestHeaders, body: any = null) {
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

}
export enum RestMethod {
    GET = 'GET',
    POST = 'POST'
}


