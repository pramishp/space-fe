import {useState, useEffect, useRef} from "react";

import * as THREE from "three";
import {Canvas} from "@react-three/fiber";
import {toJSX, sampleJson} from "../common/loader";

function Scene() {
    const {jsxs, refs} = toJSX(sampleJson);

    return (
        <div id="canvas-container">
            <Canvas>
                {jsxs.map(item=>item)}
            </Canvas>
            
        </div>
    )
}

export default function Main() {
    return (
        <div style={{width: "100%", margin: "0 auto"}}>
            <Scene/>
        </div>
    );
}
