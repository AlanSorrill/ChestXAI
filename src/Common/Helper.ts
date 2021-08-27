

declare global {

    interface String {
        replaceAll(a: string, b: string): string;
    }

   

}

export type optFunc<T> = T | (() => T);
export type optTransform<I,O> = O | ((input: I) => O);



String.prototype.replaceAll = function (a: string, b: string) {
    return this.split(a).join(b);
};
export function isNumber(input: number | string) {
    return !isNaN(input as any)
}
export function lerp(start: number, end: number, alpha: number){
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