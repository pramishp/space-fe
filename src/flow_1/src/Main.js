import React, {useEffect, useRef, useState} from 'react'
import {Canvas, useThree} from '@react-three/fiber'
import {Box, Environment, Grid, Html, OrbitControls, RoundedBox, Text} from '@react-three/drei'
import {useControls} from 'leva'
import {Controllers, Interactive, RayGrab, XR} from "@react-three/xr";
import Button from "../components/Button";
import PropTypes from "prop-types";
import SystemInterface from "../containers/SystemInterface";
import {TestComponent} from "../components/TestComponent";


export default function App() {
    const {gridSize, ...gridConfig} = useControls({
        gridSize: [10.5, 10.5],
        cellSize: {value: 0.6, min: 0, max: 10, step: 0.1},
        cellThickness: {value: 1, min: 0, max: 5, step: 0.1},
        cellColor: '#6f6f6f',
        sectionSize: {value: 3.3, min: 0, max: 10, step: 0.1},
        sectionThickness: {value: 1.5, min: 0, max: 5, step: 0.1},
        sectionColor: '#919191',
        fadeDistance: {value: 25, min: 0, max: 100, step: 1},
        fadeStrength: {value: 1, min: 0, max: 1, step: 0.1},
        followCamera: false,
        infiniteGrid: true
    })


    return (
        <Canvas style={{backgroundColor: '#2c2c2c', width: window.innerWidth, height: window.innerHeight}} shadows
                camera={{position: [0, 12, 0], fov: 25}}>
            <XR>
                <SystemInterface>
                    <TestComponent
                        boxColor={0x04defd}
                        stateColor={0xa3fe1f}
                        position={[-1.5, 0.5, -3]}
                    />
                </SystemInterface>
                <Grid position={[0, -0.01, 0]} args={gridSize} {...gridConfig} />
                <Controllers/>
            </XR>
            <OrbitControls makeDefault/>
            <Environment preset="city"/>
        </Canvas>
    )
}








