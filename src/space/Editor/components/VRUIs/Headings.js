import {Box, Text, Text3D} from "@react-three/drei";
import * as React from "react";

export function Heading6({children}){
    return (
        <Text  fontSize={0.1} outlineWidth={'5%'} outlineColor="#000000" outlineOpacity={1}>
            {children}
        </Text>
    )

}
export function Heading5({children}){
    return (
        <Text  fontSize={0.2} outlineWidth={'5%'} outlineColor="#000000" outlineOpacity={1}>
            {children}
        </Text>
    )
}

export function Title({children}){
    const color= "#414141"
    return (
        <Box args={[0.4, 0.1, 0.01]}>
            <meshStandardMaterial
                color={color}
            />
            <Text  fontSize={0.05}
                   position={[0, 0, 0.06]}
                   outlineOpacity={1}
                   color="#ffffff"
                   anchorX="center"
                   anchorY="middle">
                {children}
            </Text>
        </Box>

    )

}export function Title3D({children}){
    return (
        <Text3D>
            {children}
        </Text3D>
    )

}