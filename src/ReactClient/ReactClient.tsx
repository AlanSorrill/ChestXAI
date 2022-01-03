import { FColorDirectory, UrlManager } from "bristolboard";
import React from "react";
import ReactDOM from "react-dom";
import {App} from "./ChestXAI";
import { UploadPage } from "./Pages/UploadPage";

window.urlManager = new UrlManager();
let fColor = new FColorDirectory();

window.fColor = fColor;
// fColor.createCssHoverClass('diseaseDispBackground', fColor.darkMode[11]);
const domContainer = document.querySelector('#appContainer');
ReactDOM.render(<App />, domContainer);