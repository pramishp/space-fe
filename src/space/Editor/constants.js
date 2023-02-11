import {generateUniqueId} from "../../utils";
import * as THREE from "three";

export const EDITOR_OPS = {
    INSERT_MESH: "INSERT_MESH",
    DELETE_MESH: "DELETE_MESH",
    GROUP_MESH: "GROUP_MESH"
}

function three2spaceJSON(json) {
    const geometry = json.geometries[0];
    const material = json.materials[0]
    const object = json.object;
    return {
        geometries: {[geometry.uuid]: geometry},
        materials: {[material.uuid]: material},
        objects: {[object.uuid]: object}

    }
}

function mesh2json(mesh) {
    const json = mesh.toJSON();
    json.object.layers = 0;
    const spaceJson = three2spaceJSON(json);
    return {uuid: json.object.uuid, val: spaceJson}
}

export const BASIC_LIGHTS = {
    ambient: {
        get: function () {
            const light = new THREE.AmbientLight( 0x505050, 5 );
            const uuid = light.uuid;
            const val = light.toJSON();
            // console.log('ambeint light json', val)
            return {uuid, val}
        }
    },
    directional: {
        get: function () {
            const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
            const uuid = light.uuid;
            const val = light.toJSON();
            return {uuid, val}
        }
    },
    point: {
        get: function () {
            const light = new THREE.PointLight( 0xff0000, 1, 100 );
            light.position.set( 50, 50, 50 );
            const uuid = light.uuid;
            const val = light.toJSON();
            return {uuid, val}
        }
    }
}
export const BASIC_OBJECTS = {
    box: {
        id: "box",
        geometry: {
            type: 'BoxGeometry',
            width: 10,
            height: 10,
            depth: 10,
            widthSegments: 1,
            heightSegments: 1,
            depthSegments: 1
        },
        material: {
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
        object: {
            type: 'Mesh',
            position: [1, 0, 0],
            rotation: [1, 2, 3],
        },
        get: function () {
            const mesh_uuid = generateUniqueId();
            const geometry_uuid = generateUniqueId();
            const material_uuid = generateUniqueId();
            const geometry = {...this.geometry};
            geometry.uuid = geometry_uuid;
            const material = {...this.material};
            material.uuid = material_uuid;
            const object = {...this.object};
            object.uuid = mesh_uuid;
            object.geometry = geometry_uuid;
            object.material = material_uuid;
            const data = {
                objects: {
                    [mesh_uuid]: object
                },
                geometries: {
                    [geometry_uuid]: geometry
                },
                materials: {
                    [material_uuid]: material
                }
            }
            return {uuid: mesh_uuid, val: data}
        }

    },
    sphere: {
        get: function () {
            const geometry = new THREE.SphereGeometry(0.5);
            const material = new THREE.MeshBasicMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            return mesh2json(mesh);
        }
    },
    cylinder: {
        get: function () {
            const geometry = new THREE.CylinderGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            return mesh2json(mesh);

        }
    },
    plane: {
        get: function () {
            const geometry = new THREE.PlaneGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            return mesh2json(mesh);
        }
    }

}