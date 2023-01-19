import React, {memo, useEffect, useRef, useState} from 'react'
import {Canvas, useThree} from '@react-three/fiber'
import {
    AccumulativeShadows,
    Box,
    Environment,
    GizmoHelper,
    GizmoViewport,
    Grid,
    OrbitControls,
    RandomizedLight,
    RoundedBox,
    Text,
    useGLTF
} from '@react-three/drei'
import {useControls} from 'leva'
import {Controllers, Interactive, RayGrab, XR} from "@react-three/xr";


function Button(props) {
    const defaultColor = 0x777777
    const selectedColor = 0x2c4c82
    const hoverColor = 0x57a3c9

    const [hover, setHover] = React.useState(false)
    const [color, setColor] = React.useState(props.isActive ? selectedColor : defaultColor)

    useEffect(() => {
        setColor(props.isActive ? selectedColor : defaultColor);
    },[props.isActive])

    function onSelect() {
        // setColor(0xffffff);
        // props.onSelect();

        if (props.onSelect) {
            props.onSelect();
        }

    }

    function onHover() {
        // setColor(hoverColor);
        setHover(true);
        if (props.onHover) {
            props.onHover();
        }
    }

    function onBlur() {
        // setColor((props.isActive ?? selectedColor) || defaultColor);
        setHover(false);
        if (props.onBlur) {
            props.onBlur();
        }
    }

    // function onSelectStart() {
    //     setColor(selectedColor);
    // }
    //
    // function onSelectEnd() {
    //     setColor((props.isActive ?? selectedColor) || defaultColor);
    // }

    return (
        <Interactive
            onSelect={onSelect}
            // onSelectStart={onSelectStart}
            // onSelectEnd={onSelectEnd}
            onHover={onHover}
            onBlur={onBlur}

        >
            <RoundedBox
                {...props}
                radius={0.009}
                args={[0.4, 0.1, props.isActive ? 0.01 : 0.05]}
                scale={hover ? 1.12 : 1}
            >
                <meshStandardMaterial
                    color={color}
                />
                <Text
                    position={[0, 0, props.isActive ? 0.006 : 0.05 / 2 + 0.001]}
                    fontSize={0.05}
                    color="#fff"
                    anchorX="center"
                    anchorY="middle"
                >
                    {props.label}
                </Text>
            </RoundedBox>
        </Interactive>
    )
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

                </SystemInterface>
                <Grid position={[0, -0.01, 0]} args={gridSize} {...gridConfig} />
                <Controllers/>

            </XR>
            <OrbitControls makeDefault/>
            <Environment preset="city"/>
        </Canvas>
    )
}

const UIStates = {
    Editor: 'editor',
    Animation: 'animation',
    Preview: 'preview',
}


function SystemInterface() {
    const [state, setState] = useState(UIStates.Editor)
    return (
        <>
            <MainNavigationButtons
                onEditSelect={onEditSelect}
                onAnimationSelect={onAnimationSelect}
                onPreviewSelect={onPreviewSelect}
                state={state}
            />
            {state === UIStates.Editor && renderEditorView()}
            {state === UIStates.Animation && renderAnimationView()}
            {state === UIStates.Preview && renderPreview()}

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

    function renderEditorView() {
        return (
            <>
                <TestComponent
                    boxColor={0x00ff00}
                    stateColor={0xaded1f}
                    position={[-0.5, 0.5, -3]}
                />
            </>
        )
    }

    function renderAnimationView() {
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

    function renderPreview() {
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


function TestComponent(props) {
    const [color, setColor] = useState(props.boxColor);
    const [scale, setScale] = useState([1, 1, 1])

    function onSqueezeStart() {
        setColor(props.stateColor);
        setScale([2, 2, 2]);
        console.log('squeezed');
    }

    return (
        <>
            <RayGrab>
                <Interactive
                    onSqueezeStart={onSqueezeStart}
                >
                    <Box position={props.position || [0.5, 0.5, -3]} args={[0.5, 0.5, 0.5]} scale={scale}>
                        <meshStandardMaterial
                            color={color}
                        />

                    </Box>
                </Interactive>
            </RayGrab>
        </>

    )
}
