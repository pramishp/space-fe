import React, {useRef, useState} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import {Environment, GradientTexture, OrbitControls} from '@react-three/drei'
import {RayGrab, XR} from "@react-three/xr";
import SystemInterface from "../containers/SystemInterface";
import {ObjectTypes, ShapesPreset, UIStates} from "../constants/constants";
import {useUIStore} from "../utils/UIStore";


export default function App() {
    const [isLoading, setIsLoading] = useState(false)

    const [objects, setObjects] = useState({})
    //
    // useEffect(() => {
    //     setIsLoading(true);
    //     console.log(isLoading);
    //     const objects = {
    //         type: "basic",
    //         color: "ff0000",
    //         name: "sphere",
    //         position: [0, 0, 0],
    //         animationData: [
    //             {
    //                 type: 'translate',
    //                 args: {
    //                     path: 'circle',
    //                     radius: 3,
    //                     infinite: true,
    //                 },
    //             },
    //             {
    //                 type: 'rotate',
    //                 args: {
    //                     degree: 360,
    //                     infinite: true,
    //                 },
    //             },
    //         ]
    //     }
    //
    //     setTimeout(() => {
    //         setObjects(objects);
    //         setIsLoading(false)
    //     }, 5000)
    // }, [objects, isLoading])


    return (
        <Canvas style={{backgroundColor: '#2c2c2c', width: window.innerWidth, height: window.innerHeight}} shadows
                camera={{position: [-3, 6, 6], fov: 25}}>
            <XR>
                <SystemInterface>
                    <Sphere/>
                    {/*{*/}
                    {/*    isLoading ?*/}
                    {/*        <TestComponent*/}
                    {/*            boxColor={0x04defd}*/}
                    {/*            stateColor={0xa3fe1f}*/}
                    {/*            position={[-1.5, 0.5, -3]}*/}
                    {/*        /> :*/}
                    {/*        <TestComponent*/}
                    {/*            boxColor={0xff0000}*/}
                    {/*            stateColor={0xa3fe1f}*/}
                    {/*            position={[-1.5, 0.5, -3]}*/}
                    {/*        />*/}
                    {/*}*/}

                </SystemInterface>
            </XR>
            <OrbitControls makeDefault/>
            <Environment preset="city"/>
        </Canvas>
    )
}

function Sphere() {
    const sunRef = useRef();
    const mercuryRef = useRef();
    const UIState = useUIStore();
    var t = 0;
    useFrame(({clock}) => {
        if ((UIState.currentState === UIStates.Preview) && sunRef.current) {
            sunRef.current.rotation.z = clock.getElapsedTime();
            t += 0.009;
            mercuryRef.current.rotation.z = clock.getElapsedTime();
            mercuryRef.current.position.x = 3 * Math.cos(t) + sunRef.current.position.x;
            mercuryRef.current.position.z = 3 * Math.sin(t) + sunRef.current.position.z;
        }
    });

    return (
        <>
            <RayGrab onSelectStart={(e) => {
                console.log("Select start ::", e);
            }
            }>
                <mesh ref={sunRef} position={[0.5, 2, -6]} rotation={[Math.PI / 2, 0, 0]}>
                    <sphereGeometry args={[1, 100, 100]}/>
                    <meshBasicMaterial>
                        <GradientTexture
                            stops={[0, 1]} // As many stops as you want
                            colors={['red', 'orange']} // Colors need to match the number of stops
                            size={1024} // Size is optional, default = 1024
                        />
                    </meshBasicMaterial>
                </mesh>
            </RayGrab>
            <RayGrab onSelectStart={(e) => {
                console.log("Select start ::", e);
            }
            }>
                <mesh ref={mercuryRef} position={[0.5, 2, -3]} rotation={[Math.PI / 2, 0, 0]}>
                    <sphereGeometry args={[0.2, 100, 100]}/>
                    <meshBasicMaterial>
                        <GradientTexture
                            stops={[0, 1]} // As many stops as you want
                            colors={['orange', 'brown']} // Colors need to match the number of stops
                            size={2000} // Size is optional, default = 1024
                        />
                    </meshBasicMaterial>
                </mesh>
            </RayGrab>
        </>
    )
}

function CustomGrab(props) {
    const UIStore = useUIStore();
    return (
        <>
            <RayGrab>
                {props.children}
            </RayGrab>
            {/*{*/}
            {/*    UIStore.currentState === UIStates.Preview ?*/}
            {/*        <group>*/}
            {/*            {props.children}*/}
            {/*        </group> :*/}
            {/*        <RayGrab>*/}
            {/*            {props.children}*/}
            {/*        </RayGrab>*/}

            {/*}*/}
        </>
    )
}

CustomGrab.propTypes = RayGrab.propTypes;


