import { urlParse } from "./clientImports";

export class Rest {
    static async get<ReturnType>(url: string, headers: Map<string, string> = new Map(), body: any = null) {
        return await this.request<ReturnType>(url, RestMethod.GET, headers, body);
    }
    static async post<ReturnType>(url: string, headers: Map<string, string> = new Map(), body: any = null) {
        return await this.request<ReturnType>(url, RestMethod.POST, headers, body);
    }
    static async request<ReturnType>(url: string, method: RestMethod, headers: Map<string, string>, body: any = null) {
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

