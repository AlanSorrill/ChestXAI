import { optFunc } from "./CommonImports";

export class Animator<n> {
    time: number = 0;
    timeScale: number = 0.001;
    fps: number;
    values: [number, number][];
    update(deltaMs: number) {
        this.time += deltaMs * this.timeScale;
    }
    get timeBetweenFrames(): number {
        return 1 / this.fps;
    }
    get timeBetweenLoops(): number {
        return this.timeBetweenFrames * this.totalFrames;
    }
    get totalFrames() {
        return this.values.length;
    }
    get currentFrameIndex(): number {
        let alpha = (this.time % this.timeBetweenLoops) / this.timeBetweenLoops;
        let currentFrame = Math.round(alpha * (this.totalFrames - 1));
        console.log(currentFrame);
        return currentFrame;
    }
    constructor(values: Array<[number, number]>, fps: number) {
        this.fps = fps;
        this.values = values;

    }
    get value(): number {
        return 0;
    }
}

function Animate(id: string) {
    console.log("first(): factory evaluated");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log("first(): called");
    };
  }
export type InterpEnd = 'A' | 'B';
export interface AnimKey {
    varPath: string
}
export interface InterpMethod<T>{
    mixer: (a: T, b: T, alpha: number)=>T
    curve: (alpha: number)=>number
}
export class InterpManager{
    update(delta: number){

    }
}
export class Interp<T> {
    a: optFunc<T>;
    b: optFunc<T>;
    method: InterpMethod<T>;
    constructor(a: optFunc<T>, b: optFunc<T>, target: optFunc<InterpEnd>, durration: optFunc<number>, method: InterpMethod<T>){
        this.a = a;
        this.b = b;
        this.method = method;
    }
    getValue(){

    }
}


export function interpFunc<T>(): optFunc<number>{

    return null;
}
