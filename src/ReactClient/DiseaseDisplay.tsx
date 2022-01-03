import React from "react";
import { DiseaseDefinition } from "../Common/SharedDataDefs";
export interface DiseaseDisplay_State {
    
}
export interface DiseaseDisplay_Props {
    disease: DiseaseDefinition,
    confidence: number
}
export class DiseaseDisplay extends React.Component<DiseaseDisplay_Props> {
    constructor(props: DiseaseDisplay_Props) {
        super(props);
    }
    get textHeight() {
        return `20px`
    }
    get padding() {
        return '10px'
    }
    render() {
        return <div className='hover-darkBackground11' style={{
            width: '100%',
            backgroundColor: fColor.darkMode[6].toHexString(),
            paddingTop: this.padding,
            paddingBottom: this.padding,
            display: "flex", 
            alignItems: "stretch",
            cursor: 'pointer'
        }}>
            
            <div id='progContainer' style={{
                height: this.textHeight,
                width: '60%',
                // flexGrow: 6, 
                marginRight: this.padding,
                marginLeft: this.padding, 
                backgroundColor: fColor.darkMode[4].toHexString()
            }}>
                <div style={{
                    height: '100%',
                    width: `${this.props.confidence * 100}%`,
                    backgroundColor: fColor.green.base.toHexString()
                }}></div>
            </div>
            <div style={{
                fontSize: this.textHeight,
                flexGrow: 1,
                textAlign: 'right',
                marginRight: this.padding
            }}>{this.props.disease.displayName}</div>
        </div>
    }
} 