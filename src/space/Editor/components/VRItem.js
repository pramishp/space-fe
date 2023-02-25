import { RayGrab, Interactive, useController } from '@react-three/xr'
import React, {useState} from 'react'



const euclideanDistance = (point_1, point_2) => {
    return Math.sqrt((point_1.x - point_2.x) ** 2 + (point_1.y - point_2.y) ** 2 + (point_1.z - point_2.z) ** 2)
}

const calculateScale = (startDistance, endDistance, currentScaleVector) => {
    if ((startDistance - endDistance) < 0) {
        console.log("Distance increased and so expanding!!!");
        return currentScaleVector.x + 0.1;
    }
    else {
        console.log("Distance decreased so shrinking");
        return currentScaleVector.x - 0.1;
    }
}

function VRItem(props) {
    const leftController = useController("left");
    const rightController = useController("right");

    // for controller distance // for scaling, we use both controller
    const [startDistance, setStartDistance] = useState(null);
    const [endDistance, setEndDistance] = useState(null);

    const handleSelect = (event) => {
        // console.log(event);
        // props.onSelect()
        // 
    }

    const handleSqueezeStart = (event) => {
        console.log("Squeeze started : ", event);
        // Make sure that both controller are on, else will cause error
        let distance = euclideanDistance(rightController.grip.position, leftController.grip.position);
        setStartDistance(distance);
    }

    const handleSqueezeEnd = (event) => {
        // console.log("Squeezing : ", event);
        // console.log("right Controller : ", rightController);
        // Make sure that both controller are on, else will cause error
        let distance = euclideanDistance(rightController.grip.position, leftController.grip.position);
        // console.log("controller position", rightController.grip.position, leftController.grip.position)
        // console.log("controller rotation", rightController.grip.rotation, leftController.grip.rotation)
        // console.log("End Distance between controllers : ", distance);
        setEndDistance(distance);

        // set scaling of the object
        let scale = calculateScale(startDistance, endDistance, props.children.ref.current.scale);
        props.children.ref.current.scale.x = scale;
        props.children.ref.current.scale.y = scale;
        props.children.ref.current.scale.z = scale;
    }

    console.log("props children : ", props.children);


    return (
        <>
            <RayGrab>
                <Interactive
                    onSelect={(event) => handleSelect(event)}
                    onSqueezeEnd={(event) => handleSqueezeEnd(event)}
                    onSqueezeStart={(event) => handleSqueezeStart(event)}
                >
                    {props.children}
                </Interactive>
            </RayGrab>
        </>
    )
}

export default VRItem