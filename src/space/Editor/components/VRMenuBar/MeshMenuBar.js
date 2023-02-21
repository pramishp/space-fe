import React, { useState, useRef, useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three'
import { Box, Text, Billboard } from "@react-three/drei";
import { Interactive } from '@react-three/xr';


function MeshMenuBar({ isXR, onMeshSelected, onLightSelected, onGroupSelected }) {
    const meshOptions = [
        { name: 'Sphere', id: 'sphere', position: [0, 1, -2] },
        { name: 'Box', id: 'box', position: [0, 0.8, -2] },
        { name: 'Cylinder', id: 'cylinder', position: [0, 0.6, -2] },
        { name: 'Plane', id: 'plane', position: [0, 0.4, -2] },
    ];

    const planeRef = useRef();
    const meshOptionsRefs = useRef([])

    useLayoutEffect(() => {
        // const planePosition = planeRef.current.position;
        // meshOptionsRefs.current.forEach((boxRef, i) => {
        //     const boxPosition = boxRef.current.position;
        //     boxPosition.x = planePosition.x;
        //     boxPosition.y = planePosition.y - 0.05 * (meshOptions.length - 1) + 0.1 * i;
        //     boxPosition.z = planePosition.z + 0.006;
        // })
    }, [meshOptions]);

    const handleButtonSelect = (event, menuItem) => {
        const selectedId = event.intersection.object.name;
        console.log("Selected Id : ", selectedId);
        onMeshSelected(selectedId);
    }

    const handleButtonHover = (event) => {
        const selectedId = event.intersection.object.name;
    }


    const displayMenuOptions = () => {
        let result = [];

        result.push(meshOptions.map((menuItem, index) => {
            // change the position based on the index of the button
            let position = [0, 1 - index * 0.08, -2];
            if (planeRef.current) {
                const planePosition = planeRef.current.position
                position = [planePosition.x, 1 - index * 0.08, planePosition.z]
            }

            return <Interactive
                onSelect={(e, menuItem) => handleButtonSelect(e, menuItem)}
            >
                <Box
                    ref={(ref) => meshOptionsRefs.current[index] = ref}
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

            <mesh ref={planeRef} position={[0, 0, -2]}>
                <planeBufferGeometry attach="geometry" args={[2, 2]} />
                <meshBasicMaterial attach="material" color="green" />
            </mesh>

            {displayMenuOptions()}


        </>
    )
}

export default MeshMenuBar;
