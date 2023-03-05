import * as React from 'react';

import {useEffect, useMemo, useState} from "react";
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {Text, Box, OrbitControls} from "@react-three/drei";
import {Button} from "./VRUIs/Button";
import {XR} from "@react-three/xr";
import ThreeMeshUI from "three-mesh-ui";
import VRPropsEditor from "./VRPropsEditor";


function ThreeMesh(){

    const [ui, setUI] = useState(null)
    const ref = React.useRef();
    const {scene} = useThree();

    useEffect(()=>{
        const container = new ThreeMeshUI.Block({
            width: 1.2,
            height: 0.7,
            padding: 0.2,
            fontFamily: './fonts/Roboto-msdf.json',
            fontTexture: './fonts/Roboto-msdf.png',
        });
//
        const text = new ThreeMeshUI.Text({
            content: "Some text to be displayed"
        });
        container.add( text );
        setUI(container)
        return ()=>{
            console.log('disposing')
                container.material.dispose()
                container.geometry.dispose()
                scene.remove(container)

        }
    }, [])


    // This is typically done in the render loop :
    useFrame(()=>{
        ThreeMeshUI.update();
    })
    if (!ui){
        return null
    }

    return (<primitive ref={ref} object={ui}/>)
}
export default function TestCanvasUI() {

    return (
        <Canvas style={{width: "100%", height: "100%"}}>
            <XR>
                {/*<Box height={10} width={10}/>*/}
                <ambientLight intensity={0.5}/>
                {/*<Text fontSize={1} outlineWidth={'5%'} outlineColor="#000000" outlineOpacity={1}>*/}
                {/*   Hello World !*/}
                {/*</Text>*/}
                {/*<ThreeMesh/>*/}
                <VRPropsEditor/>
                <OrbitControls/>
            </XR>
        </Canvas>
    )
}