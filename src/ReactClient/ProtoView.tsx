import React from "react";
import { DiseaseDefinition, PrototypeData } from "../Common/SharedDataDefs";
import { HeatMapper_Manager } from "./HeatMapper/HeatMapper_Manager";


export interface ProtoView_Props {
    // ogSrc: string
    // protoData: PrototypeData
    disease: string
    originalImage: string
    
    description: string
    // style: CSS.Properties

}
export interface ProtoView_State {
    showHeatmap: boolean,
    progress: number
}
export class ProtoView extends React.Component<ProtoView_Props, ProtoView_State> {
    constructor(props: ProtoView_Props) {
        super(props);
        this.state = { showHeatmap: false, progress: 0 }
        let ths = this;
        // this.state = { selectedIndex: -1 }
        // this.heatMapper = new HeatMapper(props.protoData.originalImage, 20);
        // props.diseases.forEach((disease: DiseaseDefinition) => {
        let result = HeatMapper_Manager.singlton.getResult(props.originalImage, props.disease);
        if (result == null) {
            HeatMapper_Manager.singlton.getHeatMap(props.originalImage, props.disease, {
                onProgress: function (progress: number): void {
                    // console.log(`Manager recieved progress ${props.originalImage} ${ths.props.disease} ${progress}`)
                    ths.setState({
                        'progress': progress * 100
                    });
                },
                onComplete: function (dataUrl: string): void {

                },
                onFail: function (err: Error): void {

                }
            });
        } else {
            this.state = { showHeatmap: false, progress: 100 }
        }
        // })
    }
    // heatMapper: HeatMapper
    getSrc() {
        if (!this.state.showHeatmap) {
            return `${this.props.originalImage}?res=30`
        } else {
            return HeatMapper_Manager.singlton.getResult(this.props.originalImage, this.props.disease)
        }
    }
    hasHeatmap() {
        return HeatMapper_Manager.singlton.getResult(this.props.originalImage, this.props.disease) != null;
    }
    componentWillUnmount(): void {
        HeatMapper_Manager.singlton.cancel(this.props.originalImage);
    }
    render() {
        return <div

            style={{
                backgroundColor: fColor.black.toHexString(),
                overflow: 'hidden',
                position: 'relative'
            }}>
            <img style={{ objectFit: 'cover', maxWidth: '100%', height: '100%' }} src={this.getSrc()} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: 'flex', backgroundColor: fColor.darkMode[0].toHexString(), }}>
                <div className="unselectable" style={{
                    padding: 10,

                    zIndex: 1
                }}>{this.props.description}</div>
                <div
                    onClick={() => {
                        this.setState({
                            showHeatmap: !this.state.showHeatmap
                        })
                    }}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        cursor: this.hasHeatmap() ? 'pointer' : 'default',
                        width: `${this.state.progress}%`,
                        backgroundColor: fColor.darkMode[8].toHexString()
                    }}></div>
            </div>
        </div>
    }
}