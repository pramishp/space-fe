import { useState, useEffect, useRef, createRef } from 'react'

import * as THREE from 'three'
import { useThree, useGraph } from '@react-three/fiber'
import { TransformControls, Box } from '@react-three/drei'

import { toJSX } from '../common/loader'
import { room, useMultiplayerState } from './hooks/useMultiplayerState'
import { roomID } from './store'

export default function Renderer() {
    const [graph, setGraph] = useState({})
    const [refGraph, setRefGraph] = useState({})

    const [transformRefGraph, setTransformRefGraph] = useState({})
    const app = {}
    app.replacePageContent = (yShapes) => {
        // get actions; insert, update, delete, group
    }

    app.loadRoom = (roomId) => {
        app.room = room
    }

    app.pause = () => { }

    app.removeUser = (userId) => { }
    app.updateUser = (users) => { }

    // since the jsx is being loaded here. We must change the objects before we reach here.
    app.insertMesh = ({ uuid, val }) => {
        const { jsxs: localJsxs, refs: localRefs } = toJSX(val)
        const localTransformRefGraph = {}
        // single mesh is received
        Object.entries(localJsxs).forEach(([id, jsx]) => {
            localTransformRefGraph[uuid] = createRef()
        })
        setGraph((current) => ({ ...current, ...localJsxs }))
        setRefGraph((current) => ({ ...current, ...localRefs }))
        setTransformRefGraph((current) => ({
            ...current,
            ...localTransformRefGraph,
        }))
    }
    // app.paretnIdChange = () => {
    //    {}
    // }
    app.insertGroup = ({ uuid, val }) => {
        const { jsxs: localJsxs, refs: localRefs } = toJSX(val)
        const localTransformRefGraph = {}

        Object.entries(localJsxs).forEach(([id, jsx]) => {
            localTransformRefGraph[uuid] = createRef()
        })
        setGraph((current) => ({ ...current, ...localJsxs }))
        setRefGraph((current) => ({ ...current, ...localRefs }))
        setTransformRefGraph((current) => ({
            ...current,
            ...localTransformRefGraph,
        }))
    }
    app.addGroupItem = ({ parent_id, child_id }) => {
        refGraph[parent_id].current.add(refGraph[child_id].current)
    }
    // after removal from the group the object must be recovered.
    app.removeGroupItem = ({ parent_id, child_id }) => {
        console.log(refGraph[child_id].current)
        refGraph[parent_id].current.remove(refGraph[child_id].current)
    }
    app.deleteMesh = ({ uuid }) => {
        setGraph((current) => {
            delete current[uuid]
            return { ...current }
        })
        setRefGraph((current) => {
            delete current[uuid]
            return { ...current }
        })
        setTransformRefGraph((current) => {
            delete current[uuid]
            return { ...current }
        })
    }

    app.updateMesh = ({ uuid, key, val }) => {
        const meshRef = refGraph[uuid]
        if (key === 'position') {
            if (meshRef.current) {
                meshRef.current.position.x = val[0]
                meshRef.current.position.y = val[1]
                meshRef.current.position.z = val[2]
            }
        }
    }

    const {
        onMount,
        onChangePage,
        onInsertMesh,
        onDelete,
        onInsertGroup,
        onAddChildren,
        onRemoveChildren,
        onUpdate,
        onUndo,
        onRedo,
        loading,
        onChangePresence,
    } = useMultiplayerState(roomID)

    // onMount(app) // to set the app for multiplayer
    useEffect(() => {
        onMount(app)
    }, [graph])
    const insertMesh = () => {
        const mesh = {
            type: 'Mesh',
            position: [0, 0, 0],
            rotation: [0, 0, 0],
        }
        const geometry = {
            type: 'BoxGeometry',
            width: 1,
            height: 1,
            depth: 1,
            widthSegments: 1,
            heightSegments: 1,
            depthSegments: 1,
        }
        const material = {
            type: 'MeshBasicMaterial',
            color: 65280,
        }

        onInsertMesh({ mesh, geometry, material })
    }
    const groupMesh = () => {
        const group = {
            type: 'Group',
            position: [0, 0, 0],
            rotation: [0, 0, 0],
        }
        // pass the refs of children
        onInsertGroup({ group })
    }

    const addMember = () => {
        const keys = Object.keys(graph)
        const children_id = keys.slice(-3, -1)
        const group_id = keys.at(-1)
        onAddChildren({ group_id, children_id })
    }
    const removeMember = () => {
        const keys = Object.keys(graph)
        const children_id = keys.slice(-2, -1)
        const group_id = keys.at(-1)
        onRemoveChildren({ children_id })
    }
    const deleteMesh = () => {
        let uuid = Object.keys(graph).at(-1)
        //pass the shapes
        onDelete(uuid)
    }
    const onPositionChange = (uuid) => {
        const transformRef = transformRefGraph[uuid]
        let props = {}
        props['position'] = []
        props['position'].push(transformRef.current.worldPosition.x)
        props['position'].push(transformRef.current.worldPosition.y)
        props['position'].push(transformRef.current.worldPosition.z)
        onUpdate(uuid, props)
    }

    return (
        <>
            <Box args={[1, 0.3, 0.1]} position={[-5, 3, 0]} onClick={insertMesh} />
            <Box args={[1, 0.3, 0.1]} position={[-5, 1.5, 0]} onClick={deleteMesh} />
            <Box args={[1, 0.3, 0.1]} position={[-5, 0, 0]} onClick={groupMesh} />
            <Box args={[1, 0.3, 0.1]} position={[-5, -1.5, 0]} onClick={addMember} />
            <Box args={[1, 0.3, 0.1]} position={[-5, -3, 0]} onClick={removeMember} />

            {Object.entries(graph).map(([uuid, item]) => {
                return (
                    <>
                        <TransformControls
                            key={`transform-${uuid}`}
                            ref={transformRefGraph[uuid]}
                            onObjectChange={() => onPositionChange(uuid)}
                        />
                        {item}
                    </>
                )
            })}
        </>
    )
}
