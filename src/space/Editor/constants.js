import * as THREE from "three";

export const EDITOR_OPS = {
    INSERT_OBJECT: "INSERT_MESH",
    DELETE_MESH: "DELETE_MESH",
    GROUP_MESH: "GROUP_MESH",
    INSERT_LIGHT: "INSERT_LIGHT",
    UPDATE_MESH: "UPDATE_MESH",
    UPDATE_MATERIAL: "UPDATE_MATERIAL",
    ADD_ANIMATION: "ADD_ANIMATION",
    DELETE_ANIMATION: "DELETE_ANIMATION"
}

// Define a custom toJSON() method for the Box mesh
THREE.Mesh.prototype.toJSON = function () {
    var data = THREE.Object3D.prototype.toJSON.call(this);
    data.object.position = this.position.toArray();
    return data;
};

function three2spaceJSON(jsonData) {


    const json = {...jsonData}

    let object = json.object;
    object = {...object}
    const geometries = {};
    const materials = {};
    json.geometries.forEach(geom=>{
        geometries[geom.uuid] = geom
    })
    json.materials.forEach(material=>{
        materials[material.uuid] = material
    })

    return {
        geometries,
        materials,
        objects: {[object.uuid]: object}

    }
}

export function mesh2json(mesh) {
    const json = mesh.toJSON();
    // Make a deep copy of the JSON object
    const copyJson = JSON.parse(JSON.stringify(json));
    copyJson.object.layers = 0;
    const spaceJson = three2spaceJSON(copyJson);
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
            light.position.y = 3;
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
        get: function () {
            const geometry = new THREE.BoxGeometry(0.01, 0.01, 0.01);
            const material = new THREE.MeshBasicMaterial({color:'red'});
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(-1, 0, 0);
            return mesh2json(mesh)
        }
    },
    sphere: {
        get: function () {
            const geometry = new THREE.SphereGeometry(0.2);
            const material = new THREE.MeshBasicMaterial({color:'green'});
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(1, 0, 0)
            return mesh2json(mesh);
        }
    },
    cylinder: {
        get: function () {
            const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5);
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

export const TYPES = {
    MESH: "Mesh",
    GEOMETRY: "Gemometry",
    MATERIAL: "Material"
}