import React from "react";
import { DiseaseDefinition, PrototypeData, UploadResponse } from "../../Common/SharedDataDefs";
import { DiseaseDisplay } from "../DiseaseDisplay";

import CSS from 'csstype';
import { SimilarityView } from "../SimilarityView";
import { ProtoView } from "../ProtoView";
import { HeatMapper_Manager } from "../HeatMapper/HeatMapper_Manager";

export interface GallaryPage_Props {
    uploadResponse: UploadResponse
}
export interface GallaryPage_State {
    selectedIndex: number
    [key: string]: number
}
export class GallaryPage extends React.Component<GallaryPage_Props, GallaryPage_State> {
    // heatMapper: any;
    // heatMapper: HeatMapper;
    get ogSrc() {
        return `./userContent/${this.props.uploadResponse.fileName}`
    }
    constructor(props: GallaryPage_Props) {
        super(props);
        this.state = { selectedIndex: -1 }
        let ths = this;
        let ogSrc = this.ogSrc;

        // this.heatMapper = new HeatMapper();
        props.uploadResponse.diagnosis.forEach((diagnosis: [disease: DiseaseDefinition, confidence: number]) => {
            console.log(`Preloading ${diagnosis[0].displayName} on ${ogSrc}`)
            let bitString = diagnosis[0].bitStringID
            let lastJump = 0;
            HeatMapper_Manager.singlton.getHeatMap(ogSrc, diagnosis[0].bitStringID, {
                onProgress: function (progress: number): void {
                    ths.setState({ [bitString]: progress })
                },
                onComplete: function (dataUrl: string): void {

                },
                onFail: function (err: Error): void {

                }
            })
            // this.heatMapper.preloadHeatmap(diagnosis[0].bitStringID, 10, (disease: string, progress: number) => {
            //     if (typeof ths.state[disease] != 'number' || (progress * 100) - ths.state[disease] > 1 || progress >= 1) {
            //         ths.setState({
            //             [disease]: progress * 100
            //         })
            //         if (progress - lastJump > 0.1) {
            //             lastJump = progress;
            //             this.heatMapper.jumpImage(diagnosis[0].bitStringID);
            //         }
            //         this.heatMapper.jumpImage(diagnosis[0].bitStringID);

            //     } else {

            //     }
            // })
        })
        // props.uploadResponse.diagnosis
        // let heatMappers: { [imgUrl: string]: HeatMapper } = {};
        // let ths = this;
        // props.uploadResponse.similarity.forEach((value: [ogUrl: string, similarPercentage: number, diseases: DiseaseDefinition[]]) => {
        //     if (!heatMappers[value[0]]) {
        //         heatMappers[value[0]] = new HeatMapper(value[0]);
        //         value[2].forEach((disease: DiseaseDefinition) => {
        //             heatMappers[value[0]].preloadHeatmap(disease.bitStringID, 25, (progress: number) => {
        //                 ths.setState((prevState: Readonly<GallaryPage_State>) => {
        //                     let out = { ...prevState };
        //                     out[value[0]]
        //                 })
        //             })
        //         });
        //     }

        // })
        // props.uploadResponse.diagnosis.forEach((value: [DiseaseDefinition, number]) => {

        // })
    }
    get textHeight() {
        return 20
    }
    get padding() {
        return 10
    }
    getSrc() {
        if (this.state.selectedIndex == -1) {
            return this.props.uploadResponse?.imageBlob == null ? `./userContent/${this.props.uploadResponse.fileName}` : this.props.uploadResponse.imageBlob
        } else {
            return HeatMapper_Manager.singlton.getResult(this.ogSrc, this.props.uploadResponse.diagnosis[this.state.selectedIndex][0].bitStringID)
            // return this.heatMapper.heatmapImages.get(this.props.uploadResponse.diagnosis[this.state.selectedIndex][0].bitStringID);
        }
    }
    get selectedBitStringId() {
        return this.props.uploadResponse.diagnosis[this.state.selectedIndex][0].bitStringID
    }
    get selectedPrototype() {
        return this.state.selectedIndex == -1 ? null : this.props.uploadResponse.prototypes[this.selectedBitStringId]
    }
    render() {

        return <div style={{
            position: 'absolute',
            left: 0, right: 0, top: 0, bottom: 0,

        }}>
            <div style={{position: 'absolute', left: 40, top: 10, fontSize: 20}}>Your Result</div>
            <div style={{position: 'absolute', right: 40, top: 10, fontSize: 20}}>{this.state.selectedIndex == -1 ? 'Similar Results' : `Prototypical ${this.props.uploadResponse.diagnosis[this.state.selectedIndex][0].displayName}`}</div>
            <div style={{
                position: 'absolute',
                left: 0, right: 0, top: 0, bottom: 0,
                display: "flex",
                padding: 40
            }}>
                <div style={{ flex: 5, marginRight: '40px', display: 'flex', flexDirection: 'column' }}>
                    {/* <div style={{ backgroundColor: 'purple', flex: 3 }}> */}
                    <img style={{
                        width: '100%',
                        height: 'auto'
                    }} src={this.getSrc()}></img>
                    {/* </div> */}
                    <div style={{ flexGrow: 1, overflowY: 'scroll' }}>
                        {this.props.uploadResponse.diagnosis.map((value, index: number) => {
                            //return <DiseaseDisplay key={value[0].bitStringID} disease={value[0]} confidence={value[1]} />
                            let confidence = value[1];
                            let disease = value[0]
                            return <div

                                key={value[0].bitStringID}
                                style={{
                                    width: '100%',
                                    backgroundColor: fColor.darkMode[0].toHexString(),
                                    paddingTop: this.padding,
                                    paddingBottom: this.padding,
                                    display: "flex",
                                    alignItems: "stretch",
                                    position: 'relative',
                                    flexGrow: index == -1 ? (1) : (index == this.state.selectedIndex ? 1 : 0.0001),
                                    transition: 'flex-grow 1000ms linear'
                                }}>
                                <div
                                    className={this.hasHeatmap(index) ? 'hover-darkBackground11' : ''}
                                    style={{
                                        cursor: ((this.hasHeatmap(index)) ? 'pointer' : 'default'),
                                        backgroundColor: fColor.darkMode[(index == this.state.selectedIndex) ? 11 : 8].toHexString(),
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: `${this.state[value[0].bitStringID] * 100}%`
                                    }}
                                    onClick={() => {
                                        if (this.state.selectedIndex == index) {
                                            this.setState({ selectedIndex: -1 })
                                        } else {
                                            this.setState({ selectedIndex: index })
                                        }
                                    }}
                                ></div>
                                <div id='progContainer' className="unselectable" style={{
                                    height: this.textHeight,
                                    width: '60%',
                                    zIndex: 1,
                                    // flexGrow: 6, 
                                    marginRight: this.padding,
                                    marginLeft: this.padding,
                                    backgroundColor: fColor.darkMode[4].toHexString(),
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${confidence * 100}%`,
                                        backgroundColor: fColor.green.base.toHexString()
                                    }}></div>
                                    <div style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                        paddingRight: 10
                                    }}>{`${(confidence * 100).toFixed(1)}%`}</div>
                                </div>
                                <div className="unselectable" style={{
                                    fontSize: this.textHeight,
                                    flexGrow: 1,
                                    zIndex: 1,
                                    textAlign: 'right',
                                    marginRight: this.padding
                                }}>{disease.displayName}</div>
                            </div>
                        })}
                    </div>
                </div>

                <div style={{ flex: 6, display: 'grid', gridGap: 4, gridTemplateColumns: '1fr 1fr 1fr', gridAutoRows: '33.333%', overflowY: 'scroll' }}>
                    {(this.state.selectedIndex == -1) ?
                        this.props.uploadResponse.similarity.map((value: [otherImageUrl: string, matchConfidence: number, diseases: [certian: DiseaseDefinition[], uncertian: DiseaseDefinition[]]], index: number) => (
                            <SimilarityView key={index + "-" + value[0]} ogSrc={`${value[0]}`} diseases={value[2][value[2][0].length > 0 ? 1 : 0]} similarity={value[1]} isCertian={value[2][0].length > 0} ></SimilarityView>
                        )) :
                        (this.props.uploadResponse.prototypes[this.selectedBitStringId].map((protoData: PrototypeData, index: number) => (<ProtoView key={protoData.originalImage + '~' + protoData.disease} disease={protoData.disease} originalImage={protoData.originalImage} description={protoData.description} ></ProtoView>))
                        )}

                </div>


            </div >
        </div>
    }
    hasHeatmap(index: number) {
        return HeatMapper_Manager.singlton.getResult(this.ogSrc, this.props.uploadResponse.diagnosis[index][0].bitStringID) != null;

    }
}




