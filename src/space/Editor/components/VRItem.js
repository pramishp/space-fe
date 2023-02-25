import { RayGrab, Interactive, useController } from '@react-three/xr'
import React, { useState, useRef } from 'react'
import * as THREE from "three";


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

// const grabbingController = React.useRef<THREE.Object3D>()
//   const groupRef = React.useRef<THREE.Group>(null!)
//   const previousTransform = React.useMemo(() => new THREE.Matrix4(), [])
//   React.useImperativeHandle(forwardedRef, () => groupRef.current)

//   useFrame(() => {
//     const controller = grabbingController.current
//     const group = groupRef.current
//     if (!controller) return

//     group.applyMatrix4(previousTransform)
//     group.applyMatrix4(controller.matrixWorld)
//     group.updateMatrixWorld()

//     previousTransform.copy(controller.matrixWorld).invert()
//   })

function VRItem(props) {
    const meshInteractiveRef = useRef()
    const previousTransform = React.useMemo(() => new THREE.Matrix4(), [])

    const leftController = useController("left");
    const rightController = useController("right");

    // for controller distance // for scaling, we use both controller
    const [startDistance, setStartDistance] = useState(null);
    const [endDistance, setEndDistance] = useState(null);

    // set raygrab enabled
    const [isRayGrabEnabled, setIsRayGrabEnabled] = useState(true);

    const handleSelectStart = (event) => {
        console.log("handle START : ", event);
        setIsRayGrabEnabled(true)
    }



    const handleSelectEnd = (event) => {
        console.log("handle END end : ", event);
        // after the select End, call the callback for position and rotaiton change
        // setIsRayGrabEnabled(false);
        const controller = event.target.controller;
        // console.log("current mesh : ", controller);
        props.onVRTransformReleased({ "uuid": props.uuid, "worldPosition": controller.position, "worldQuaternion": controller.quaternion });
        console.log("mesh interactive : ", meshInteractiveRef);


        // const group = meshInteractiveRef.current
        // group.applyMatrix4(previousTransform)
        // group.applyMatrix4(controller.matrixWorld)
        // group.updateMatrixWorld()

        // previousTransform.copy(controller.matrixWorld).invert()



        console.log("after mesh interactive : ", meshInteractiveRef);
        // setIsRayGrabEnabled(false);
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
        console.log("scale : ", scale);
        props.onObjectPropsChanged({ "uuid": props.uuid, "key": "scale", "val": scale });
        // props.children.ref.current.scale.x = scale;
        // props.children.ref.current.scale.y = scale;
        // props.children.ref.current.scale.z = scale;
    }

    // console.log("props children : ", props.children);

    const children = <Interactive ref={meshInteractiveRef}
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