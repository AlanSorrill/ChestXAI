
import { evalOptionalFunc, optFunc, urlParse } from "./ClientImports";


export type UrlDataType = (string | number | boolean | UrlDataType[])
export interface UrlListener {
    onValueSet(key: string, value: UrlDataType): void

}
export class UrlManager {
    private listener: UrlListener = null;
    setListener(listener: UrlListener) {
        this.listener = listener;
        this.queryValues.forEach((value: UrlDataType, key: string) => {
            listener.onValueSet(key, value);
        })
    }
    base: string;
    constructor() {
        let parse = urlParse(window.location.href, true);
        this.base = parse.pathname;
    }
    queryValues: Map<string, UrlDataType> = new Map();
    set<T extends UrlDataType>(key: string, value: T) {
        this.queryValues.set(key, value);
        this.listener?.onValueSet(key, value);
        this.update();
    }
    get<T extends UrlDataType>(key: string, defaultValue: optFunc<T> = null): T {
        return this.queryValues?.get(key) as T ?? evalOptionalFunc(defaultValue);
    }
    private update() {
        let params: string = '';
        let txtValue: string = null;
        this.queryValues.forEach((value: UrlDataType, key: string) => {

            if (value instanceof Array && Array.isArray(value)) {
                txtValue = JSON.stringify(value);
            } else {
                txtValue = value + '';
            }
            if (params == '') {
                params = `?${key}=${txtValue}`
            } else {
                params += `&${key}=${txtValue}`;
            }
        })

        history.replaceState({}, '', `${this.base}${params}`)
    }
    get page(): string {
        return this.get<string>('page', 'upload');
    }
    setPage(page: string) {
        this.set('page', page);
    }
    get version(): number {
        return this.get<number>('version', 0);
    }
    setVersion(newVersion: number) {
        this.set('version', newVersion);
    }
}
