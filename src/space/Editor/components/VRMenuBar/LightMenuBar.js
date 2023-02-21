import React, { useState, useRef, useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three'
import { Box, Text, Billboard } from "@react-three/drei";
import { Interactive } from '@react-three/xr';

function LightMenuBar({ onLightSelected }) {
    const planeRef = useRef();
    const lightOptionsRefs = useRef([])

    const lightOptions = [
        { name: 'Ambient', id: 'ambient' },
        { name: 'Directional', id: 'directional' },
        { name: 'Point', id: 'point' },
    ];

    const handleLightSelected = (event) => {
        const selectedId = event.intersection.object.name;
        onLightSelected(selectedId)
    }

    const displayMenuOptions = () => {
        let result = [];

        result.push(lightOptions.map((menuItem, index) => {
            // change the position based on the index of the button
            let position = [0.4, 1 - index * 0.08, -2];
            if (planeRef.current) {
                const planePosition = planeRef.current.position
                position = [planePosition.x, 1 - index * 0.08, planePosition.z]
            }

            return <Interactive
                onSelect={(e, menuItem) => handleLightSelected(e, menuItem)}
            >
                <Box
                    ref={(ref) => lightOptionsRefs.current[index] = ref}
                    key={index}
                    args={[0.2, 0.05, 0.01]}
                    position={position}
                    value={menuItem.id}
                    name={menuItem.id}

                >
                    <meshPhongMaterial
                        color={'#669'}
                    />
                    <Text fontSize={0.03} position={[0, 0, 0.006]} color="red" name={menuItem.id}>
                        {menuItem.name}
                    </Text>
                </Box>
            </Interactive>
        }
        ))

        return result
    }

    return (
        <>
            <mesh ref={planeRef} position={[0.5, 0, -2]}>
                <planeBufferGeometry attach="geometry" args={[2, 2]} />
                <meshBasicMaterial attach="material" color="green" />
            </mesh>

            {displayMenuOptions()}
        </>
    )
}

export default LightMenuBar