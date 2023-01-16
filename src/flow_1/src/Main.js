import React, {memo, useEffect, useRef} from 'react'
import {Canvas, useThree} from '@react-three/fiber'
import {
    Grid,
    Center,
    GizmoHelper,
    GizmoViewport,
    AccumulativeShadows,
    RandomizedLight,
    OrbitControls,
    Environment,
    useGLTF, Box, Text, RoundedBox
} from '@react-three/drei'
import {useControls} from 'leva'
import {Controllers, Interactive, Ray, RayGrab, XR} from "@react-three/xr";


function Button(props) {
    const [hover, setHover] = React.useState(false)
    const [color, setColor] = React.useState(0x777777)

    function onSelect() {
        // setColor(0xffffff);
        // props.onSelect();
    }

    function onHover() {
        setColor(0x57a3c9);
        // props.onHover();
    }

    function onBlur() {
        setColor(0x777777);
        // props.onBlur();
    }

    return (
        <Interactive
            onSelect={onSelect}
            onHover={onHover}
            onBlur={onBlur}
        >
            <RoundedBox
                {...props}
                radius={0.009}
                args={[0.4, 0.1, 0.01]}
                scale={hover ? 1.5 : 1}
            >
                <meshStandardMaterial
                    color={color}
                />
                <Text
                    position={[0, 0, 0.006]}
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


function MainNavigationButtons() {

    const {camera} = useThree();
    const ref = useRef();

    useEffect(() => {
        if (camera && ref.current) {
            // ref.current.parent = camera
        }
    }, [camera, ref.current]);

    return (
        <group ref={ref}>
            <Button
                label={"Edit"}
                position={[-0.5, 0.5, -0.5]}
                rotation={[-1, 0, 0]}
            ></Button>
            <Button
                label={"Animate"}
                position={[0, 0.5, -0.5]}
                rotation={[-1, 0, 0]}
            ></Button>
            <Button
                label={"Preview"}
                position={[0.5, 0.5, -0.5]}
                rotation={[-1, 0, 0]}
            ></Button>
        </group>
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
        sectionColor: '#9d4b4b',
        fadeDistance: {value: 25, min: 0, max: 100, step: 1},
        fadeStrength: {value: 1, min: 0, max: 1, step: 0.1},
        followCamera: false,
        infiniteGrid: true
    })


    return (
        <Canvas style={{width: window.innerWidth, height: window.innerHeight}} shadows
                camera={{position: [0, 12, 0], fov: 25}}>
            <XR>
                <MainNavigationButtons/>
                {/*<InternalComponents/>*/}
                <Grid position={[0, -0.01, 0]} args={gridSize} {...gridConfig} />
                <Controllers/>
            </XR>
            <OrbitControls makeDefault/>
            <Environment preset="city"/>
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white"/>
            </GizmoHelper>
        </Canvas>
    )
}

const Shadows = memo(() => (
    <AccumulativeShadows temporal frames={100} color="#9d4b4b" colorBlend={0.5} alphaTest={0.9} scale={20}>
        <RandomizedLight amount={8} radius={4} position={[5, 5, -10]}/>
    </AccumulativeShadows>
))

function Suzi(props) {
    const {nodes} = useGLTF('https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/suzanne-high-poly/model.gltf')
    return (
        <mesh castShadow receiveShadow geometry={nodes.Suzanne.geometry} {...props}>
            <meshStandardMaterial color="#9d4b4b"/>
        </mesh>
    )
}

function InternalComponents() {
    // Add mesh to camera
    const {camera} = useThree();
    const ref = useRef();

    useEffect(() => {

        const meshRef = ref.current;
        // camera.add(meshRef);

        // Cleanup on unmount
        return () => {
            camera.remove(meshRef);
        };
    }, [camera, ref.current]);
    return (
        <>
            <group ref={ref} position={[0, 0, -4]}>
                <RayGrab>
                    {/*<Center top>*/}
                    <Suzi rotation={[-0.63, 0, 0]} scale={2}/>
                    {/*</Center>*/}
                </RayGrab>
                <RayGrab>
                    {/*<Center top position={[-5, 0, 2]}>*/}
                    <mesh castShadow>
                        <sphereGeometry args={[0.5, 64, 64]}/>
                        <meshStandardMaterial color="#9d4b4b"/>
                    </mesh>
                    {/*</Center>*/}
                </RayGrab>
                <RayGrab>
                    {/*<Center top position={[2.5, 0, 1]}>*/}
                    <mesh castShadow rotation={[0, Math.PI / 4, 0]}>
                        <boxGeometry args={[0.7, 0.7, 0.7]}/>
                        <meshStandardMaterial color="#9d4b4b"/>
                    </mesh>
                    {/*</Center>*/}
                </RayGrab>
                {/*<Shadows/>*/}
            </group>
        </>

    )
}
