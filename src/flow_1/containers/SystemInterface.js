import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";
import {useThree} from "@react-three/fiber";
import Button from "../components/Button";
import {UIStates} from "../constants/constants";
import {TestComponent} from "../components/TestComponent";
import {Billboard, Box} from "@react-three/drei";

export default function SystemInterface(props) {
    const [state, setState] = useState(UIStates.Editor)
    const [showUI, setShowUI] = useState(true)
    return (
        <>
            {
                showUI &&
                <MainNavigationButtons
                    onEditSelect={onEditSelect}
                    onAnimationSelect={onAnimationSelect}
                    onPreviewSelect={onPreviewSelect}
                    state={state}
                />
            }
            <group>
                {props.children}
            </group>
            {
                showUI &&
                <group>
                    {state === UIStates.Editor && renderEditorUI()}
                    {state === UIStates.Animation && renderAnimationUI()}
                    {state === UIStates.Preview && renderPreviewUI()}
                </group>
            }

        </>

    );

    function onEditSelect() {
        setState(UIStates.Editor);
    }

    function onAnimationSelect() {
        setState(UIStates.Animation);
    }

    function onPreviewSelect() {
        setState(UIStates.Preview);
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
        return (
            <>
                <TestComponent
                    boxColor={0xff0000}
                    stateColor={0xaded1f}
                    position={[2, 0.5, -3]}
                />
            </>
        )
    }

    function renderPreviewUI() {
        return (
            <>
                <TestComponent
                    boxColor={0x0000ff}
                    stateColor={0xaded1f}
                    position={[3, 0.5, -3]}
                />
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


function MainNavigationButtons(props) {

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