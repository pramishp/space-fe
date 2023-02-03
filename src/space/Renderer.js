import {useState, useEffect, useRef, createRef} from "react";

import * as THREE from "three";
import {useThree, useGraph} from "@react-three/fiber";
import {TransformControls, Box} from '@react-three/drei'

import {toJSX} from "../common/loader";
import {room, useMultiplayerState} from "./hooks/useMultiplayerState";
import {roomID} from "./store";


export default function Renderer({data, setRefs}) {

    // const scene = useThree(state => state.scene)
    const {jsxs, refs} = toJSX(data);
    const [graph, setGraph] = useState(jsxs);
    const [refGraph, setRefGraph] = useState(refs);
    const transformRefs = {};
    Object.keys(refGraph).forEach(item => {
        transformRefs[item] = createRef();
    })
    const [transformRefGraph, setTransformRefGraph] = useState(transformRefs);


    useEffect(() => {
        setRefs(refs)
    }, [refGraph])

    const onPositionChange = (uuid) => {
        const transformRef = transformRefs[uuid];
        const meshRef = refGraph[uuid];

        if (meshRef.current && transformRef.current) {
            meshRef.current.position.x = transformRef.current.worldPosition.x;
            meshRef.current.position.y = transformRef.current.worldPosition.y;
            meshRef.current.position.z = transformRef.current.worldPosition.z;
        }
    }

    const app = {};

    app.replacePageContent = (yShapes) => {
        // get actions; insert, update, delete, group
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

    app.insertMesh = ({uuid, val}) => {
        // get ref and add to the scene
        const {jsxs: localJsxs, refs: localRefs} = toJSX(val);
        const localTransformRefGraph = {};
        // single mesh is received
        Object.entries(localJsxs).forEach(([id, jsx]) => {
            localTransformRefGraph[uuid] = createRef();
        });
        setGraph(current => ({...current, ...localJsxs}))
        setRefGraph(current => ({...current, ...localRefs}))
        setTransformRefGraph(current => ({...current, ...localTransformRefGraph}));
    }

    app.updateMesh = ({uuid, keys, val}) => {

    }

    app.deleteMesh = ({uuid}) => {

    }


    const {
        onMount,
        onChangePage,
        onInsertMesh,
        onDelete,
        onUndo,
        onRedo,
        loading,
        onChangePresence
    } = useMultiplayerState(roomID);

    onMount(app); // to set the app for multiplayer

    const insertMesh = () => {
        const mesh = {
            type: 'Mesh',
            position: [0, 0, 0],
            rotation: [0, 0, 0]
        }
        const geometry = {
            type: 'BoxGeometry',
            width: 1,
            height: 1,
            depth: 1,
            widthSegments: 1,
            heightSegments: 1,
            depthSegments: 1
        }
        const material = {
            type: 'MeshBasicMaterial',
            color: 65280,
        }

        onInsertMesh({mesh, geometry, material})

    }

    return (
        <>
            <Box args={[1, 0.3, 0.1]} position={[0, 1, 0]} onClick={insertMesh}/>
            {Object.entries(graph).map(([uuid, item]) => {
                return (
                    <>
                        <TransformControls key={`transform-${uuid}`} ref={transformRefs[uuid]}
                                           onChange={() => onPositionChange(uuid)}/>
                        {item}
                    </>
                )
            })}
        </>

    )
}
