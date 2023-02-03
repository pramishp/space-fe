import PropTypes from "prop-types";
import React, {useEffect, useRef, useState} from "react";
import {useFrame, useThree} from "@react-three/fiber";
import Button from "../components/Button";
import {UIStates} from "../constants/constants";
import {TestComponent} from "../components/TestComponent";
import {Controllers, useXR} from "@react-three/xr";
import {useUIStore} from "../utils/UIStore";
import {Grid} from "@react-three/drei";
import {useControls} from "leva";
import styled from "styled-components";

export default function SystemInterface(props) {
    const sceneRef = useRef();

    // const [state, setState] = useState(UIStates.Editor)
    const [showUI, setShowUI] = useState(true)


    const [leftSqueeze, setLeftSqueeze] = useState(false);
    const [rightSqueeze, setRightSqueeze] = useState(false);

    const [activeTransformation, setActiveTransformation] = useState(false);

    const {
        // An array of connected `XRController`
        controllers,
        // Whether the XR device is presenting in an XR session
        isPresenting,
        // Whether hand tracking inputs are active
        isHandTracking,
        // A THREE.Group representing the XR viewer or player
        player,
        // The active `XRSession`
        session,
        // `XRSession` foveation. This can be configured as `foveation` on <XR>. Default is `0`
        foveation,
        // `XRSession` reference-space type. This can be configured as `referenceSpace` on <XR>. Default is `local-floor`
        referenceSpace
    } = useXR()

    const UIStore = useUIStore()
    const {gridSize, ...gridConfig} = useControls({
        gridSize: [10.5, 10.5],
        cellSize: {value: 0.6, min: 0, max: 10, step: 0.1},
        cellThickness: {value: 1, min: 0, max: 5, step: 0.1},
        cellColor: getCellColor(),
        sectionSize: {value: 3.3, min: 0, max: 10, step: 0.1},
        sectionThickness: {value: 1.5, min: 0, max: 5, step: 0.1},
        sectionColor: '#919191',
        fadeDistance: {value: 25, min: 0, max: 100, step: 1},
        fadeStrength: {value: 1, min: 0, max: 1, step: 0.1},
        followCamera: false,
        infiniteGrid: true,
        // showGridControls: false,
    });

    function getCellColor() {
        switch (UIStore.currentState) {
            case UIStates.Editor:
                return '#6f6f6f'
            case UIStates.Animation:
                return '#5a77a6';
            case UIStates.Preview:
                return '#6f6f6f';
        }
    }

    useEffect(() => {
        console.log(session)
        if (controllers[0]) {
            // console.log("Controllers ::\n", controllers[0].position);
        }

        if (session) {
            session.onsqueezestart = (e) => {
                const hand = e.inputSource.handedness

                // console.log(`On Squeeze start event | ${hand} |\n`, hand.toString().toLowerCase() === "left");
                setLeftSqueeze(hand === 'left');
                setLeftSqueeze(hand === 'right');
                setActiveTransformation(leftSqueeze && rightSqueeze);
                // console.table({
                //     left: leftSqueeze,
                //     right: rightSqueeze,
                //     activeTransformation: activeTransformation
                // });
            }
        }
    }, [session, controllers])

    useFrame(() => {


        if (activeTransformation) {
            console.log("Transforming!!");
        }
    })


    return (
        <>
            {!(UIStore.currentState === UIStates.Preview) &&
                <Grid position={[0, 0, 0]} args={gridSize} {...gridConfig} />}
            <Controllers/>
            {
                session &&
                <group>
                    <XRNavigationButtons
                        onEditSelect={onEditSelect}
                        onAnimationSelect={onAnimationSelect}
                        onPreviewSelect={onPreviewSelect}
                        state={UIStore.currentState}
                    />
                    {UIStore.currentState === UIStates.Editor && renderEditorUI()}
                    {UIStore.currentState === UIStates.Animation && renderAnimationUI()}
                    {UIStore.currentState === UIStates.Preview && renderPreviewUI()}
                </group>

            }
            <group ref={sceneRef}>
                {props.children}
            </group>
        </>

    );

    function onEditSelect() {
        UIStore.setEditor()
    }

    function onAnimationSelect() {
        UIStore.setAnimation()
    }

    function onPreviewSelect() {
        UIStore.setPreview()
    }

    function renderEditorUI() {
        return (
            <>

                {/*<TestComponent*/}
                {/*    boxColor={0x00ff00}*/}
                {/*    stateColor={0xaded1f}*/}
                {/*    position={[-0.5, 0.5, -3]}*/}
                {/*/>*/}
            </>
        )
    }

    function renderAnimationUI() {
        const groupPosition = {
            x: 3,
            y: 1,
            z: -3
        }
        const groupRotation = {
            x: 0,
            y: -Math.PI / 4,
            z: 0,
        }

        return (
            <>
                <Button
                    label={"Rotate"}
                    radius={0.03}
                    position={[groupPosition.x, groupPosition.y + 0.5, groupPosition.z]}
                    rotation={[groupRotation.x, groupRotation.y, groupRotation.z]}
                    fontSize={0.2}
                    onSelectStart={(e) => {
                        console.log('Rotate button grab event :: ', e)
                    }}
                    args={[1, 0.5, 0]}
                    canGrab
                />
                <Button
                    label={"Rotate"}
                    radius={0.03}
                    position={[groupPosition.x, groupPosition.y + 1, groupPosition.z]}
                    rotation={[groupRotation.x, groupRotation.y, groupRotation.z]}
                    fontSize={0.2}
                    args={[1, 0.5, 0]}
                    canGrab
                />
                {/*<TestComponent*/}
                {/*    boxColor={0xff0000}*/}
                {/*    stateColor={0xaded1f}*/}
                {/*    position={[2, 0.5, -3]}*/}
                {/*/>*/}
            </>
        )
    }

    function renderPreviewUI() {
        return (
            <>
                {/*<TestComponent*/}
                {/*    boxColor={0x0000ff}*/}
                {/*    stateColor={0xaded1f}*/}
                {/*    position={[3, 0.5, -3]}*/}
                {/*/>*/}
            </>
        )
    }
}


SystemInterface.propTypes = {
    defaultMode: PropTypes.oneOf(Object.values(UIStates)),
}

SystemInterface.defaultProps = {
    defaultMode: UIStates.Editor,
}


function XRNavigationButtons(props) {

    const {camera} = useThree();
    const ref = useRef();

    useEffect(() => {
        if (camera && ref.current) {
            // ref.current.parent = camera
        }
    }, [camera, ref.current]);
    const y = 1;
    const z = -0.5;
    const rotation = [-1, 0, 0]
    return (
        <mesh ref={ref} rotation={rotation}>
            <Button
                key={1}
                label={'Editor'}
                position={[-0.5, y, z]}
                onSelect={props.onEditSelect}
                isActive={props.state === UIStates.Editor}
            ></Button>
            <Button
                key={2}
                label={'Animate'}
                position={[0, y, z]}
                onSelect={props.onAnimationSelect}
                isActive={props.state === UIStates.Animation}
            ></Button>
            <Button
                key={3}
                label={'Preview'}
                position={[0.5, y, z]}
                onSelect={props.onPreviewSelect}
                isActive={props.state === UIStates.Preview}
            ></Button>
        </mesh>
    )
}