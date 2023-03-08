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
    let [rerender, setRerender] = useState(false);
    let [gl, setGl] = useState(null);
    // const {user, authTokens} = useContext(AuthContext)

    if (!workspaceId){
        workspaceId = props.workspaceId;
        type = props.type;
    }

    // console.log('presentation wrapper', workspaceId, type)
    const {
        loading,
        getData,
        room,
        doc
    } = usePresentationData(workspaceId);

    // useEffect(() => {
    //     const handleContextLost = (event) => {
    //         // rerender component
    //         console.log('context lost')
    //         setRerender(!rerender)
    //     };
    //     console.log('gl',gl)
    //     if (gl){
    //         gl.domElement.addEventListener('webglcontextlost', handleContextLost);
    //     }
    //     return () => {
    //         if (gl){
    //             gl.domElement.removeEventListener('webglcontextlost', handleContextLost);
    //         }
    //     };
    // }, [gl]);

    if (!workspaceId || loading) {
        return <div>Loading...</div>
    }
    const presentationData = getData();

    const MainPresentation = <Presentation data={presentationData}/>

    const OrbitControls = <Controls makeDefault/>
    return <div style={{height: window.innerHeight}}>
        {type === PRESENTATION_TYPES.VR? <VRButton/>: null}
        {type === PRESENTATION_TYPES.AR? <ARButton/>: null}
        <Canvas onCreated={({ gl }) => {
            setGl(gl)
        }} >
            <XR referenceSpace="local-floor">
                {MainPresentation}
            </XR>
            {type !== PRESENTATION_TYPES["2D"] ? OrbitControls : null}
        </Canvas>
    </div>
}

PresentationWrapper.props = {
    type: PRESENTATION_TYPES["2D_INTERACTIVE"],
    workspaceId: null,
    fromNavigator: true
}
export default PresentationWrapper
