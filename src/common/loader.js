/*
*
* Takes JSON from Yjs internal data structure and converts into JSX with refs to all the mesh
*
*  */

import * as React from 'react';

export const sampleJson = {

    shapes: {},
    animations: {},
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
    }

}

export function toJSX(data) {
    const jsxs = {};
    let refs = {};

    Object.values(data.objects).forEach(item => {
        let object, geometry, material;
        var ref = React.createRef();
        refs[item.uuid] = ref;
        switch (item.type) {
            case 'Mesh':
                geometry = getGeometry(data.geometries, item.geometry)
                material = getMaterial(data.materials, item.material)

                object = (
                    <mesh key={item.uuid} ref={ref} {...item}>
                        {geometry}
                        {material}
                    </mesh>
                )
                break;
            default:
                console.log('no case found')
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

    const geomData =  geometries[id];

    switch (geomData.type){
        case 'BoxGeometry':
            return <boxGeometry {...geomData}/>
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

function getMaterialJSX(materialData){
    if (materialData === undefined) return undefined;
    switch (materialData.type){
        case "MeshBasicMaterial":
            return <meshBasicMaterial {...materialData}/>
        default:
            console.error('Material not defined')
    }
}
