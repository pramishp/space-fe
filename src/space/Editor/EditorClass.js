import * as React from "react";
import * as THREE from 'three';

import { useState, useEffect, useRef, createRef, useCallback, useMemo } from "react";
import { BASIC_LIGHTS, BASIC_OBJECTS, EDITOR_OPS, TYPES } from "./constants";

import MenuBar from "./components/MenuBar";
import { Canvas, useFrame } from "@react-three/fiber";
import { XR, VRButton, Controllers } from '@react-three/xr';
import { gltf2JSX, sampleJson, toJSX } from "../../common/loaders/loader";
import { OrbitControls, TransformControls, GizmoHelper, GizmoViewport, useHelper } from "@react-three/drei";
import { Selection } from "./Selection";
import Controls from "./Controls";
import Ground from "./components/Ground";

import {loadGltf} from "../../common/loaders/FileLoaders";
import {ANIMATION_TRIGGERS, ANIMATION_TYPES, IMPORT_MESH_TYPES} from "../../common/consts";

import Helpers from "./Helpers";
import PropsEditor from "./components/PropsEditor";
import AnimationList from "./components/AnimationEditor/AnimationList";
import { AnimationTree } from "./components/AnimationEditor/AnimationSequenceEditor";
import DisplayUsers from "./components/DisplayUsers";


import VRMenuBar from "./components/VRMenuBar";
import VRPropsEditor from "./components/VRPropsEditor";
import {generateUniqueId} from "../../utils";

import MeshMenuBar from "./components/VRMenuBar/MeshMenuBar";
import LightMenuBar from "./components/VRMenuBar/LightMenuBar";

import VRItem from "./components/VRItem";


export default class Editor extends React.Component {

    constructor(props) {
        super(props);
        // mesh click callback
        this.clickCallbacks = { onClick: this.onMeshClickCallback, onDoubleClick: this.onMeshDoubleClick };

        this.jsxData = toJSX(props.initData, this.clickCallbacks);
        this.state = {
            selectedItems: [],
            graph: this.jsxData.jsxs,
            refGraph: this.jsxData.refs,
            animations: props.initData.animations
        }
        this.transformRef = React.createRef();
    }

    shouldComponentUpdate(nextProps, nextState) {

        const shouldUpdate = nextProps.initData !== this.props.initData;
        if (shouldUpdate) {
            this.jsxData = toJSX(nextProps.initData, this.clickCallbacks);
            this.setState({
                graph: this.jsxData.jsxs,
                refGraph: this.jsxData.refs,
                animations: nextProps.initData.animations
            })

            return shouldUpdate
        }
        return true

    }

    // set jsx and refs as states variables
    onMeshClickCallback = (e, uuid) => {
        this.onSelect({ uuid, object: e.object });
    }

    onMeshDoubleClick = (e, uuid) => {
        console.log('on mesh double clicked', uuid)
    }

    // event handler when click is not over any meshes
    onPointerMissed = (e) => {
        this.onDeselect()
    }

    // editor operational methods

    notifyApp = ({type, data}, notify = true) => {
        const {app} = this.props;
        const {val, uuid, key} = data;

        if (!app) {
            console.error("app is undefined/null ", app)
        }
        // notify is true by default, but for the operations from undo manager, notification are not to be called
        if (!notify) {
            return;
        }

        switch (type) {
            case EDITOR_OPS.INSERT_MESH:
                app.onMeshInserted({uuid: uuid, val})
                break

            case EDITOR_OPS.DELETE_MESH:
                app.onDeleteMesh({uuid})
                break

            case EDITOR_OPS.UPDATE_MESH:
                app.onUpdateMesh({uuid, key, val})
                break

            case EDITOR_OPS.UPDATE_MATERIAL:
                app.onUpdateMaterial({uuid, key, val})
                break

            case EDITOR_OPS.ADD_ANIMATION:
                app.onAddAnimation({uuid, val})
                break

            case EDITOR_OPS.DELETE_ANIMATION:
                app.onDeleteAnimation({uuid})
                break

            default:
                console.error("No such operation is defined in editor: ", type)
        }
    }

    // insertMesh in the editor

    insertMesh = ({uuid, val}, notify = true) => {
        const {app} = this.props;
        const {jsxs: localJsxs, refs: localRefs} = toJSX(val, this.clickCallbacks);

        this.setState(prevState => ({
            graph: { ...prevState.graph, ...localJsxs },
            refGraph: { ...prevState.refGraph, ...localRefs }
        }))

        // // if same user insert a mesh, select inserted mesh
        // if (instanceId === app.user.instanceId) {
        //     this.setState(prevState => ({selectedItems: [uuid]}))
        // }
        //TODO: select local just inserted mesh

        // notify app
        this.notifyApp({type: EDITOR_OPS.INSERT_MESH, data: {val, uuid}, app}, notify)
    }

    deleteMesh = ({uuid}, notify = true) => {
        const {app} = this.props;

        // perform mesh deletion
        this.setState(prevState => {
            const graph = prevState.graph;
            const refGraph = prevState.refGraph;

            delete graph[uuid]
            delete refGraph[uuid]

            return ({
                graph: { ...graph },
                refGraph: { ...refGraph }
            })
        })


        // notify app

        this.notifyApp({type: EDITOR_OPS.DELETE_MESH, data: {uuid}, app}, notify)
    }

    // insertLight in the editor
    insertLight = ({uuid, val}, notify = true) => {

        const jsonData = {
            [uuid]: {
                ...val.object
            }
        }
        const fullData = {
            "objects": jsonData
        }

        this.insertMesh({uuid, val: fullData});

    }

    onPositionChange = (e) => {

        const { selectedItems, refGraph } = this.state;
        if (selectedItems.length === 1) {
            const uuid = selectedItems[0];
            //TODO: debug meshRef is undefined
            const meshRef = refGraph[uuid];
            if (meshRef.current && this.transformRef.current) {
                // meshRef.current.position.x = transformRef.current.worldPosition.x;
                // meshRef.current.position.y = transformRef.current.worldPosition.y;
                // meshRef.current.position.z = transformRef.current.worldPosition.z;
            }
        }

    }

    updateMaterial = ({uuid, key, val, object_uuid}) => {
        const {refGraph} = this.state;
        const meshRef = refGraph[object_uuid];
        if (meshRef && meshRef.current) {
            const mesh = meshRef.current;
            mesh.material[key].set(val);
        }

    }

    addAnimation = ({uuid, val}, notify=true) => {
        this.setState((state) => ({
            animations: {...state.animations, [uuid]: val},
        }))
        this.notifyApp({type: EDITOR_OPS.ADD_ANIMATION, data: {val, uuid}}, notify)

    }

    deleteAnimation = ({uuid}, notify=true) => {
        this.setState((state) => {
            const animations = state.animations;
            delete animations[uuid]
            return {...animations}
        });
        this.notifyApp({type: EDITOR_OPS.DELETE_ANIMATION, data: {uuid}}, notify)

    }

    // onSelect
    onSelect = ({ uuid, object }) => {
        const mesh = object;
        const { selectedItems } = this.state;
        const { transformRef } = this;
        if ((selectedItems.length === 1 && uuid !== selectedItems[0]) || selectedItems.length === 0) {
            if (transformRef.current && mesh) {
                transformRef.current.attach(mesh);
                // also set rotation
            }
            this.setState(prevState => ({ selectedItems: [uuid] }))

        }

    }

    onDeselect = () => {
        const { transformRef } = this;

        // hide transform Control
        if (transformRef.current) {
            transformRef.current.detach();
        }
        this.setState(prevState => ({ selectedItems: [] }))

    }

    // onMeshSelected, onLightSelected, onGroupSelected
    onAddMeshSelected = (id) => {
        const { app } = this.props;
        if (!Object.keys(BASIC_OBJECTS).includes(id)) {
            console.error(`No ${id} in BASIC_OBJECTS`)
        }
        const { uuid, val } = BASIC_OBJECTS[id].get();
        // console.log('on add mesh',val)
        this.insertMesh({uuid, val});

    }

    onAddLightSelected = (id) => {
        const {app} = this.props;
        const {uuid, val} = BASIC_LIGHTS[id].get();
        this.insertLight({uuid, val})
    }

    onAddGroupSelected = (id) => {
        const {uuid, val} = BASIC_LIGHTS[id];
    }

    // upload model
    onModelUpload = (e) => {
        const { app } = this.props;
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

                    this.insertMesh({uuid, val: gltf})
                },
                (error) => {
                    console.log(error)
                })
        };
    }

    // onAnimation clicked

    /* A function that is called when an animation is clicked in the animation list. */
    onAnimationListClicked = ({uuid, val}) => {
        // obtained uuid is of the animation that is clicked


        // generate unique uuid
        const id_ = generateUniqueId();
        const {selectedItems} = this.state;
        const mesh_uuid = selectedItems.length > 0 ? selectedItems[0] : null;
        if (mesh_uuid) {
            //TODO: determine order, triggers
            const data = {
                uuid: id_,
                type: ANIMATION_TYPES.INFINITY,
                trigger: ANIMATION_TRIGGERS.ON_SLIDE_CHANGE,
                object_uuid: mesh_uuid,
                order: 0,
                name: val.name,
                keyframe_animation: val
            }
            this.addAnimation({uuid: id_, val: data})
        }
    }


    /**
     * `onAnimationTimelineDragNDrop` is a function that takes an
     * object with a `uuid`:(animation uuid from slide) and a `to`: (order) property and returns
     * nothing
     */

    onAnimationTimelineDragNDrop = ({uuid, to}) => {
        const {app} = this.prop;
        app.onAnimationOrderChanged({uuid, to})
    }

    onObjectPropsChanged = ({uuid, key, val, type}) => {
        switch (type) {
            case TYPES.MESH:
                this.notifyApp({type: EDITOR_OPS.UPDATE_MESH, data: {uuid, key, val}})
                break
            case TYPES.MATERIAL:
                this.notifyApp({type: EDITOR_OPS.UPDATE_MATERIAL, data: {uuid, key, val}})
                break
            default:
                console.error("No such type handled on onObjectPropsChanged method", type)
        }
    }

    onDeleteAnimationClicked = ({uuid})=>{
        this.deleteAnimation({uuid})
    }

    render() {
        const {selectedItems, graph, refGraph, animations} = this.state;
        const {isXR, otherUsers} = this.props;
        return (
            <div>
                <div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <MenuBar onLightSelected={this.onAddLightSelected}
                            onMeshSelected={this.onAddMeshSelected}
                            onGroupSelected={this.onAddGroupSelected}
                        />

                        <input type="file" onChange={this.onModelUpload} />
                    </div>

                </div>


                <PropsEditor isXR={isXR} selectedItems={selectedItems} refs={refGraph}
                             animations={animations}
                             onAnimationDelete={this.onDeleteAnimationClicked}
                             onObjectPropsChanged={this.onObjectPropsChanged}/>

                {/*<AnimationTree slides={animations} onDragAndDrop={this.onAnimationTimelineDragNDrop}/>*/}
                <VRButton/>
                <div style={{height: window.innerHeight}}>
                    <Canvas legacy={false}
                        camera={{
                            fov: 50, aspect: 1,
                            near: 0.01, far: 1000,
                            position: [0, 5, 10],
                        }}
                        onPointerMissed={this.onPointerMissed}>
                        <XR>
                            {/* FOr the XR controllers ray visibility */}
                            <Controllers
                                /** Optional material props to pass to controllers' ray indicators */
                                rayMaterial={{ color: 'blue' }}
                                /** Whether to hide controllers' rays on blur. Default is `false` */
                                hideRaysOnBlur={false}
                            />
                            {/* Initial Setting for grid, light and background color */}
                            <color attach="background" args={["#111"]} />
                            <ambientLight intensity={2} />
                            <pointLight position={[20, 10, -10]} intensity={2} />
                            {/* <primitive object={new THREE.AxesHelper(10, 10)} />
                            <primitive object={new THREE.GridHelper(6, 5)} /> */}

                            {/* <VRMenuBar onLightSelected={this.onAddLightSelected}
                                onMeshSelected={this.onAddMeshSelected}
                                onGroupSelected={this.onAddGroupSelected} /> */}

                            <MeshMenuBar onLightSelected={this.onAddLightSelected}
                                onMeshSelected={this.onAddMeshSelected}
                                onGroupSelected={this.onAddGroupSelected} />

                            <LightMenuBar onLightSelected={this.onAddLightSelected}
                                onMeshSelected={this.onAddMeshSelected}
                                onGroupSelected={this.onAddGroupSelected} />



                            <DisplayUsers otherUsers={otherUsers} />

                            <AnimationList isXR={isXR} refs={refGraph}
                                selectedItems={selectedItems}
                                onClick={this.onAnimationListClicked} />
                            <Helpers refs={refGraph} selectedItems={selectedItems} onSelect={this.onSelect} />

                            <Ground />

                            {/*{*/}
                            {/*    !isXR &&*/}
                            {/*    <Selection setEnd={setEnd} setSelection={setSelection}*/}
                            {/*               setStart={setStart} setSelecting={setSelecting}/>*/}
                            {/*}*/}
                            <TransformControls ref={this.transformRef} visible={selectedItems.length > 0}
                                onObjectChange={(e) => this.onPositionChange(e)} />
                            {
                                Object.entries(graph).map(([uuid, item]) => {
                                    return (
                                        <VRItem uuid={uuid} onSelect={this.onSelect} onPositionChange={this.onPositionChange}>
                                            {item}
                                        </VRItem>
                                    )
                                })

                            }

                            {/*<>*/}
                            {/*    <ambientLight ref={directionalLightRef} args={[0x505050]}/>*/}
                            {/*</>*/}
                            <Controls makeDefault />
                            <GizmoHelper
                                alignment="bottom-right" // widget alignment within scene
                                margin={[80, 80]} // widget margins (X, Y)
                            >
                                <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
                            </GizmoHelper>
                        </XR>
                    </Canvas>
                </div>
            </div>
        )

    }

}