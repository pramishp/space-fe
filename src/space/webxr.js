import * as React from 'react'
import * as THREE from 'three'
import {VRButton, XR, Hands, useXR, Interactive, useHitTest, Controllers, useController} from '@react-three/xr'
import {Box, Text} from '@react-three/drei'
import {useFrame, Canvas} from '@react-three/fiber'

function ButtonXR(props) {
    const interactiveButton = React.useRef()

    const [hover, setHover] = React.useState(false)
    const [squeezeStart, setStartSqueeze] = React.useState(false)
    const [squeezeEnd, setEndSqueeze] = React.useState(false)
    const [color, setColor] = React.useState(0x123456)

    const rightController = useController("right")
    const previousTransform = React.useMemo(() => new THREE.Matrix4(), [])
    const grabbingController = React.useRef();

    useFrame((state) => {
        const controller = grabbingController.current
        if (!controller) {
            return
        }
        // const {grip: controller} = rightController
        // const forward = new THREE.Vector3(0, 0, -0.1)
        // // forward.applyQuaternion(controller.quaternion)
        // const position = new THREE.Vector3().copy(controller.position).add(forward)
        //
        // if (squeezeStart && !squeezeEnd) {
        //     interactiveButton.current.position.set(position.x, position.y, position.z)
        //     interactiveButton.current.rotation.set(controller.rotation.x, controller.rotation.y, controller.rotation.z)
        // }

        const group = interactiveButton.current
        if (!controller) return

        group.applyMatrix4(previousTransform)
        group.applyMatrix4(controller.matrixWorld)
        group.updateMatrixWorld()

        previousTransform.copy(controller.matrixWorld).invert()
    })
    const onSqueezeStart = (e) => {
        grabbingController.current = e.target.controller
        previousTransform.copy(e.target.controller.matrixWorld).invert()

        // setStartSqueeze(true)
        // setEndSqueeze(false)
    }
    const onSqueezeEnd = (e) => {
        if (e.target.controller === grabbingController.current) {
            grabbingController.current = undefined
        }
    }
    return (
        <Interactive onSelect={() => setColor((Math.random() * 0xffffff) | 0)} onHover={() => setHover(true)}
                     onBlur={() => {
                         setHover(false);

                     }} onSqueezeStart={onSqueezeStart} onSqueezeEnd={onSqueezeEnd}>
            <Box {...props} ref={interactiveButton} args={[0.4, 0.1, 0.1]}>
                <meshStandardMaterial color={color}/>
                <Text position={[0, 0, 0.06]} fontSize={0.05} color="#000" anchorX="center" anchorY="middle">
                    Hello react-xr!
                </Text>
            </Box>
        </Interactive>
    )
}


function Button(props) {
    const [hover, setHover] = React.useState(false)
    const [color, setColor] = React.useState(0x123456)

    return (

        <Box {...props} args={[0.4, 0.1, 0.1]} scale={hover ? 1.5 : 1}>
            <meshStandardMaterial color={color}/>
            <Text position={[0, 0, 0.06]} fontSize={0.05} color="#000" anchorX="center" anchorY="middle">
                Hello react-xr!
            </Text>
        </Box>
    )
}

function PlayerExample() {
    const player = useXR((state) => state.player)
    useFrame(() => void (player.rotation.x = player.rotation.y += 0.01))

    return null
}

function HitTestExample() {
    const boxRef = React.useRef()
    // useHitTest((hitMatrix) => {
    //     hitMatrix.decompose(boxRef.current.position, boxRef.current.quaternion, boxRef.current.scale)
    // })

    return <Box ref={boxRef} args={[0.1, 0.1, 0.1]}/>
}

export default function XRApp() {

    return (
        <>
            <VRButton onError={(e) => console.error(e)}/>

            <Canvas>
                <XR>
                    <ambientLight intensity={0.5}/>
                    <pointLight position={[5, 5, 5]}/>
                    {/*<Hands*/}
                    {/*    // modelLeft="/hand-left.gltf"*/}
                    {/*    // modelRight="/hand-right.gltf"*/}
                    {/*/>*/}
                    <ButtonXR position={[0, 0.8, -1]}/>
                    <Controllers/>
                    {/*<PlayerExample />*/}
                    {/* <HitTestExample/>*/}

                </XR>
            </Canvas>
        </>
    )
}
