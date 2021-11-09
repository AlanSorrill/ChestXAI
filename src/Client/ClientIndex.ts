import { LogLevel } from "bristolboard";
import { UIElement, UI_ChestXAI, FHTML, BristolBoard, UIFrame, ClientSession, UrlManager, DiseaseManager, logger } from "./ClientImports";

let log = logger.local('ClientIndex').allowBelowLvl(LogLevel.naughty)

let body: FHTML<HTMLBodyElement> = new FHTML<HTMLBodyElement>("body");
let containerDiv: FHTML<HTMLDivElement> = body.createChildDiv('container')
containerDiv.setCss([
    ["width", "100vw"],
    ['height', '100vh'],
    ['position', 'absolute'],
    ['left', '0px'],
    ['top', '0px']
]);






window.urlManager = new UrlManager();

window.session = new ClientSession(window.urlManager.get('seshId', null));
window.mainBristol = new BristolBoard(containerDiv.element, async (brist: BristolBoard<any>) => {
    let rootElement = new UI_ChestXAI(brist);

    try {
        
        DiseaseManager.fromJson(await (await fetch('./diseaseDefs')).json());
    } catch (err) {
        log.error(`Failed to get disease definitions because`, err)
    }
    urlManager.setListener(rootElement);
    rootElement.showUpload();
    return rootElement;
});

mainBristol.debuggerFlags.debugUIFrame = urlManager.get('debugUIFrames', false);

