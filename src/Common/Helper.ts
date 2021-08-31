

declare global {

    interface String {
        replaceAll(a: string, b: string): string;
    }



}

export type optFunc<T> = T | (() => T);
export type optTransform<I, O> = O | ((input: I) => O);



String.prototype.replaceAll = function (a: string, b: string) {
    return this.split(a).join(b);
};
export function isNumber(input: number | string) {
    return !isNaN(input as any)
}
export function lerp(start: number, end: number, alpha: number) {
    return start + (end - start) * alpha;
}

export function evalOptionalFunc<T>(input: optFunc<T>, def: T = null) {
    if (input == null || input == undefined) {
        return def;
    }
    if (typeof input == 'function') {
        return (input as (() => T))();
    }

    return input;
}
export function csvToJson<T>(csvText: string) {
    let csvLines = csvText.split(csvText.includes('\r\n') ? '\r\n' : '\n');
    let colTitles = csvLines.shift().split(',').map((oldTitle: string) => cammelCase(oldTitle));
    let out: T[] = [];
    for (let i = 0; i < csvLines.length; i++) {
        let row = csvLines[i].split(',');
        let rowData = {};
        for (let col = 0; col < colTitles.length; col++) {
            rowData[colTitles[col]] = row[col];
        }
        out.push(rowData as T);
    }
    return out;
}
export function cammelCase(text: string, startCapitalized: boolean = false) {
    text = text.replaceAll('/', 'Slash').replaceAll('.', 'Dot');
    if(text.length == 0){
        return '';
    }
    let toUpper: boolean = false;
    let out = startCapitalized ? text[0].toUpperCase() : text[0].toLowerCase();

    for (let i = 1; i < text.length; i++) {
        if (toUpper) {
            out += text[i].toUpperCase();
            toUpper = false;
        } else if (text[i] == ' ') {
            toUpper = true;
        } else {
            out += text[i]
        }
    }
    return out;
}
export class Averager {
    maxInd: number = 0;
    arr: number[];
    index: number = 0;
    constructor(size: number) {
        this.arr = new Array<number>(size);
    }
    add(val: number) {
        this.arr[this.index] = val;
        this.index++;
        if (this.index >= this.arr.length) {
            this.index = 0;
        }
        if (this.maxInd < this.arr.length - 1) {
            this.maxInd++;
        }
    }
    private total: number;
    private addHelper(val: number, index: number) {
        if (index <= this.maxInd) {
            this.total += val;
        }
    }
    get val() {
        this.total = 0;
        this.arr.forEach(this.addHelper.bind(this));
        return this.total / this.maxInd;
    }
}