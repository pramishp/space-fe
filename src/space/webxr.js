import * as React from 'react'
import * as THREE from 'three'
import * as ReactDOM from 'react-dom/client'
import {
    VRButton,
    XR,
    Hands,
    useXR,
    Interactive,
    useHitTest,
    Controllers,
    ARButton,
    useController
} from '@react-three/xr'
import {Box, OrbitControls, Text} from '@react-three/drei'
import {useFrame, Canvas} from '@react-three/fiber'

function Button(props) {
    const [hover, setHover] = React.useState(false)
    const [color, setColor] = React.useState(0x123456)

    function onSelect() {
        setColor((Math.random() * 0xffffff) | 0)
    }

    function onHover() {
        setHover(true)
    }

    function onBlur() {
        setHover(false)
    }

    return (
        <Interactive
            onSelect={onSelect}
            onHover={onHover}
            onBlur={onBlur}
        >
            <Box
                {...props}
                args={[0.4, 0.1, 0.1]}
                scale={hover ? 1.5 : 1}
            >
                <meshStandardMaterial
                    color={color}
                />
                <Text
                    position={[0, 0, 0.06]}
                    fontSize={0.05}
                    color="#fff"
                    anchorX="center"
                    anchorY="middle"
                >
                    Hello react-xr!
                </Text>
            </Box>
        </Interactive>
    )
}

function PlayerExample() {
    const player = useXR((state) => state.player)
    // useFrame(() => void (player.rotation.x = player.rotation.y += 0.01))

    return null
}

function HitTestExample({controllersRef}) {
    const {player} = useXR()
    const boxRef = React.useRef()
    // useHitTest((hitMatrix) => {
    //     hitMatrix.decompose(boxRef.current.position, boxRef.current.quaternion, boxRef.current.scale)
    // })
    useFrame((state, delta, xrFrame)=>{
        // console.log(controllers)
    })
    const onClick = ()=>{
        const camera = player.children[0];
        console.log(camera)
    }
    return <Box ref={boxRef} onClick={onClick} args={[0.1, 0.1, 0.1]}/>
}

export default function XRApp() {
    const controllersRef = React.useRef();
    return (
        <>
            <VRButton onError={(e) => console.error(e)}/>
            {/*<ARButton onError={(e) => console.error(e)}/>*/}
            <Canvas>
                <XR>
                    <ambientLight intensity={0.5}/>
                    <pointLight position={[5, 5, 5]}/>

                    <Button position={[0, 0.8, -1]}/>
                    <Controllers ref={controllersRef}/>
                    {/*<PlayerExample/>*/}
                    <HitTestExample controllersRef={controllersRef}/>
                    {/*<OrbitControls/>*/}
                </XR>
            </Canvas>
        </>
    )
}
