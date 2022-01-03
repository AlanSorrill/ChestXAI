import React from "react";
import CSS from "csstype"
export interface XRayComponent_Props {
    ogUrl: string,
    diseases
    style: CSS.Properties
}
export interface XRayComponent_State {

}
export class XRayComponent extends React.Component<XRayComponent_Props, XRayComponent_State>{
    constructor(props: XRayComponent_Props) {
        super(props);
    }

    render() {
        return <img src={this.props.ogUrl} style={this.props.style}>

        </img>
    }
}