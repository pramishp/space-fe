import * as React from "react";
import * as THREE from 'three';
import {useState, useEffect, useRef, createRef, useCallback, useMemo} from "react";

import {Canvas, useFrame} from "@react-three/fiber";


function Test() {
    const vertices = useMemo(
        () => new Float32Array([-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0]),
        []
    )
    const update = useCallback(self => {
        self.__r3f.needsUpdate = true
        self.__r3f.parent.computeBoundingSphere()
    }, [])

    return (
        <mesh>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    attachObject={['attributes', 'position']}
                    array={vertices}
                    count={vertices.length / 3}
                    itemSize={3}
                    onUpdate={update}
                />
            </bufferGeometry>
            <meshBasicMaterial attach="material" color="hotpink" />
        </mesh>
    )
}

function ThisSceneWorks(props) {
    const {positions} = props;
    const geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array( [
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,

        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0, -1.0,  1.0
    ] );

// itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    return (
        <points>
            <primitive attach="geometry" object={geometry}/>
            <pointsMaterial attach="material" color="blue" size={0.1}/>
        </points>
    );
}


function ThisSceneDoesNotWork(props) {
    const { positions } = props;
    const vertices = new Float32Array( [
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,

        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0, -1.0,  1.0
    ] );

    return (
        <points>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    args = {[vertices, 3]}
                    attach={"attributes-position"}
                    array={vertices}
                    count={vertices.length/3}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial attach="material" color="red" size={0.1} />
        </points>
    );
}


function App() {
    const positions = new Float32Array([1, 1, 1]);
    const colors = new Float32Array([1, 0, 1, 0.5]);
    const sizes = new Float32Array([5]);

    return (
        <Canvas style={{ width: "100%", height: "100%" }}>
            <camera position={[0, 0, 100]} />
            <ambientLight intensity={0.5} />

            <points>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        attach="attributes-color"
                        array={colors}
                        count={1}
                        itemSize={4}
                    />

                    <bufferAttribute
                        attach="attributes-position"
                        array={positions}
                        count={1}
                        itemSize={3}
                    />

                    <bufferAttribute
                        attach="attributes-size"
                        array={sizes}
                        count={sizes.length}
                        itemSize={1}
                    />
                </bufferGeometry>
                <pointsMaterial vertexColors sizeAttenuation />
            </points>
        </Canvas>
    );
}


export default function TestCanvas({initData, app, isXR, slideData}) {
    const n = 10;
    const positions = new Float32Array(n * 3);

    for (let index = 0; index < positions.length; index++) {
        positions[index] = Math.random();
    }
    // return <App/>
    return (
        <Canvas>
            <ThisSceneDoesNotWork/>

        </Canvas>
    )
}
