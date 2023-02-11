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

export default class Editor extends React.Component {

    constructor(props) {
        super(props);
        // mesh click callback
        this.clickCallbacks = {onClick: this.onMeshClickCallback, onDoubleClick: this.onMeshDoubleClick};

        this.jsxData = toJSX(props.initData, this.clickCallbacks);
        this.state = {
            selectedItems: [],
            graph: this.jsxData.jsxs,
            refGraph: this.jsxData.refs,
        }
        //user
        this.userId = this.props.app.user.userId;
        this.transformRef = React.createRef();
    }

    // set jsx and refs as states variables
    onMeshClickCallback = (e, uuid) => {
        this.onSelect({uuid, object: e.object});
    }

    onMeshDoubleClick = (e, uuid) => {
        console.log('on mesh double clicked', uuid)
    }

    // event handler when click is not over any meshes
    onPointerMissed = (e) => {
        this.onDeselect()
    }

    // editor operational methods
    notifyApp = ({type, data}) => {
        const {app} = this.props;
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
            case EDITOR_OPS.INSERT_MESH:
                app.onMeshInserted({uuid: uuid, val})
                break
            default:
                console.error("No such operation is defined in editor: ", type)
        }
    }

    // insertMesh in the editor
    insertMesh = ({uuid, val, userId}) => {
        const {app} = this.props;
        const {jsxs: localJsxs, refs: localRefs} = toJSX(val, this.clickCallbacks);

        this.setState(prevState => ({
            graph: {...prevState.graph, ...localJsxs},
            refGraph: {...prevState.refGraph, ...localRefs}
        }))

        // if same user insert a mesh, select inserted mesh
        if (userId === app.user.userId) {
            this.setState(prevState => ({selectedItems: [uuid]}))
        }

        // notify app
        this.notifyApp({type: EDITOR_OPS.INSERT_MESH, data: {val, userId, uuid}, app})
    }

    // insertLight in the editor
    insertLight = ({uuid, val, userId}) => {
        const jsonData = {
            [uuid]: {
                ...val.object
            }
        }
        const fullData = {
            "objects": jsonData
        }

        this.insertMesh({uuid, val: fullData, userId});

    }

    onPositionChange = (e) => {
        const {selectedItems, refGraph} = this.state;
        if (selectedItems.length === 1) {
            const uuid = selectedItems[0];
            const meshRef = refGraph[uuid];
            if (meshRef.current && this.transformRef.current) {
                // meshRef.current.position.x = transformRef.current.worldPosition.x;
                // meshRef.current.position.y = transformRef.current.worldPosition.y;
                // meshRef.current.position.z = transformRef.current.worldPosition.z;
            }
        }

    }

    // onSelect
    onSelect = ({uuid, object}) => {
        const mesh = object;
        const {selectedItems} = this.state;
        const {transformRef} = this;
        if ((selectedItems.length === 1 && uuid !== selectedItems[0]) || selectedItems.length === 0) {
            if (transformRef.current && mesh) {
                transformRef.current.attach(mesh);
                // also set rotation
            }
            this.setState(prevState => ({selectedItems: [uuid]}))

        }

    }

    onDeselect = () => {
        const {transformRef} = this;

        // hide transform Control
        if (transformRef.current) {
            transformRef.current.detach();
        }
        this.setState(prevState => ({selectedItems: []}))

    }

    // onMeshSelected, onLightSelected, onGroupSelected
    onAddMeshSelected = (id) => {
        const {app} = this.props;
        if (!Object.keys(BASIC_OBJECTS).includes(id)) {
            console.error(`No ${id} in BASIC_OBJECTS`)
        }
        const {uuid, val} = BASIC_OBJECTS[id].get();
        this.insertMesh({uuid, val, userId: app.user.userId});
    }
    onAddLightSelected = (id) => {
        const {app} = this.props;
        const {uuid, val} = BASIC_LIGHTS[id].get();
        this.insertLight({uuid, val, userId: app.user.userId})
    }

    onAddGroupSelected = (id) => {
        const {uuid, val} = BASIC_LIGHTS[id];
        // insertMesh({uuid, val, userId: app.user.userId})
    }

    // upload model
    onModelUpload = (e) => {
        const {app} = this.props;
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
                    this.insertMesh({uuid, val: gltf, userId: app.user.userId})
                },
                (error) => {
                    console.log(error)
                })
        };
    }

    // onAnimation clicked
    onAnimationListClicked = ({uuid, val}) => {

    }

    /**
     * `onAnimationTimelineDragNDrop` is a function that takes an
     * object with a `uuid`:(animation uuid from slide) and a `to`: (order) property and returns
     * nothing
     */
    onAnimationTimelineDragNDrop = ({uuid, to}) => {

    }

    render() {
        const {selectedItems, graph, refGraph} = this.state;
        const {isXR, slideData, app} = this.props;
        return (
            <div>
                <div>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <MenuBar onLightSelected={this.onAddLightSelected}
                                 onMeshSelected={this.onAddMeshSelected}
                                 onGroupSelected={this.onAddGroupSelected}
                        />

                        <input type="file" onChange={this.onModelUpload}/>
                    </div>


                </div>

                <PropsEditor isXR={isXR} selectedItems={selectedItems} refs={refGraph}/>
                <AnimationTree slides={slideData} onDragAndDrop={this.onAnimationTimelineDragNDrop}/>
                <div style={{height: window.innerHeight}}>
                    <Canvas legacy={false}
                            camera={{
                                fov: 50, aspect: 1,
                                near: 0.01, far: 1000,
                                position: [0, 5, 10],
                            }}
                            onPointerMissed={this.onPointerMissed}>
                        <XR>
                            <AnimationList isXR={isXR} refs={refGraph}
                                           selectedItems={selectedItems}
                                           onClick={this.onAnimationListClicked}/>
                            <Helpers refs={refGraph} selectedItems={selectedItems} onSelect={this.onSelect}/>

                            <Ground/>

                            {/*{*/}
                            {/*    !isXR &&*/}
                            {/*    <Selection setEnd={setEnd} setSelection={setSelection}*/}
                            {/*               setStart={setStart} setSelecting={setSelecting}/>*/}
                            {/*}*/}
                            <TransformControls ref={this.transformRef} visible={selectedItems.length > 0}
                                               onObjectChange={(e) => this.onPositionChange(e)}/>
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

}