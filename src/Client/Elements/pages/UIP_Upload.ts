import { UIPage,ChestXAIPage } from "../../clientImports";



export class UIP_Upload_V0 extends UIPage{
    get versionNumber(): number {
        return 0
    }
    get pageName(): ChestXAIPage {
        return ChestXAIPage.upload
    }

}