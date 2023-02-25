import * as React from "react";
import * as THREE from 'three';
import {useState, useEffect, useRef, createRef, useCallback, useMemo} from "react";
import {BASIC_LIGHTS, BASIC_OBJECTS, EDITOR_OPS} from "./constants";
import MenuBar from "./components/MenuBar";
import {Canvas, useFrame} from "@react-three/fiber";
import {XR} from '@react-three/xr';
import {gltf2JSX, sampleJson, toJSX} from "../../common/loaders/loader";
import {OrbitControls, TransformControls, GizmoHelper, GizmoViewport, useHelper} from "@react-three/drei";
import {Selection} from "./Selection";
import Controls from "./Controls";
import Ground from "./components/Ground";
import {loadGltf} from "../../common/loaders/FileLoaders";
import {IMPORT_MESH_TYPES} from "../../common/consts";
import Helpers from "./Helpers";
import PropsEditor from "./components/PropsEditor";
import AnimationList from "./components/AnimationEditor/AnimationList";
import {AnimationTree} from "./components/AnimationEditor/AnimationSequenceEditor";



export default function Editor({initData, app, isXR, slideData}) {
    //user
    const {user: {userId}} = app;
    // mesh click callback
    const clickCallbacks = {onClick: onMeshClickCallback, onDoubleClick: onMeshDoubleClick};

    // convert initData to JSX
    const {jsxs, refs} = useMemo(() => {
        return toJSX(initData, clickCallbacks);
    }, [initData]);

    // set jsx and refs as states variables
    const [selectedItems, setSelectedItems] = useState([]);
    const [graph, setGraph] = useState(jsxs);
    const [refGraph, setRefGraph] = useState(refs);

    // references of helpers
    const transformRef = React.useRef();

    function onMeshClickCallback(e, uuid) {
        onSelect({uuid, object: e.object});
    }

    function onMeshDoubleClick(e, uuid) {
        console.log('on mesh double clicked', uuid)
    }

    // event handler when click is not over any meshes
    const onPointerMissed = (e) => {
        onDeselect()
    }

    // editor operational methods
    const notifyApp = ({type, data}) => {
        const {val, userId, uuid} = data;
        // notify only if data.userId === app.user.userId
        if (!app) {
            console.error("app is undefined/null ", app)
        }
        if (userId !== app.user.userId) {
            // as this is the operation performed by other user, no need to notify
            return
        }
        switch (type) {
            case EDITOR_OPS.INSERT_OBJECT:
                app.onMeshInserted({uuid: uuid, val})
                break
            default:
                console.error("No such operation is defined in editor: ", type)
        }
    }

    // insertMesh in the editor
    const insertMesh = ({uuid, val, userId}) => {
        const {jsxs: localJsxs, refs: localRefs} = toJSX(val, clickCallbacks);
        setGraph(current => ({...current, ...localJsxs}))
        setRefGraph(current => ({...current, ...localRefs}))

        // if same user insert a mesh, select inserted mesh
        if (userId === app.user.userId) {
            setSelectedItems([uuid])
        }

        // notify app
        notifyApp({type: EDITOR_OPS.INSERT_OBJECT, data: {val, userId, uuid}, app})
    }

    // insertLight in the editor
    const insertLight = ({uuid, val, userId}) => {
        const jsonData = {
            [uuid]: {
                ...val.object
            }
        }
        const fullData = {
            "objects": jsonData
        }

        insertMesh({uuid, val: fullData, userId});

    }

    const onPositionChange = (e) => {
        if (selectedItems.length === 1) {
            const uuid = selectedItems[0];
            const meshRef = refGraph[uuid];
            if (meshRef.current && transformRef.current) {
                // meshRef.current.position.x = transformRef.current.worldPosition.x;
                // meshRef.current.position.y = transformRef.current.worldPosition.y;
                // meshRef.current.position.z = transformRef.current.worldPosition.z;
            }
        }

    }

    // onSelect
    const onSelect = ({uuid, object}) => {

        const mesh = object;
        if ((selectedItems.length === 1 && uuid !== selectedItems[0]) || selectedItems.length === 0) {
            if (transformRef.current && mesh) {
                transformRef.current.attach(mesh);
                // also set rotation
            }
            setSelectedItems([uuid])
        }

    }

    const onDeselect = () => {
        // hide transform Control
        if (transformRef.current) {
            transformRef.current.detach();
        }
        setSelectedItems([])
    }

    // onMeshSelected, onLightSelected, onGroupSelected
    const onAddMeshSelected = (id) => {
        if (!Object.keys(BASIC_OBJECTS).includes(id)) {
            console.error(`No ${id} in BASIC_OBJECTS`)
        }
        const {uuid, val} = BASIC_OBJECTS[id].get();
        insertMesh({uuid, val, userId: app.user.userId});
    }
    const onAddLightSelected = (id) => {
        const {uuid, val} = BASIC_LIGHTS[id].get();
        insertLight({uuid, val, userId: userId})
    }
    const onAddGroupSelected = (id) => {
        const {uuid, val} = BASIC_LIGHTS[id];
        // insertMesh({uuid, val, userId: app.user.userId})
    }

    // upload model
    const onModelUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsArrayBuffer(file)
        reader.onload = (e) => {
            loadGltf(e.target.result,
                (gltf) => {
                    // TODO: handle camera, scenes, animations
                    //TODO: dispose gltf on unmount
                    const uuid = gltf.scene.uuid;
                    gltf.type = IMPORT_MESH_TYPES.GLTF_GROUP;
                    // console.log(gltf)
                    insertMesh({uuid, val: gltf, userId: app.user.userId})
                },
                (error) => {
                    console.log(error)
                })
        };
    }

    // onAnimation clicked
    const onAnimationListClicked = ({uuid, val}) => {

    }

    /**
     * `onAnimationTimelineDragNDrop` is a function that takes an
     * object with a `uuid`:(animation uuid from slide) and a `to`: (order) property and returns
     * nothing
     */
    const onAnimationTimelineDragNDrop = ({uuid, to})=>{

    }


    return (
        <div>
            <div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <MenuBar onLightSelected={onAddLightSelected}
                             onMeshSelected={onAddMeshSelected}
                             onGroupSelected={onAddGroupSelected}
                    />

                    <input type="file" onChange={onModelUpload}/>
                </div>


            </div>

            <PropsEditor isXR={isXR} selectedItems={selectedItems} refs={refGraph}/>
            <AnimationTree slides={slideData} onDragAndDrop={onAnimationTimelineDragNDrop}/>
            <div style={{height: window.innerHeight}}>
                <Canvas legacy={false}
                        camera={{
                            fov: 50, aspect: 1,
                            near: 0.01, far: 1000,
                            position: [0, 5, 10],
                        }}
                        onPointerMissed={onPointerMissed}>
                    <XR>
                        <AnimationList isXR={isXR} refs={refGraph}
                                       selectedItems={selectedItems}
                                       onClick={onAnimationListClicked}/>
                        <Helpers refs={refGraph} selectedItems={selectedItems} onSelect={onSelect}/>

                        <Ground/>

                        {/*{*/}
                        {/*    !isXR &&*/}
                        {/*    <Selection setEnd={setEnd} setSelection={setSelection}*/}
                        {/*               setStart={setStart} setSelecting={setSelecting}/>*/}
                        {/*}*/}
                        <TransformControls ref={transformRef} visible={selectedItems.length > 0}
                                           onObjectChange={(e) => onPositionChange(e)}/>
                        {
                            Object.entries(graph).map(([uuid, item]) => {
                                return (
                                    <>
                                        {item}
                                    </>
                                )
                            })

                        }

                        {/*<>*/}
                        {/*    <ambientLight ref={directionalLightRef} args={[0x505050]}/>*/}
                        {/*</>*/}
                        <Controls makeDefault/>
                        <GizmoHelper
                            alignment="bottom-right" // widget alignment within scene
                            margin={[80, 80]} // widget margins (X, Y)
                        >
                            <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black"/>
                        </GizmoHelper>
                    </XR>
                </Canvas>
            </div>
        </div>
    )
}

Editor.prototype = {}