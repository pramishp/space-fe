import * as React from "react";
import * as THREE from 'three';


import {useState, useEffect, useRef, createRef, useCallback, useMemo} from "react";
import {
    ANIMATION_TYPES,
    BASIC_LIGHTS,
    BASIC_OBJECTS,
    EDITOR_OPS,
    FILE_TYPES,
    BACKGROUND_TYPES,
    gltf2json,
    mesh2json,
    TYPES
} from "./constants";

import MenuBar from "./components/MenuBar";
import { Canvas, useFrame } from "@react-three/fiber";
import { XR, VRButton, Controllers } from '@react-three/xr';
import { gltf2JSX, sampleJson, toJSX, toSceneJSX } from "../../common/loaders/loader";
import { OrbitControls, TransformControls, GizmoHelper, GizmoViewport, useTexture } from "@react-three/drei";
import { Selection } from "./Selection";
import Controls from "./Controls";
import Ground from "./components/Ground";

import {loadGltf, loadGltfFromUrl} from "../../common/loaders/FileLoaders";
import {ANIMATION_TRIGGERS, ANIMATION_LIFE_TYPES, IMPORT_MESH_TYPES} from "../../common/consts";


import Helpers from "./Helpers";
import PropsEditor from "./components/PropsEditor";
import AnimationList from "./components/AnimationEditor/AnimationList";
import { AnimationTree } from "./components/AnimationEditor/AnimationSequenceEditor";
import DisplayUsers from "./components/DisplayUsers";

import { generateUniqueId } from "../../utils";

import MeshMenuBar from "./components/VRMenuBar/MeshMenuBar";
import LightMenuBar from "./components/VRMenuBar/LightMenuBar";

import VRItem from "./components/VRItem";
import { Quaternion, Scene, ShaderMaterial } from "three";
import SideMenu from "./SideMenu";
import { Stars } from "@react-three/drei";
import { valuesIn } from "lodash";

export default class Editor extends React.Component {

    constructor(props) {
        super(props);
        this.notifyApp = this.notifyApp.bind(this);
        this.onVRTransformReleased = this.onVRTransformReleased.bind(this);

        this.transformModes = ['translate', 'rotate', 'scale']
        // mesh click callback
        this.clickCallbacks = {
            onClick: this.onMeshClickCallback,
            onDoubleClick: this.onMeshDoubleClick,
            onContextMenu: this.onMeshContextMenu
        };
        this.jsxData = toJSX(props.initData, this.clickCallbacks);
        this.backgroundData = {jsxs:{}, refs:{}}
        /*
        * editorModes
        * 0: edit
        * 1: animation
        * in the animation mode, the transform control is disabled
        * */
        this.state = {
            rerender: false,
            selectedItems: [],
            graph: this.jsxData.jsxs,
            refGraph: this.jsxData.refs,
            backgroundGraph: this.backgroundData.jsxs,
            refBackgroundGraph: this.backgroundData.refs,
            animations: props.initData.animations,
            transformMode: 0,
            editorMode: 0,
            itemToBeAnimated: null,
        }
        this.transformRef = React.createRef();

        this.loadInitialObjectFiles(this.props);
        // this.backgroundTexture = null
        // this.testBackgroundTexture()


    }

    loadInitialObjectFiles = (props) => {
        const { initData } = props;
        if (!initData.objects) {
            return
        }
        Object.values(initData.objects).forEach(item => {
            if (item.isFile) {
                const { uuid } = item;
                this.insertMeshFile({ uuid, val: item }, false)
            }
        })
    }

    rerender = () => {
        this.setState(state => ({ rerender: !state.rerender }))
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
            this.loadInitialObjectFiles(nextProps);
            return shouldUpdate
        }
        return true

    }

    componentDidMount() {
        if (this.transformRef && this.transformRef.current && this.transformRef.current._listeners && this.transformRef.current._listeners.mouseUp.length === 1) {
            this.transformRef.current.addEventListener('mouseUp', (e) => this.onTransformReleased(e, this))
        }
    }


    componentDidUpdate(nextProps, nextState, nextContext) {
        if (this.transformRef && this.transformRef.current && this.transformRef.current._listeners && this.transformRef.current._listeners.mouseUp.length === 1) {
            this.transformRef.current.addEventListener('mouseUp', (e) => this.onTransformReleased(e, this))
        }
    }

    componentWillUnmount() {
        if (this.transformRef && this.transformRef.current && this.transformRef.current._listeners) {
            delete this.transformRef.current._listeners['mouseUp'][-1]
        }

        //dispose primitive objects
        const { graph, refGraph } = this.state;
        Object.entries(graph).forEach(([uuid, val]) => {
            if (val.type === "primitive") {
                const uuid = val.props.object.uuid;
                if (refGraph[uuid] && refGraph[uuid].current) {
                    console.log('disposing mesh with id: ', uuid)
                    // refGraph[uuid].current.dispose();
                    //TODO: dispose primitive objects
                }
            }
        })
    }


    // set jsx and refs as states variables
    onMeshClickCallback = (e, uuid) => {
        this.onSelect({ uuid, object: e.object });
    }

    onMeshDoubleClick = (e, uuid) => {
        console.log('on mesh double clicked', uuid)
    }

    onMeshContextMenu = (e) => {
        const { transformMode } = this.state;
        const newMode = (transformMode + 1) % this.transformModes.length
        this.setState({ transformMode: newMode })
    }

    // event handler when click is not over any meshes
    onPointerMissed = (e) => {

        this.onDeselect()
    }

    // editor operational methods
    notifyApp = ({ type, data }, notify = true) => {

        const { app } = this.props;
        const { val, uuid, key, op_type, prop_type, extra } = data;

        if (!app) {
            console.error("app is undefined/null ", app)
        }
        // notify is true by default, but for the operations from undo manager, notification are not to be called
        if (!notify) {
            return;
        }

        switch (type) {
            case EDITOR_OPS.INSERT_OBJECT:
                app.onMeshInserted({ uuid, val })
                break

            case EDITOR_OPS.INSERT_OBJECT_FILE:
                app.onMeshFileInserted({ uuid, val: data })
                break

            case EDITOR_OPS.DELETE_MESH:
                app.onDeleteMesh({ uuid })
                break

            case EDITOR_OPS.UPDATE_MESH:
                app.onUpdateObject({ uuid, key, val })
                break

            case EDITOR_OPS.UPDATE_MATERIAL:
                app.onUpdateMaterial({ uuid, key, val })
                break

            case EDITOR_OPS.ADD_ANIMATION:
                app.onAddAnimation({ uuid, val })
                break

            case EDITOR_OPS.DELETE_ANIMATION:
                app.onDeleteAnimation({ uuid })
                break

            case EDITOR_OPS.UPDATE_ANIMATION:
                app.updateAnimation({uuid, key, val})
                break

            case EDITOR_OPS.ADD_BACKGROUND:
                // FIX: 3
                app.onBackgroundAdded({ prop_type, op_type, val })
                break;
                // console.log('editor operations add background')
            //app.onBackgroundChanged({ op_type })

            default:
                console.error("No such operation is defined in editor: ", type)
        }
    }

    // insertMesh in the editor

    insertMesh = ({ uuid, val }, notify = true) => {
        const { jsxs: localJsxs, refs: localRefs } = toJSX(val, this.clickCallbacks);
        // console.log('gltf jsx', localJsxs)

        this.setState(prevState => ({
            graph: { ...prevState.graph, ...localJsxs },
            refGraph: { ...prevState.refGraph, ...localRefs }
        }))
        console.log('localjsxs, localrefs', localJsxs, localRefs)
        // // if same user insert a mesh, select inserted mesh
        // if (notify) {
        //     this.setState(prevState => ({selectedItems: [uuid]}))
        // }
        //TODO: select local just inserted mesh

        // notify app
        this.notifyApp({ type: EDITOR_OPS.INSERT_OBJECT, data: { val, uuid } }, notify)
    }
    // add the local changes here.
    // in the ref to the scene add a star object then convert it to jsx.
        // FIX: 2
    insertBackground = ({ prop_type, op_type, val }, notify = true) => {
        switch (op_type) {
            case 'star':
                console.log('op_type', op_type);
                console.log('val', val);
                const { jsxs: localJsxs, refs: localRefs } = toSceneJSX({prop_type, op_type, val})
                console.log(localJsxs, localRefs)
                // add to the object.
                // perhaps we don't need the prev state
                this.setState({
                    backgroundGraph: {...localJsxs},
                    backgroundRefGraph: {...localRefs}
                })
        }
        this.notifyApp({ type: EDITOR_OPS.ADD_BACKGROUND, data: { prop_type, op_type, val } }, notify)
    }

    insertMeshFile = ({ uuid, val }, notify = true) => {
        const keys = ['position', 'quaternion', 'scale']

        let ref = React.createRef();
        const { url, type } = val;
        switch (type) {
            case FILE_TYPES.GLTF:

                //load file from url and insert primitive in scene
                function onLoad(gltf) {

                    const { scene, animations } = gltf;
                    scene.uuid = uuid;

                    scene.traverse((object) => {
                        object.uuid = uuid; // Set a custom UUID for each object
                    });

                    const props = {};
                    // if key exists, add those props to primitive
                    keys.forEach(key => {
                        if (val[key]) {
                            props[key] = val[key]
                        } else {
                            // set default props of gltf to val
                            val[key] = scene[key].toArray();
                            props[key] = scene[key].toArray();
                        }
                    })

                    Object.entries(this.clickCallbacks).forEach(([id, callback]) => {
                        props[id] = (e) => callback(e, uuid)
                    })

                    const object = (<primitive ref={ref} object={scene} {...props} />)
                    this.setState(prevState => ({
                        graph: { ...prevState.graph, [uuid]: object },
                        refGraph: { ...prevState.refGraph, [uuid]: ref }
                    }))
                }

                function onError(e) {
                    console.error("Error occured while loading gltf: ", e)
                }

                loadGltfFromUrl(url, onLoad.bind(this), onError)
                break
            default:
                console.log('File type is not supported. ', type)
        }


        // notify app
        this.notifyApp({ type: EDITOR_OPS.INSERT_OBJECT_FILE, data: val }, notify)
    }

    deleteMesh = ({ uuid }, notify = true) => {
        const { app } = this.props;

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
        this.notifyApp({ type: EDITOR_OPS.DELETE_MESH, data: { uuid }, app }, notify)
    }

    // insertLight in the editor
    insertLight = ({ uuid, val }, notify = true) => {


    }

    onPositionChange = (e) => {
        //TODO: listen to release then only sync the changes
        const { selectedItems, refGraph } = this.state;
        if (selectedItems.length === 1) {
            const uuid = selectedItems[0];
            //TODO: debug meshRef is undefined
            const meshRef = refGraph[uuid];
            if (meshRef.current && this.transformRef.current) {
                //TODO: notify workspace using app.onSpatialPropsChanged({position, rotation})
            }
        }
    }

    updateMaterial = ({ uuid, key, val, object_uuid }) => {
        const { refGraph } = this.state;
        const meshRef = refGraph[object_uuid];
        if (meshRef && meshRef.current) {
            const mesh = meshRef.current;
            switch (key) {
                case "linewidth":
                    mesh.material[key] = val;
                    break
                default:
                    mesh.material[key].set(val);
            }
            this.rerender();
        }

    }

    addAnimation = ({ uuid, val }, notify = true) => {
        this.setState((state) => ({
            animations: { ...state.animations, [uuid]: val },
        }))
        this.notifyApp({ type: EDITOR_OPS.ADD_ANIMATION, data: { val, uuid } }, notify)

    }

    deleteAnimation = ({ uuid }, notify = true) => {
        this.setState((state) => {
            const animations = state.animations;
            delete animations[uuid]
            return { ...animations }
        });
        this.notifyApp({ type: EDITOR_OPS.DELETE_ANIMATION, data: { uuid } }, notify)

    }

    // onSelect
    onSelect = ({ uuid, object }) => {
        const mesh = object;
        const {selectedItems, editorMode, itemToBeAnimated} = this.state;
        const {transformRef} = this;
        if (editorMode === 1) {
            // this is animation mode

            // set animation path
            this.setPathAnimation({uuid: itemToBeAnimated, path_uuid: uuid})

            //go back to editor mode
            this.enterEditorMode();
            return
        }

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
        if (!Object.keys(BASIC_OBJECTS).includes(id)) {
            console.error(`No ${id} in BASIC_OBJECTS`)
        }

        const {uuid, val} = BASIC_OBJECTS[id].get();
        this.insertMesh({uuid, val});


    }

    onAddLightSelected = (id) => {
        const { uuid, val } = BASIC_LIGHTS[id].get();

        const jsonData = {
            [uuid]: {
                ...val.object
            }
        }
        const fullData = {
            "objects": jsonData
        }

        this.insertMesh({ uuid, val: fullData });

    }

    onAddGroupSelected = (id) => {
        const { uuid, val } = BASIC_LIGHTS[id];
    }
    // set a selected type then call something like insertBackground
    // here we need to set params as well. Or we can set the default params and then change it as done in the mesh implementations.
    //FIX: 1
    onAddBackgroundSelected = (id) => {
        console.log('id', id)
        const {prop_type, op_type, val} = BACKGROUND_TYPES[id];
        console.log(prop_type, op_type, val)
        this.insertBackground({ prop_type, op_type, val });
    }

    // upload model
    // NOTE: thrrejs gtlf loader
    onModelUpload = (url) => {
        console.log(url)
        // const {app} = this.props;
        // const file = e.target.files[0];
        const uuid = THREE.MathUtils.generateUUID();
        this.insertMeshFile({ uuid, val: { type: FILE_TYPES.GLTF, url, uuid } })

    }

    // onAnimation clicked

    /* A function that is called when an animation is clicked in the animation list. */
    onAnimationListClicked = ({ uuid, val }) => {
        // obtained uuid is of the animation that is clicked

        // generate unique uuid
        const id_ = generateUniqueId();
        const { selectedItems } = this.state;
        const mesh_uuid = selectedItems.length > 0 ? selectedItems[0] : null;
        if (mesh_uuid) {
            //TODO: determine order, triggers
            const data = {
                uuid: id_,
                type: ANIMATION_LIFE_TYPES.INFINITY,
                trigger: ANIMATION_TRIGGERS.ON_SLIDE_CHANGE,
                object_uuid: mesh_uuid,
                order: 0,
                name: val.name,
                animationType: ANIMATION_TYPES.KEYFRAME,
                keyframe_animation: val
            }
            this.addAnimation({ uuid: id_, val: data })
        }
    }


    setPathAnimation({uuid, path_uuid}) {

        const {refGraph} = this.state;
        const meshRef = refGraph[uuid];
        const pathRef = refGraph[path_uuid];

        if (!meshRef.current || !pathRef.current){
            console.error('No such mesh or path reference found to set animation path')
        }
        const mesh = meshRef.current;
        const path = pathRef.current;

        const animationUUID = generateUniqueId();
        const val = {
            animationType: ANIMATION_TYPES.PATH,
            uuid: animationUUID,
            trigger: ANIMATION_TRIGGERS.ON_SLIDE_CHANGE,
            type: ANIMATION_LIFE_TYPES.INFINITY,
            order: 0,
            name: 'Path',
            object_uuid: uuid,
            path_animation: {
                path_uuid: path_uuid
            }

        }

        this.addAnimation({uuid: animationUUID, val})

    }

    //TODO: updateAnimation method

    onAnimationTimeScaleChange = ({uuid, timeScale})=>{
        //TODO: apply animation scale change locally
        this.notifyApp({type: EDITOR_OPS.UPDATE_ANIMATION, data: {uuid, key: "timeScale", val: timeScale}})
    }

    /**
     * `onAnimationTimelineDragNDrop` is a function that takes an
     * object with a `uuid`:(animation uuid from slide) and a `to`: (order) property and returns
     * nothing
     */

    onAnimationTimelineDragNDrop = ({ uuid, to }) => {
        const { app } = this.prop;
        app.onAnimationOrderChanged({ uuid, to })
    }


    onObjectPropsChanged = ({uuid, key, val}) => {
        this.updateObject({uuid, key, val})
        this.notifyApp({type: EDITOR_OPS.UPDATE_MESH, data: {uuid, key, val}})
    }

    onMaterialPropsChanged = ({uuid, object_uuid, key, val}) => {
        this.updateMaterial({uuid, object_uuid, key, val});
        this.notifyApp({type: EDITOR_OPS.UPDATE_MATERIAL, data: {uuid, key, object_uuid, val}})

    }

    onDeleteAnimationClicked = ({uuid}) => {
        this.deleteAnimation({uuid})
    }

    updateObject = ({ uuid, key, val }) => {
        const { refGraph } = this.state;
        if (!(refGraph[uuid] && refGraph[uuid].current)) {
            console.error(`Object of uuid - ${uuid} not found to update the mesh`)
        }
        const object = refGraph[uuid].current;
        switch (key) {
            case "position":
                object.position.fromArray(val);
                break
            case "quaternion":
                const quaternion = new Quaternion().fromArray(val);
                // object.setRotationFromQuaternion(quaternion);
                object.quaternion.fromArray(val);
                break
            case "rotation":
                // object.rotation.fromArray([0,0,0, "XYZ"]);
                object.rotation.fromArray(val);
                break
            case "scale":
                object.scale.fromArray(val);
                this.rerender()
                break
            case "geometry":
                break
            case "material":
                break
            default:
                if (object.type.indexOf("Light") !== -1) {
                    // object is a light
                    if (key === "color") {
                        // use set method
                        object.color.set(val)
                    } else {
                        object[key] = val
                    }
                }
                this.rerender()
        }
    }

    onTransformReleased({ mode, target }) {
        if (!target.object) {
            console.error('no object selected to transform')
        }

        const selectedItem = target.object.uuid;
        const targetPosition = target.worldPosition;
        const targetScale = target.worldScale;
        const targetRotation = target.object.rotation;
        const targetQuaternion = target.object.quaternion;
        const position = targetPosition.toArray();
        const quaternion = targetQuaternion.toArray();
        const rotation = targetRotation.toArray();
        const scale = targetScale.toArray();
        // const inverseQuaternion = target.worldQuaternionInv.toArray();

        // ['translate', 'rotate', 'scale']
        switch (mode) {
            case "translate":
                this.notifyApp({
                    type: EDITOR_OPS.UPDATE_MESH,
                    data: { uuid: selectedItem, key: "position", val: position }
                })
                break
            case "rotate":
                this.notifyApp({
                    type: EDITOR_OPS.UPDATE_MESH,
                    data: { uuid: selectedItem, key: "quaternion", val: quaternion }
                })
                // this.notifyApp({type: EDITOR_OPS.UPDATE_MESH, data: {uuid: selectedItem, key: "rotation", val: rotation}})
                break
            case "scale":
                this.notifyApp({
                    type: EDITOR_OPS.UPDATE_MESH,
                    data: {uuid: selectedItem, key: "scale", val: scale}
                })
                break
            default:
                console.error(`No ${mode} case handled in onTransformReleased`)
        }
    }

    onVRTransformReleased({ uuid, worldPosition, worldQuaternion }) {
        // console.log("worldPOsition , wordQuaterninon : ", worldPosition, worldQuaternion)
        const selectedItem = uuid;
        const targetPosition = worldPosition;
        const targetRotation = worldQuaternion;
        const position = targetPosition.toArray();
        const quaternion = targetRotation.toArray();

        this.notifyApp({ type: EDITOR_OPS.UPDATE_MESH, data: { uuid: selectedItem, key: "position", val: position } })
        this.notifyApp({ type: EDITOR_OPS.UPDATE_MESH, data: { uuid: selectedItem, key: "quaternion", val: quaternion } })

    }
    

    enterAnimationMode() {
        const {selectedItems} = this.state;
        if (selectedItems.length > 0){
            this.setState(state => ({editorMode: 1, itemToBeAnimated: this.state.selectedItems[0]}))
        }
    }

    enterEditorMode() {
        this.setState({editorMode: 0, itemToBeAnimated: null})
    }


    render() {

        const { selectedItems, graph, refGraph, animations, rerender, transformMode, editorMode, backgroundGraph } = this.state;
        const { isXR, otherUsers } = this.props;
        return (
            <div>
                <div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <MenuBar onLightSelected={this.onAddLightSelected}
                            onMeshSelected={this.onAddMeshSelected}
                            onGroupSelected={this.onAddGroupSelected}
                            onBackgroundSelected={this.onAddBackgroundSelected}
                        />

                        <input type="file" onChange={this.onModelUpload} />
                    </div>
                </div>


                <PropsEditor rerender={rerender} isXR={false} selectedItems={selectedItems} refs={refGraph}
                             animations={animations}
                             onAnimationDelete={this.onDeleteAnimationClicked}
                             onMaterialPropsChanged={this.onMaterialPropsChanged}
                             onObjectPropsChanged={this.onObjectPropsChanged}/>

                {/*<AnimationTree slides={animations} onDragAndDrop={this.onAnimationTimelineDragNDrop}/>*/}
                <VRButton />
                <div style={{ height: window.innerHeight }}>
                    <Canvas legacy={false}
                        camera={{
                            fov: 50, aspect: 1,
                            near: 0.01, far: 1000,
                            position: [0, 5, 10],
                        }}

                        onPointerMissed={this.onPointerMissed}
                    >
                        <XR>
                            {/* <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> */}
                            <SideMenu />
                            {/* FOr the XR controllers ray visibility */}
                            <Controllers
                                /** Optional material props to pass to controllers' ray indicators */
                                rayMaterial={{ color: 'blue' }}
                                /** Whether to hide controllers' rays on blur. Default is `false` */
                                hideRaysOnBlur={false}
                            />
                            {/* Initial Setting for grid, light and background color */}
                            {/* TODO: add a texture and attach it as well. */}

                            {/* <primitive attach='background' object={this.backgroundMaterial} /> */}
                            {/* <scene ref={(ref) => (this.sceneRef = ref)} />
                                { this.backgroundTexture && (
                                    <primitive attach="background" object={this.backgroundTexture}/>
                                )} */}
                            <ambientLight intensity={2} />
                            {/* <color attach="background" args={["#000000"]}/> */}
                            {/* {<><color attach="background" args={["#000000"]} /><Stars /></>} */}
                            {/*<pointLight position={[20, 10, -10]} intensity={2}/>*/}

                            {/* <primitive object={new THREE.AxesHelper(10, 10)} />
                            <primitive object={new THREE.GridHelper(6, 5)} /> */}

                            {/* <VRMenuBar onLightSelected={this.onAddLightSelected}
                                onMeshSelected={this.onAddMeshSelected}
                                onGroupSelected={this.onAddGroupSelected} /> */}

                            {/*{true && <PropsEditor rerender={rerender} isXR={true} selectedItems={selectedItems}*/}
                            {/*                      refs={refGraph}*/}
                            {/*                      animations={animations}*/}
                            {/*                      onAnimationDelete={this.onDeleteAnimationClicked}*/}
                            {/*                      onMaterialPropsChanged={this.onMaterialPropsChanged}*/}
                            {/*                      onObjectPropsChanged={this.onObjectPropsChanged}/>}*/}

                            <MeshMenuBar onLightSelected={this.onAddLightSelected}
                                onMeshSelected={this.onAddMeshSelected}
                                onGroupSelected={this.onAddGroupSelected} />

                            <LightMenuBar onLightSelected={this.onAddLightSelected}
                                onMeshSelected={this.onAddMeshSelected}
                                onGroupSelected={this.onAddGroupSelected} />

                            <DisplayUsers otherUsers={otherUsers}/>

                            <AnimationList isXR={isXR} refs={refGraph}
                                           selectedItems={selectedItems}
                                           enterAnimationMode={this.enterAnimationMode.bind(this)}
                                           onClick={this.onAnimationListClicked}/>
                            <Ground/>

                            {/*{*/}
                            {/*    !isXR &&*/}
                            {/*    <Selection setEnd={setEnd} setSelection={setSelection}*/}
                            {/*               setStart={setStart} setSelecting={setSelecting}/>*/}
                            {/*}*/}

                            <TransformControls ref={this.transformRef} visible={selectedItems.length > 0}
                                               enabled={editorMode === 0}
                                               mode={this.transformModes[transformMode]}
                                               onObjectChange={(e) => this.onPositionChange(e)}
                            />
                            {                                
                                Object.entries(graph).map(([uuid, item]) => {
                                    return (
                                        <VRItem uuid={uuid} onSelect={this.onSelect}
                                            onObjectPropsChanged={this.onObjectPropsChanged}
                                            onVRTransformReleased={this.onVRTransformReleased}>
                                            {item} selectedItems={selectedItems}
                                        </VRItem>
                                    )
                                })
                            }
                            {
                                backgroundGraph && Object.entries(backgroundGraph).map(([uuid, val]) => {
                                    console.log(uuid, val)
                                    return (
                                        val
                                    )
                                })
                            }
                            

                            


                            <Helpers refs={refGraph} graph={graph} selectedItems={selectedItems}
                                     onSelect={this.onSelect} clickCallbacks={this.clickCallbacks}/>
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
