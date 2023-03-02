import React, {useState, useRef, useEffect} from 'react'
import {Canvas, extend, useFrame} from '@react-three/fiber'

import {Billboard, Text} from '@react-three/drei'
import * as THREE from 'three'
import {Button} from "./VRUIs/Button";
import {Flex, Box} from "@react-three/flex";


function Title({title, accentColor}) {
    return (
        <Text fontSize={0.5} color={accentColor}>{title}</Text>
    )
}

function NumberInput({value, onIncrease, onDecrease}) {

    const [accentColor] = useState(() => new THREE.Color('red'))

    return (
        <Flex justifyContent="center" alignItems="center">
            <Box centerAnchor>
                <Title title={value} accentColor={accentColor}/>
            </Box>
            <Box>
                <Button
                    onClick={() => {
                        onIncrease()
                    }}
                    title={"Plus"}
                />
            </Box>

            <Box>
                <Button
                    onClick={() => {
                        onDecrease()
                    }}
                    title={"Minus"}
                />
            </Box>

        </Flex>
    )
}

const VRPropsEditor = () => {
    const [state, setState] = useState(1)
    return (
        <Billboard
            position={[0, 4, 0]}
            follow={true}
            lockX={false}
            lockY={false}
            lockZ={false} // Lock the rotation on the z axis (default=false)
        >

            <NumberInput onIncrease={() => setState((s) => s + 1)}
                         onDecrease={() => setState((s) => s > 1 ? s - 1 : 0)}
                         value={`${state}`}
            />

        </Billboard>
    )
}

export default VRPropsEditor;
