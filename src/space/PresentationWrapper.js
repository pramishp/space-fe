import {useContext, useEffect, useState} from "react"
import {useLocation, useParams, matchPath} from "react-router-dom"
import AuthContext from "./Workspace/Context/AuthContext"
import Workspace from "./Workspace/Workspace"
import Presentation from "./Presentation";
import {usePresentationData} from "./hooks/usePresentationData";
import {Canvas} from "@react-three/fiber";
import Controls from "./Editor/Controls";
import * as React from "react";
import {ARButton, VRButton, XR, XRButton} from "@react-three/xr";
import {Box} from "@react-three/drei";

export const PRESENTATION_TYPES = {
    "2D": "2d",
    "2D_INTERACTIVE": "2d_interactive",
    "VR": "vr",
    "AR": "ar"
}

// go to this link after the fetch of workspaceId from the presentation link is completed
const PresentationWrapper = (props) => {
    let {workspaceId, type} = useParams();
    // const {user, authTokens} = useContext(AuthContext)


    workspaceId = props.workspaceId;
    type = props.type;


    const {
        loading,
        getData,
        room,
        doc
    } = usePresentationData(workspaceId);
    if (!workspaceId || loading) {
        return <div>Loading...</div>
    }
    const presentationData = getData();

    const MainPresentation = <Presentation data={presentationData}/>

    const OrbitControls = <Controls makeDefault/>
    return <div style={{height: window.innerHeight}}>
        {type === PRESENTATION_TYPES.VR? <VRButton/>: null}
        {type === PRESENTATION_TYPES.AR? <ARButton/>: null}
        <Canvas>
            <XR referenceSpace="local-floor">
                {MainPresentation}
            </XR>
            {type !== PRESENTATION_TYPES["2D"] ? OrbitControls : null}
        </Canvas>
    </div>
}

PresentationWrapper.props = {
    type: PRESENTATION_TYPES["2D_INTERACTIVE"],
    workspaceId: null
}
export default PresentationWrapper
