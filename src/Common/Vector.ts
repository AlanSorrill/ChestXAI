//this file is imported by Helper.ts at the top, which is in turn imported by commonImports
import { optFunc } from './CommonImports'
import { evalOptionalFunc, getOptFuncTitle } from './Helper';

export class Vector2 {
    private xValue: optFunc<number>
    private yValue: optFunc<number>
    protected nameValue: optFunc<string>
    constructor(x: optFunc<number>, y: optFunc<number>, name: optFunc<string> = null) {
        this.x = x;
        this.y = y;
        this.nameValue = name;
    }

    get name() {
        return evalOptionalFunc(this.nameValue, `(${getOptFuncTitle(this.x)}, ${getOptFuncTitle(this.y)})`);
    }
    toString() {
        return this.name;
    }
    get x(): number {
        return evalOptionalFunc(this.xValue, null);
    }
    get y(): number {
        return evalOptionalFunc(this.yValue, null);
    }
    set x(value: optFunc<number>) {
        this.xValue = value;
    }
    set y(value: optFunc<number>) {
        this.yValue = value;
    }
    static polar(angle: optFunc<number>, distance: optFunc<number>) {
        return new Vector2(() => (evalOptionalFunc(distance) * Math.cos(evalOptionalFunc(angle))), () => (evalOptionalFunc(distance) * Math.sin(evalOptionalFunc(angle))), `polar(angle:${getOptFuncTitle(angle)},distance:${getOptFuncTitle(distance)})`);
    }
    setName(name: optFunc<string>) {
        this.nameValue = name;
        return this;
    }
    add(b: Vector2) {
        return Vector2.add(this, b);
    }
    addFunc(b: Vector2) {
        return Vector2.addFunc(this, b);
    }
    subtract(b: Vector2) {
        return Vector2.subtract(this, b);
    }
    subtractFunc(b: Vector2) {
        return Vector2.subtractFunc(this, b);
    }
    scale(s: number) {
        return Vector2.scale(this, s);
    }
    scaleFunc(b: optFunc<number>) {
        return Vector2.scaleFunc(this, b);
    }
    static add(a: Vector2, b: Vector2) {
        return new Vector2(a.x + b.x, a.y + b.y, () => (`(${a.toString()} + ${b.toString()})`));
    }
    static addFunc(a: Vector2, b: Vector2) {
        return new Vector2(() => (a.x + b.x), () => (a.y + b.y), () => (`(${a.toString()} + ${b.toString()})`));
    }
    static subtract(a: Vector2, b: Vector2) {
        return new Vector2(a.x - b.x, a.y - b.y, () => (`(${a.toString()} - ${b.toString()})`));
    }
    static subtractFunc(a: Vector2, b: Vector2) {
        return new Vector2(() => (a.x - b.x), () => (a.y - b.y), () => (`(${a.toString()} - ${b.toString()})`));
    }
    static divide(a: Vector2, b: Vector2) {
        return new Vector2(a.x / b.x, a.y / b.y, () => (`(${a.toString()} / ${b.toString()})`));
    }
    static divideFunc(a: Vector2, b: Vector2) {
        return new Vector2(() => (a.x / b.x), () => (a.y / b.y), () => (`(${a.toString()} / ${b.toString()})`));
    }
    static multiply(a: Vector2, b: Vector2) {
        return new Vector2(a.x * b.x, a.y * b.y, () => (`(${a.toString()} * ${b.toString()})`));
    }
    static multiplyFunc(a: Vector2, b: Vector2) {
        return new Vector2(() => (a.x * b.x), () => (a.y * b.y), () => (`(${a.toString()} * ${b.toString()})`));
    }
    static scale(a: Vector2, b: number) {
        return new Vector2(a.x * b, a.y * b, () => (`(${a.toString()} * ${b})`));
    }
    static scaleFunc(a: Vector2, b: optFunc<number>) {
        return new Vector2(() => (a.x * evalOptionalFunc(b)), () => (a.y * evalOptionalFunc(b)), () => (`(${a.toString()} * ()=>${evalOptionalFunc(b)})`));
    }
    static rotateFunc(v: Vector2, options: {
        angle: optFunc<number>,
        origin?: Vector2,
        degrees?: boolean
    }) {
        if (typeof options.origin != 'undefined') {
            return this.addFunc(this.rotateFunc(this.subtractFunc(v, options.origin), {
                angle: options.angle,
                degrees: options.degrees
            }), options.origin);
        }
        return new Vector2(() => {
            let theta: number = evalOptionalFunc(options.angle);
            return v.x * Math.cos(theta) - v.y * Math.sin(theta);
        }, () => {
            let theta: number = evalOptionalFunc(options.angle);
            return v.x * Math.sin(theta) + v.y * Math.cos(theta);
        });
    }

}
