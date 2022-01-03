import React from "react";
import { DiseaseDefinition, UploadResponse } from "../../Common/SharedDataDefs";
import { DiseaseDisplay } from "../DiseaseDisplay";
import { HeatMapper } from "../XRayManager";

export interface GallaryPage_Props {
    uploadResponse: UploadResponse
}
export interface GallaryPage_State {
    selectedIndex: number
    [key: string]: number
}
export class GallaryPage extends React.Component<GallaryPage_Props, GallaryPage_State> {
    heatMapper: HeatMapper;
    constructor(props: GallaryPage_Props) {
        super(props);
        this.state = { selectedIndex: -1 }
        let ths = this;
        this.heatMapper = new HeatMapper(`./userContent/${this.props.uploadResponse.fileName}`);
        props.uploadResponse.diagnosis.forEach((diagnosis: [disease: DiseaseDefinition, confidence: number]) => {
            console.log(`Preloading ${diagnosis[0].displayName} on ${ths.heatMapper.ogSrc}`)
            this.heatMapper.preloadHeatmap(diagnosis[0].bitStringID, 10, (disease: string, progress: number) => {
                if (typeof ths.state[disease] != 'number' || (progress * 100) - ths.state[disease] > 1 || progress >= 0.99) {
                    ths.setState({
                        [disease]: progress * 100
                    })
                } else {

                }
            })
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
            return this.heatMapper.heatmapImages.get(this.props.uploadResponse.diagnosis[this.state.selectedIndex][0].bitStringID);
        }
    }
    render() {

        return <div style={{
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

                                position: 'relative'
                            }}>
                            <div
                                className={this.hasHeatmap(index) ? 'hover-darkBackground11' : ''}
                                style={{
                                    cursor: ((this.state[disease.bitStringID] >= 100 && this.hasHeatmap(index)) ? 'pointer' : 'default'),
                                    backgroundColor: fColor.darkMode[(index == this.state.selectedIndex) ? 11 : 8].toHexString(),
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: `${this.state[value[0].bitStringID]}%`
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
                                backgroundColor: fColor.darkMode[4].toHexString()
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${confidence * 100}%`,
                                    backgroundColor: fColor.green.base.toHexString()
                                }}></div>
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
                {this.props.uploadResponse.similarity.map((value: [otherImageUrl: string, matchConfidence: number, diseases: DiseaseDefinition[]], index: number) => (
                    <SimilarityView key={index + "-" + value[0]} ogSrc={`${value[0]}`} diseases={value[2]}></SimilarityView>
                ))}
            </div>
        </div>
    }
    hasHeatmap(index: number) {
        return this.heatMapper.heatmapImages.has(this.props.uploadResponse.diagnosis[index][0].bitStringID)
    }
}

export interface SimilarityView_Props {
    ogSrc: string
    diseases: DiseaseDefinition[]
}
export interface SimilarityView_State {
    selectedIndex: number
    [key: string]: number
}
export class SimilarityView extends React.Component<SimilarityView_Props, SimilarityView_State> {
    constructor(props: SimilarityView_Props) {
        super(props);
        let ths = this;
        this.state = { selectedIndex: -1 }
        this.heatMapper = new HeatMapper(props.ogSrc, 20);
        props.diseases.forEach((disease: DiseaseDefinition) => {
            this.heatMapper.preloadHeatmap(disease.bitStringID, 10, (disease: string, progress: number) => {
                if (typeof ths.state[disease] != 'number' || (progress * 100) - ths.state[disease] > 1 || progress >= 0.99) {
                    ths.setState({
                        [disease]: progress * 100
                    })
                } else {

                }
            })
        })
    }
    heatMapper: HeatMapper
    getSrc() {
        if (this.state.selectedIndex == -1) {
            return `${this.props.ogSrc}?res=30`
        } else {
            return this.heatMapper.heatmapImages.get(this.props.diseases[this.state.selectedIndex].bitStringID);
        }
    }
    hasHeatmap(index: number) {
        return this.heatMapper.heatmapImages.has(this.props.diseases[index].bitStringID);
    }
    render() {
        return <div

            style={{
                backgroundColor: fColor.black.toHexString(),
                overflow: 'hidden',
                position: 'relative'
            }}>
            <img style={{ objectFit: 'cover', maxWidth: '100%', height: '100%' }} src={this.getSrc()} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: 'flex' }}>
                {this.props.diseases.map((disease: DiseaseDefinition, index: number) => (
                    <div
                        key={disease.bitStringID}
                        style={{
                            backgroundColor: fColor.darkMode[0].toHexString(),
                            flexGrow: 1,
                            textAlign: 'center',
                            position: 'relative'
                        }}>

                        <div className={this.hasHeatmap(index) ? 'hover-darkBackground11' : ''} style={{
                            cursor: ((this.state[disease.bitStringID] >= 100 && this.hasHeatmap(index)) ? 'pointer' : 'default'),
                            backgroundColor: fColor.darkMode[(index == this.state.selectedIndex) ? 11 : 8].toHexString(),
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,

                            width: `${(this.state[disease.bitStringID])}%`,
                            zIndex: 0
                        }} onClick={() => {
                            if (index == this.state.selectedIndex) {
                                this.setState({ selectedIndex: -1 })
                            } else {
                                this.setState({ selectedIndex: index });
                            }
                        }}></div>
                        <span className="unselectable" style={{
                            zIndex: 1,
                            position: 'relative'
                        }}>{disease.displayName}</span>

                    </div>
                ))}
            </div>
        </div>
    }
}