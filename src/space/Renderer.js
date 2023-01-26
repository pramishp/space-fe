import {useState, useEffect, useRef, createRef} from "react";

import * as THREE from "three";
import {Canvas} from "@react-three/fiber";
import {TransformControls} from '@react-three/drei'

import {toJSX} from "../common/loader";

export default function Renderer({data}) {
    const {jsxs, refs} = toJSX(data);

    const transformRefs = {};
    Object.keys(refs).forEach(item => {
        transformRefs[item] = createRef();
    })
    const onPositionChange = (uuid) => {
        const transformRef = transformRefs[uuid];
        const meshRef = refs[uuid];

        if (meshRef.current && transformRef.current){
            meshRef.current.position.x = transformRef.current.worldPosition.x;
            meshRef.current.position.y = transformRef.current.worldPosition.y;
            meshRef.current.position.z = transformRef.current.worldPosition.z;
        }

    }


    return (
        <div id="canvas-container" style={{height: window.innerHeight}}>
            <Canvas>
                {Object.entries(jsxs).map(([uuid, item]) => {
                    return (
                        <>
                            <TransformControls key={`transform-${uuid}`} ref={transformRefs[uuid]}
                                               onChange={() => onPositionChange(uuid)}/>
                            {item}
                        </>
                    )
                })}
            </Canvas>

        </div>
    )
}
