import { RayGrab, Interactive, useController } from '@react-three/xr'
import {useFrame} from "@react-three/fiber"
import React, { useState, useRef } from 'react'
import * as THREE from "three";
import { useHelper } from '@react-three/drei';
import { BoxHelper } from "three";



const euclideanDistance = (point_1, point_2) => {
    return Math.sqrt((point_1.x - point_2.x) ** 2 + (point_1.y - point_2.y) ** 2 + (point_1.z - point_2.z) ** 2)
}

const calculateScale = (startDistance, endDistance, currentScaleVector) => {
    if ((startDistance - endDistance) < 0) {
        // console.log("Distance increased and so expanding!!!");
        return currentScaleVector.x + 0.1;
    }
    else {
        // console.log("Distance decreased so shrinking");
        return currentScaleVector.x - 0.1;
    }
}

function VRItem(props) {
    let selectedItems = props.selectedItems;
    // console.log("selected Items outside: ", selectedItems, typeof selectedItems);
    // console.log("uuid : ", props.uuid);


    let selectMesh = true;

    const leftController = useController("left");
    const rightController = useController("right");

    // for controller distance // for scaling, we use both controller
    const [startDistance, setStartDistance] = useState(null);
    const [endDistance, setEndDistance] = useState(null);

    // set raygrab enabled
    const [isRayGrabEnabled, setIsRayGrabEnabled] = useState(true);

    const handleSelectStart = (event) => {
        // selection of the object
        console.log("handle select start", selectedItems, props.uuid)
        props.onSelect({"uuid" : props.uuid, "object" : event.intersection.object});
        console.log("after selection : ", selectedItems);
        setIsRayGrabEnabled(true)
    }



    const handleSelectEnd = (event) => {
        // after the select End, call the callback for position and rotaiton change
        const controller = event.target.controller;

        let worldPosition = event.intersection.point
        // console.log(event)
        props.onVRTransformReleased({ "uuid": props.uuid, "worldPosition": worldPosition,
            "worldQuaternion": controller.quaternion,
            "worldRotation": controller.rotation
        });
    }
    const handleSqueezeStart = (event) => {
        // console.log("Squeeze started : ", event);
        // Make sure that both controller are on, else will cause error
        let distance = euclideanDistance(rightController.grip.position, leftController.grip.position);
        setStartDistance(distance);
    }

    const handleSqueezeEnd = (event) => {
        // console.log("handle squeeze end");

        let distance = euclideanDistance(rightController.grip.position, leftController.grip.position);

        setEndDistance(distance);

        // set scaling of the object
        let scale = calculateScale(startDistance, endDistance, event.intersection.object.scale);
        props.onObjectPropsChanged({ "uuid": props.uuid, "key": "scale", "val": [scale, scale, scale] });
        // props.children.ref.current.scale.x = scale;
        // props.children.ref.current.scale.y = scale;
        // props.children.ref.current.scale.z = scale;
    }

    useHelper(selectMesh && props.children.ref, BoxHelper, 'cyan')

    const children = <Interactive
        onSelectStart={(event) => handleSelectStart(event)}
        onSelectEnd={(event) => handleSelectEnd(event)}
        onSqueezeEnd={(event) => handleSqueezeEnd(event)}
        onSqueezeStart={(event) => handleSqueezeStart(event)}
    >
        {props.children}
    </Interactive>

    if (isRayGrabEnabled) {
        return (<RayGrab>
            {children}
        </RayGrab>)
    }


    return (
        <>
            {children}
        </>
    )
}

export default VRItem