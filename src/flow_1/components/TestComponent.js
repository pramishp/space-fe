import {Interactive, RayGrab} from "@react-three/xr";
import {Box, Text} from "@react-three/drei";
import {useEffect, useState} from "react";
import {getControllerType} from "../utils/controllerUtils";

export function TestComponent(props) {
    const [color, setColor] = useState(props.boxColor);


    const [scale, setScale] = useState([1, 1, 1]);

    const [activeLeft, setActiveLeft] = useState(false);
    const [activeRight, setActiveRight] = useState(false);

    useEffect(() => {
    }, [activeRight, activeLeft])

    function onSqueezeStart(e) {
        setColor(props.stateColor);

        const controllerType = getControllerType(e.target);
        if (controllerType === 'right') {
            setActiveRight(true);
        } else if (controllerType === 'left') {
            setActiveLeft(true);
        }

        // console.log(`\n\nStart  ${controllerType}::\n\n`)
        console.table({
            left: activeLeft,
            right: activeRight,
        })
        setScale([2, 2, 2]);
    }

    function onSqueezeEnd(e) {
        setColor(props.stateColor);

        const controllerType = getControllerType(e.target);
        if (activeRight) {
            setActiveRight(false);
        } else if (activeLeft) {
            setActiveLeft(false);
        }

        // console.log(`\n\nEnd  ${controllerType}::\n\n`)
        console.table({
            left: activeLeft,
            right: activeRight,
        })


        setScale([2, 2, 2]);

    }

    return (
        <>
            <RayGrab>
                <Interactive
                    onSqueezeStart={onSqueezeStart}
                    onSqueezeEnd={onSqueezeEnd}
                >
                    <Box position={props.position || [0.5, 0.5, -3]} args={[0.5, 0.5, 0.5]} scale={scale}>
                        <meshStandardMaterial
                            color={color}
                        />
                        <Text
                            position={[0, 0, 0.3]}
                            fontSize={0.05}
                            color="#fff"
                            anchorX="center"
                            anchorY="middle"
                        >
                            {activeRight && 'Right'}
                        </Text>
                    </Box>
                </Interactive>
            </RayGrab>
        </>

    )
}