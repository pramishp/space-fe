/*
*
* Takes JSON from Yjs internal data structure and converts into JSX with refs to all the mesh
*
*  */
import * as THREE from 'three';
import * as React from 'react';
import {AnimationClip, DirectionalLightHelper} from "three";
import {ANIMATION_TRIGGERS, ANIMATION_LIFE_TYPES, IMPORT_MESH_TYPES} from "../consts";
import {Line, Stars} from "@react-three/drei";

const _ = require('lodash')

export const sampleJson = {

    shapes: {},
    animations: {
        'd7fbf2ba-b04c-4f59-acbd-6c5563d8b53d': {
            name: 'position',
            duration: 3,
            tracks: [
                {
                    name: '.position',
                    times: [0, 1, 2],
                    values: [
                        2, 0, 0, 3, 0,
                        0, 2, 0, 0
                    ],
                    type: 'vector'
                }
            ],
            uuid: 'd7fbf2ba-b04c-4f59-acbd-6c5563d8b53d',
            blendMode: 2500
        },
        'd77c5fc4-f70b-4ec3-ace7-3dd187185451': {
            name: 'scale',
            duration: 3,
            tracks: [
                {
                    name: '.scale',
                    times: [0, 1, 2],
                    values: [
                        1, 1, 1, 2, 2,
                        2, 1, 1, 1
                    ],
                    type: 'vector'
                }

            ],
            uuid: 'd77c5fc4-f70b-4ec3-ace7-3dd187185451',
            blendMode: 2500
        },
        "fc0a8baa-2226-49b9-989b-3ddfc3051a84": {
            name: 'rotation',
            duration: 3,
            tracks: [
                {
                    name: '.quaternion',
                    times: [0, 1, 2],
                    values: [0, 0, 0, 1, 1, 0, 0, 6.123234262925839e-17, 0, 0, 0, 1],
                    type: 'quaternion'
                }

            ],
            uuid: 'fc0a8baa-2226-49b9-989b-3ddfc3051a84',
            clampWhenFinished: true,
            blendMode: 2500
        }


    },
    geometries: {
        'f7cb7dbc-12bd-4549-acd0-d8e313217d23': {
            uuid: 'f7cb7dbc-12bd-4549-acd0-d8e313217d23',
            type: 'BoxGeometry',
            width: 10,
            height: 10,
            depth: 10,
            widthSegments: 1,
            heightSegments: 1,
            depthSegments: 1

        },
        'g7cb7dbc-12bd-4549-acd0-d8e313217d23': {
            uuid: 'g7cb7dbc-12bd-4549-acd0-d8e313217d23',
            type: 'BoxGeometry',
            width: 10,
            height: 10,
            depth: 10,
            widthSegments: 1,
            heightSegments: 1,
            depthSegments: 1

        }
    },
    images: {},
    textures: {},
    materials: {
        '4fe98168-1558-4541-bc2c-e457d62f21fd': {
            uuid: '4fe98168-1558-4541-bc2c-e457d62f21fd',
            type: 'MeshBasicMaterial',
            color: 65280,
            reflectivity: 1,
            refractionRatio: 0.98,
            depthFunc: 3,
            depthTest: true,
            depthWrite: true,
            colorWrite: true,
            stencilWrite: false,
            stencilWriteMask: 255,
            stencilFunc: 519,
            stencilRef: 0,
            stencilFuncMask: 255,
            stencilFail: 7680,
            stencilZFail: 7680,
            stencilZPass: 7680

        },
        '5fe98168-1558-4541-bc2c-e457d62f21fd': {
            uuid: '5fe98168-1558-4541-bc2c-e457d62f21fd',
            type: 'MeshBasicMaterial',
            color: 55280,
        }
    },
    skeletons: {},
    objects: {
        cube1: {
            uuid: 'cube1',
            type: 'Mesh',
            geometry: 'f7cb7dbc-12bd-4549-acd0-d8e313217d23',
            material: '4fe98168-1558-4541-bc2c-e457d62f21fd',
            position: [2, 0, 0],
            rotation: [1, 2, 3],
        },
        // cube2: {
        //     uuid: 'cube2',
        //     type: 'Mesh',
        //     geometry: 'g7cb7dbc-12bd-4549-acd0-d8e313217d23',
        //     material: '5fe98168-1558-4541-bc2c-e457d62f21fd',
        //     position: [0, 0, 0],
        //     rotation: [0, 0, 0],
        // },
    },
    slides: {
        'uuid-834kjasf': {
            uuid: "uuid-834kjasf",
            order: 0,
            animations: {
                'uuid-9834ukajshdf': {
                    uuid: 'uuid-9834ukajshdf',
                    type: ANIMATION_LIFE_TYPES.LOOP_ONCE,
                    trigger: ANIMATION_TRIGGERS.ON_SLIDE_CHANGE,
                    object_uuid: 'cube1',
                    animation_uuid: "d7fbf2ba-b04c-4f59-acbd-6c5563d8b53d", // position
                    order: 0,
                },
                'uuid-345kjh345': {
                    uuid: 'uuid-345kjh345',
                    type: ANIMATION_LIFE_TYPES.LOOP_ONCE,
                    trigger: ANIMATION_TRIGGERS.ON_SLIDE_CHANGE,
                    object_uuid: 'cube2',
                    animation_uuid: "d77c5fc4-f70b-4ec3-ace7-3dd187185451", // scale
                    order: 0
                },
                'uuid-892374-ert': {
                    uuid: 'uuid-892374-ert',
                    type: ANIMATION_LIFE_TYPES.LOOP_ONCE,
                    object_uuid: 'cube1',
                    trigger: ANIMATION_TRIGGERS.ON_KEY_PRESSED,
                    animation_uuid: "fc0a8baa-2226-49b9-989b-3ddfc3051a84", //rotation
                    order: 1
                },
                'uuid-345kjh346': {
                    uuid: 'uuid-345kjh346',
                    type: ANIMATION_LIFE_TYPES.LOOP_ONCE,
                    trigger: ANIMATION_TRIGGERS.ON_KEY_PRESSED,
                    object_uuid: 'cube1',
                    animation_uuid: "d77c5fc4-f70b-4ec3-ace7-3dd187185451", // scaling
                    order: 2
                },
                'uuid-345kjh348': {
                    uuid: 'uuid-345kjh348',
                    type: ANIMATION_LIFE_TYPES.INFINITY,
                    trigger: ANIMATION_TRIGGERS.ON_ANIMATION_END,
                    object_uuid: 'cube2',
                    animation_uuid: "d7fbf2ba-b04c-4f59-acbd-6c5563d8b53d", // position
                    order: 2
                },
                'uuid-345kjh347': {
                    uuid: 'uuid-345kjh347',
                    type: ANIMATION_LIFE_TYPES.INFINITY,
                    trigger: ANIMATION_TRIGGERS.ON_ANIMATION_END,
                    object_uuid: 'cube1',
                    animation_uuid: "fc0a8baa-2226-49b9-989b-3ddfc3051a84", // rotation
                    order: 3
                },
                'uuid-345kjh349': {
                    uuid: 'uuid-345kjh349',
                    type: ANIMATION_LIFE_TYPES.INFINITY,
                    trigger: ANIMATION_TRIGGERS.ON_ANIMATION_END,
                    object_uuid: 'cube2',
                    animation_uuid: "d77c5fc4-f70b-4ec3-ace7-3dd187185451", // scaling
                    order: 3
                },
                'uuid-345kjh350': {
                    uuid: 'uuid-345kjh350',
                    type: ANIMATION_LIFE_TYPES.LOOP_ONCE,
                    trigger: ANIMATION_TRIGGERS.ON_ANIMATION_END,
                    object_uuid: 'cube1',
                    animation_uuid: "d7fbf2ba-b04c-4f59-acbd-6c5563d8b53d", // position
                    order: 4
                },

            }


        }
    }

}
export function toSceneJSX({prop_type, op_type, val}) {
    const data = {...val}
    console.log('data',data)
    const jsxs = {};
    let refs = {};
    let ref = React.createRef()
    refs[prop_type] = ref
    let object
    if (prop_type === 'background') {
        switch (op_type) {
            case 'star':
                object = (
                    <Stars ref={ref} {...val} />
                )
                break;
        
            default:
                break;
        }
    }
    console.log('to background jsx data', data)
    jsxs[prop_type] = object
    console.log(jsxs, refs)
    return {jsxs, refs}
}
export function toJSX(val, clickCallbacks) {
    const data = {...val}
    const jsxs = {};
    let refs = {};

    // if (data.type && data.type === IMPORT_MESH_TYPES.GLTF_GROUP) {
    //     //TODO: traverse through all the children and not use primitive item
    //     const {jsx, ref} = gltf2JSX(data, clickCallbacks)
    //     return {jsxs: jsx, refs: ref}
    // }
    if (val.isFile) {
        return {jsxs, refs}
    }

    if (!data.objects) {
        return {jsxs, refs}
    }

    Object.values(data.objects).forEach(item => {
        if (item.isFile) {
            return {refs, jsxs}
        }
        let object, geometry, material;
        var ref = React.createRef();
        refs[item.uuid] = ref;

        // required to see effects of light in the scene
        item.layers = 0;

        const callbackProps = {}

        if (clickCallbacks) {
            // set callbacks
            Object.entries(clickCallbacks).forEach(([id, callback]) => {
                callbackProps[id] = (e) => callback(e, item.uuid)
            })
        }
        switch (item.type) {
            case 'Mesh':
                geometry = getGeometry(data.geometries, item.geometry)
                material = getMaterial(data.materials, item.material)
                object = (
                    <mesh key={item.uuid} ref={ref} {...item} {...callbackProps}>
                        {geometry}
                        {material}
                    </mesh>
                )
                break;

            case 'AmbientLight':
                object = <ambientLight key={item.uuid}
                                       ref={ref} args={[item.color, item.intensity]}
                                       {...callbackProps}
                                       {...item}/>
                break;

            case 'DirectionalLight':

                object = <directionalLight key={item.uuid} ref={ref}
                                           args={[item.color, item.intensity]}
                                           {...callbackProps}
                                           {...item}/>
                break;

            case 'PointLight':

                object = <pointLight ref={ref} key={item.uuid}
                                     args={[item.color, item.intensity, item.distance, item.decay]}
                                     {...callbackProps}
                                     {...item}/>

                break;

            case 'RectAreaLight':

                object = <rectAreaLight ref={ref} key={item.uuid}
                                        args={[item.color, item.intensity, item.width, item.height]}
                                        {...callbackProps}
                                        {...item}/>

                break;

            case 'SpotLight':

                object = <spotLight ref={ref} key={item.uuid}
                                    args={[item.color, item.intensity, item.distance, item.angle, item.penumbra, item.decay]}
                                    {...callbackProps}
                                    {...item}
                />

                break;

            case 'HemisphereLight':

                object = <hemisphereLight ref={ref} key={item.uuid}
                                          args={[item.color, item.groundColor, item.intensity]}
                                          {...callbackProps}
                                          {...item}/>

                break;
            case IMPORT_MESH_TYPES.GLTF_GROUP:
            case 'Group':
                // object = (<primitive ref={ref} object={scene} position={[0, 0, 0]} {...callbackProps} />)
                let refs = []
                item.children.forEach(i => {
                    const fullData = {
                        geometries: data.geometries,
                        materials: data.materials,
                        objects: {[i.uuid]: i}
                    }
                    const {jsxs} = toJSX(fullData, clickCallbacks)
                    refs = [...refs, ...Object.values(jsxs)]
                })
                object = <group key={item.uuid} ref={ref} {...callbackProps} {...item}>
                    {
                        refs.map(i => i)
                    }
                </group>
                // console.log('imported mesh jsx', object)
                break

            case 'Line':

                geometry = _.find(data.geometries, {uuid: item.geometry})
                geometry = getGeometry(data.geometries, item.geometry)
                material = getMaterial(data.materials, item.material)

                object = (
                    <line key={item.uuid}
                          ref={ref}
                          {...item}>
                        {geometry}
                        {material}
                    </line>
                )
                break;

            case 'LineLoop':
                geometry = getGeometry(data.geometries, item.geometry)
                material = getMaterial(data.materials, item.material)
                object = (
                    <lineLoop key={item.uuid} ref={ref} {...item} {...callbackProps}>
                        {geometry}
                        {material}
                    </lineLoop>
                )
                break;

            case 'LineSegments':
                geometry = getGeometry(data.geometries, item.geometry)
                material = getMaterial(data.materials, item.material)
                object = (
                    <lineSegments key={item.uuid} ref={ref} {...item} {...callbackProps}>
                        {geometry}
                        {material}
                    </lineSegments>
                )
                break;

            default:
                console.error('no case found to parse ', val)
        }
        jsxs[item.uuid] = object;

    })
    return {jsxs, refs};
}

/**
 * Return geometry
 * @param {json} geometries - geometries containing geometry
 * @param {string} id - geometry id
 * */

function getGeometry(geometries, id) {

    if (geometries[id] === undefined) {

        console.warn('THREE.ObjectLoader: Undefined geometry', id);

    }

    const geomData = geometries[id];

    switch (geomData.type) {
        case 'BoxGeometry':
            return <boxGeometry key={geomData.uuid} {...geomData}/>
        case 'SphereGeometry':
            return <sphereGeometry key={geomData.uuid} {...geomData}/>
        case 'CylinderGeometry':
            return <cylinderGeometry key={geomData.uuid} {...geomData}/>
        case 'PlaneGeometry':
            return <planeGeometry key={geomData.uuid} {...geomData}/>
        case 'BufferGeometry':
            const {data} = geomData;
            // console.log('geomData', geomData)
            return (
                <bufferGeometry key={geomData.uuid} attach={"geometry"}>
                    {Object.entries(data.attributes).map(([key, val]) => {
                        let {array, itemSize} = val;
                        array = new Float32Array(array);
                        return <bufferAttribute
                            attach={`attributes-${key}`}
                            array={array}
                            count={array.length / itemSize}
                            itemSize={itemSize}
                        />
                    })}
                </bufferGeometry>
            )
        default:
            console.error('geometry not defined')
    }


}

/**
 * Returns material
 * @param {json} materials - json containing materials info
 * @param {Array<string>} ids - single id or list of material ids
 * */
function getMaterial(materials, ids) {
    if (ids === undefined) return undefined;

    if (Array.isArray(ids)) {

        const array = [];

        for (let i = 0, l = ids.length; i < l; i++) {

            const uuid = ids[i];

            if (materials[uuid] === undefined) {

                console.warn('THREE.ObjectLoader: Undefined material', uuid);

            }

            let material = getMaterialJSX(materials[uuid])
            array.push(material);

        }

        return array;

    }

    if (materials[ids] === undefined) {

        console.warn('THREE.ObjectLoader: Undefined material', ids);

    }

    return getMaterialJSX(materials[ids]);
}

function getMaterialJSX(materialData) {
    if (materialData === undefined) return undefined;
    switch (materialData.type) {
        case "MeshBasicMaterial":
            return <meshBasicMaterial key={materialData.uuid} {...materialData}/>
        case "MeshStandardMaterial":
            return <meshStandardMaterial key={materialData.uuid} {...materialData}/>
        case "LineBasicMaterial":
            return <lineBasicMaterial key={materialData.uuid} {...materialData}/>
        default:
            console.error('Material not defined')
    }
}


export function parseAnimations(json) {

    const animations = {};

    if (json !== undefined) {
        Object.entries(json).forEach(([id, val]) => {
            const clip = AnimationClip.parse(val);
            animations[clip.uuid] = clip;
        })
    }

    return animations;

}

export function gltf2JSX(gltf, clickCallbacks) {
    const jsx = {}
    const ref = {}
    const {scene, animations} = gltf;
    const uuid = scene.uuid;
    const primitiveRef = React.createRef();
    const props = {};
    if (clickCallbacks) {
        // set callbacks
        Object.entries(clickCallbacks).forEach(([id, callback]) => {
            props[id] = (e) => callback(e, scene.uuid)
        })
    }
    const object = (<primitive ref={primitiveRef} object={scene} position={[0, 0, 0]} {...props} />)

    jsx[uuid] = object;
    ref[uuid] = primitiveRef;
    return {jsx, ref}
}