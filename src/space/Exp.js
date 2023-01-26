import * as React from 'react'
// import {VRButton, XR} from '@react-three/xr'
import {TransformControls} from '@react-three/drei'
import {Canvas, useFrame} from '@react-three/fiber'

import {useMultiplayerState, room} from "./hooks/useMultiplayerState";

import {roomID, yShapes} from "./store";

const shapesInitial = {}

const shapes = {
    'cube1': {
        'shape': "box",
        'position': [0, 0, 0]
    }
}

function Box(props, ref) {
    // Hold state for hovered and clicked events
    const [hovered, hover] = React.useState(false)
    const [clicked, click] = React.useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    // useFrame((state, delta) => (ref.current.rotation.x += delta))
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}
        >
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color={'hotpink'}/>
        </mesh>
    )
}

export default function XRApp() {
    const [objects, setObjects] = React.useState(shapes)
    const app = {};
    app.replacePageContent = (yShapes) => {
        // setObjects(yShapes)
        //TODO: use ref of the object to update position, don't setState
    }

    app.loadRoom = (roomId) => {
        app.room = room;
    }

    app.pause = () => {

    }

    app.removeUser = (userId) => {

    }

    app.updateUser = (users) => {
    }

    const {
        onMount,
        onChangePage,
        onUndo,
        onRedo,
        loading,
        onChangePresence
    } = useMultiplayerState(roomID);

    const transformRef = React.useRef();
    const boxRef = React.useRef();

    const BoxF = React.forwardRef(Box)
    const getPosition = () => {
        if (transformRef.current != null) {
            // const pos = transformRef.current.getWorldPosition();
            // console.log('position : ', transformRef.current.worldPosition)
            const box = boxRef.current;
            let position = transformRef.current.worldPosition;
            position = [position.x, position.y, position.z]
            // y_store.set('position', [position.x, position.y, position.z])

            //TODO: get obj id, for now taking default
            const shapes = {
                'cube1': {...objects['cube1'], position: position}
            }
            const oldPosition = objects['cube1'].position;
            // check if the current property is changed
            if (position[0] != oldPosition[0] && position[1] != oldPosition[1] && position[2] != oldPosition[2]) {
                onChangePage(app, shapes);
            }
        }

        if (boxRef.current != null) {
            // console.log(boxRef.current);
        }
    }
    React.useEffect(() => {
        onMount(app);
    })

    return (
        <Canvas>
            <ambientLight intensity={0.5}/>
            <pointLight position={[5, 5, 5]}/>
            {Object.entries(objects)
                .map(([id, val]) => (
                        <>
                            <TransformControls key={id} ref={transformRef} onObjectChange={e => getPosition()}/>
                            <BoxF ref={boxRef} position={val.position}/>
                        </>
                    )
                )}


        </Canvas>
    )
}
