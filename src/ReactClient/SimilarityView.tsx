import React from "react";
import { DiseaseDefinition } from "../Common/SharedDataDefs";
import { HeatMapper_Manager } from "./HeatMapper/HeatMapper_Manager";

export interface SimilarityView_Props {
    ogSrc: string
    diseases: DiseaseDefinition[]
    isCertian: boolean
    similarity: number
    // style: CSS.Properties

}
export interface SimilarityView_State {
    selectedIndex: number
    [key: string]: number
}
export class SimilarityView extends React.Component<SimilarityView_Props, SimilarityView_State> {
    constructor(props: SimilarityView_Props) {
        super(props);
        let ths = this;
        let stateObj = { selectedIndex: -1 }
        this.state = stateObj;


        // this.heatMapperT = new HeatMapperThreaded(props.ogSrc);

        props.diseases.forEach((disease: DiseaseDefinition) => {
            // this.heatMapperT.buildHeatmap(disease.bitStringID);
            let result = HeatMapper_Manager.singlton.getResult(props.ogSrc, disease.bitStringID);
            if (result == null) {
                HeatMapper_Manager.singlton.getHeatMap(props.ogSrc, disease.bitStringID, {
                    onProgress: function (progress: number): void {
                        // console.log(`Manager recieved progress ${ths.props.ogSrc} ${ths.props.diseases} ${progress}`)
                        ths.setState({
                            [disease.bitStringID]: progress * 100
                        })
                    },
                    onComplete: function (dataUrl: string): void {
                        // throw new Error("Function not implemented.");
                    },
                    onFail: function (err: Error): void {
                        // throw new Error("Function not implemented.");
                    }
                })
            } else {
                stateObj[disease.bitStringID] = 100;
            }

            // this.heatMapper.preloadHeatmap(disease.bitStringID, 10, (disease: string, progress: number) => {
            //     if (typeof ths.state[disease] != 'number' || (progress * 100) - ths.state[disease] > 1 || progress >= 1) {
            //         ths.setState({
            //             [disease]: progress * 100
            //         })
            //     } else {

            //     }
            // })
        })
        this.state = stateObj;
    }

    componentWillUnmount(): void {
        HeatMapper_Manager.singlton.cancel(this.props.ogSrc);
    }
    //heatMapper: HeatMapper
    //  heatMapperT: HeatMapperThreaded = null

    getSrc() {
        if (this.state.selectedIndex == -1) {
            return `${this.props.ogSrc}?res=30`
        } else {
            return HeatMapper_Manager.singlton.getResult(this.props.ogSrc, this.props.diseases[this.state.selectedIndex].bitStringID)
            // return this.heatMapperT.getHeatmapUrl(this.props.diseases[this.state.selectedIndex].bitStringID)
            // return this.heatMapperT.heatmapImages.get(this.props.diseases[this.state.selectedIndex].bitStringID);
        }
    }
    hasHeatmap(index: number) {
        return HeatMapper_Manager.singlton.getResult(this.props.ogSrc, this.props.diseases[index].bitStringID) != null;
    }
    render() {
        return <div

            style={{
                backgroundColor: fColor.black.toHexString(),
                overflow: 'hidden',
                position: 'relative'
            }}>
            <img style={{ objectFit: 'cover', maxWidth: '100%', height: '100%' }} src={this.getSrc()} />
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    padding: 2,
                    backgroundColor: fColor.darkMode[10].toHexString()
                }}>{
                    `${(this.props.similarity * 100).toFixed(1)}%`
                }</div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: 'flex' }}>
                {this.props.diseases.map((disease: DiseaseDefinition, index: number) => (
                    <div
                        key={disease.bitStringID}
                        style={{
                            backgroundColor: fColor.darkMode[0].toHexString(),
                            textAlign: 'center',
                            position: 'relative',
                            flexGrow: 1
                        }}>

                        <div className={this.hasHeatmap(index) ? 'hover-darkBackground11' : ''} style={{
                            cursor: (this.hasHeatmap(index) ? 'pointer' : 'default'),
                            backgroundColor: this.props.isCertian ? fColor.darkMode[(index == this.state.selectedIndex) ? 11 : 8].toHexString() : fColor.amber.darken3.toHexString(),
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