import { logger } from "bristolboard";
import React, { useRef } from "react";
import { UploadResponse } from "../../Common/SharedDataDefs";

let log = logger.local('UploadPage');

export interface UploadPage_Props {
    onComplete: (resp: UploadResponse)=>void
 }
export interface UploadPage_State {
    progress?: number
}
export class UploadPage extends React.Component<UploadPage_Props, UploadPage_State> {
    inputReference: React.MutableRefObject<HTMLInputElement>
    constructor(props: UploadPage_Props) {
        super(props);
        this.inputReference = React.createRef();
        this.onChange = this.onChange.bind(this);
        this.state = {
            progress: 0
        }
    }
    uploadFile(file: File) {
        console.log('Uploading file');
        console.log(file);


        console.log('Uploading file ', file)
        let formData = new FormData();
        formData.append('file', file);
        var ajax = new XMLHttpRequest();
        let ths = this;

        ajax.upload.onprogress = function (event: ProgressEvent<XMLHttpRequestEventTarget>) {
            let prog = (event.loaded / event.total) * 100;
            ths.setState({ progress: prog })
            console.log(prog);
        }
        ajax.upload.addEventListener("load", function (event: ProgressEvent<XMLHttpRequestEventTarget>) {
            //complete
            log.info('Upload complete', ajax.response);
        }, false);
        ajax.upload.addEventListener("error", function (event: ProgressEvent<XMLHttpRequestEventTarget>) {

            log.error('Upload error', event);
        }, false);
        ajax.addEventListener("abort", function (event: ProgressEvent<XMLHttpRequestEventTarget>) {
            log.error('Upload abort', event)
        }, false);

        ajax.addEventListener('readystatechange', async function (event: ProgressEvent<XMLHttpRequestEventTarget>) {
            if (ajax.readyState == XMLHttpRequest.DONE) {
                let resp: UploadResponse = JSON.parse(ajax.responseText)
                log.info(`Upload responded `, resp);
                let blob = URL.createObjectURL(new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type }))
                resp.imageBlob = blob;
                urlManager.set('upload', resp.fileName, false);
                ths.props.onComplete(resp);
                // let gallary: UIP_Gallary_V0 = mainBristol.rootElement.showGallary(resp);
                // gallary.setUploadResponse(resp);

            } else {
                log.info('Ready state changed!', event);
            }

        })
        ajax.open("POST", "/upload");

        ajax.send(formData);

    }

    onChange() {
        this.uploadFile(this.inputReference.current.files[0])
    }
    render() {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

            {/* <UploadButton ref={this.ref} onFilePicked={function (file: File): void {

            }} /> */}
            <input id="uploadInput" ref={this.inputReference} style={{ display: 'none' }} type="file" accept=".png, .jpg, .jpeg" onChange={this.onChange} />
            <div style={{ cursor: 'pointer', backgroundColor: 'red',  color: 'white', fontSize: '20px', padding: '10px', position: 'relative' }} onClick={() => this.inputReference.current.click()}>

                Upload
                <div id='progressBarContainer' style={{backgroundColor: 'blue', position: "absolute", bottom: this.state.progress > 0 ? '-10px' : 0, left: '0px', right: '0px', height: this.state.progress > 0 ? '10px' : 0}}>
                    <div id='prog' style={{height: '100%', width: `${this.state.progress}%`, backgroundColor: 'green'}}></div>
                </div>
            </div>

        </div>
    }
}