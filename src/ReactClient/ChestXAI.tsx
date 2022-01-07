import React from "react";
import { UploadPage } from "./Pages/UploadPage";
import { GallaryPage } from "./Pages/GallaryPage";
import { render } from "react-dom";
import { UploadResponse } from "../Common/SharedDataDefs";
import { logger, LogLevel } from "bristolboard";

let log = logger.local('App').allowBelowLvl(LogLevel.naughty);
export interface App_Props {

}
export interface App_State {
  imageName?: string
  uploadResponse?: UploadResponse
}

export class App extends React.Component<App_Props, App_State> {
  constructor(props: App_Props) {
    super(props);
    this.state = {
      imageName: urlManager.get('upload', null),
      uploadResponse: null
    }
    if(this.state.imageName != null){
      this.pull(this.state.imageName);
    }
  }
  pull(imageName: string) {
    let ths = this;
    fetch(`${window.location.origin}/reuse?upload=${imageName}`).then(async (httpResp: Response) => {
      console.log(`Pulling ${imageName}`)
      let resp: UploadResponse = await httpResp.json();
      resp.similarity.forEach((value, index)=>{
        if(value[2].length as any == 0){
          resp.similarity[index][2] = [[],[]]
        }
      })
      log.info(`Upload responded `, resp);
      window.uploadResponse = resp;
      ths.setState({
        uploadResponse: resp
      })
      // let blob = await UIP_Upload_V0.fileToBlob(file);
      // resp.imageBlob = blob;
      // urlManager.set('upload',resp.fileName,false);
      // let gallary: UIP_Gallary_V0 = ths.showGallary(resp);
      // gallary.setUploadResponse(resp);
    }).catch()
  }
  render() {
    let ths = this;
    if (this.state.uploadResponse != null) {
      return <GallaryPage uploadResponse={this.state.uploadResponse}></GallaryPage>
    } else if (this.state.imageName != null) {
      return <div>Loading</div>
    } else {
      return <UploadPage onComplete={(resp: UploadResponse)=>{
        ths.setState({uploadResponse: resp});
      }}>Test</UploadPage>

    }
  }
}

export default App;