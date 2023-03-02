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

export function Button(props) {
    const {onClick, onHover, title, isXR} = props;
    const [hover, setHover] = React.useState(false)
    const [color, setColor] = React.useState(0x123456)

    const onSelect = ()=>{
        // setColor((Math.random() * 0xffffff) | 0);
        if (onClick){
            onClick();
        }

    }

    const onItemHovered = ()=>{
        setHover(true)
        if (onHover){
            onHover();
        }
    }

    const onBlur = ()=>{
        setHover(false)
    }

    return (
        <Interactive
            onSelect={isXR?onSelect:()=>{}}
            onHover={isXR?onItemHovered:()=>{}}
            onBlur={isXR?onBlur:()=>{}}
        >
            <Box
                {...props}
                args={[0.4, 0.1, 0.1]}
                scale={hover ? 1.5 : 1}
                onClick={!isXR && onSelect?onSelect:()=>{}}
                onPointerOver={!isXR && onItemHovered?onItemHovered:()=>{}}
                onPointerOut={!isXR && onBlur?onBlur:()=>{}}
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
                    {title}
                </Text>
            </Box>
        </Interactive>
    )
}

