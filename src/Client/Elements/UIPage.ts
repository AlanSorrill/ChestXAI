import { UIElement } from "../clientImports";
export enum ChestXAIPage {
    upload = 'upload',
    about = 'about',
    gallary = 'gallary'
}
export abstract class UIPage extends UIElement{
    abstract get pageName(): ChestXAIPage
    abstract get versionNumber(): number
}