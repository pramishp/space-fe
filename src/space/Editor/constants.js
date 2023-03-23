import * as THREE from "three";
// Define a custom toJSON() method for the Box mesh
THREE.Mesh.prototype.toJSONWithPosition = function() {
    var data = THREE.Object3D.prototype.toJSON.call(this);
    data.object.position = this.position.toArray();
    data.object.rotation = this.rotation.toArray();
    return data;
};

THREE.Line.prototype.toJSONWithPosition =
    THREE.Mesh.prototype.toJSONWithPosition;

export const FILE_TYPES = {
    GLTF: "gLTF",
};

export const SHAPE_TYPES = {
    "ELLIPSE": "ellipse",
    "LINE": "line",
};

export const ANIMATION_TYPES = {
    KEYFRAME: "KEYFRAME",
    PATH: "PATH",
};

export const EDITOR_OPS = {
    INSERT_OBJECT: "INSERT_MESH",
    INSERT_OBJECT_FILE: "INSERT_OBJECT_FILE",
    DELETE_MESH: "DELETE_MESH",
    GROUP_MESH: "GROUP_MESH",
    INSERT_LIGHT: "INSERT_LIGHT",
    UPDATE_MESH: "UPDATE_MESH",
    UPDATE_MATERIAL: "UPDATE_MATERIAL",
    ADD_ANIMATION: "ADD_ANIMATION",
    DELETE_ANIMATION: "DELETE_ANIMATION",
    UPDATE_ANIMATION: "UPDATE_ANIMATION",
    ADD_SCENE_PROPS: "ADD_SCENE_PROPS",
    DELETE_SCENE_PROPS: "DELETE_SCENE_PROPS",
    UPDATE_SCENE_PROPS: "UPDATE_SCENE_PROPS",
};

function three2spaceJSON(jsonData) {
    const json = { ...jsonData };

    let object = json.object;
    object = { ...object };
    const geometries = {};
    const materials = {};
    const children = {};
    if (json.geometries) {
        json.geometries.forEach((geom) => {
            geometries[geom.uuid] = geom;
        });
    }
    if (json.materials) {
        json.materials.forEach((material) => {
            materials[material.uuid] = material;
        });
    }
    // if (object.children){
    //     object.children.forEach(child=>{
    //         children[child.uuid] = child
    //     })
    // }
    // object.children = children;
    //TODO: convert children to space format for children, also in loader.js to support this change

    return {
        geometries,
        materials,
        objects: { [object.uuid]: object },
    };
}

export function gltf2json(gltf) {
    const json = gltf.scene.toJSON();
    // Make a deep copy of the JSON object
    const copyJson = JSON.parse(JSON.stringify(json));
    copyJson.object.layers = 0;
    const spaceJson = three2spaceJSON(copyJson);
    return { uuid: json.object.uuid, val: spaceJson };
}

export function mesh2json(mesh) {
    const json = mesh.toJSONWithPosition();
    // Make a deep copy of the JSON object
    const copyJson = JSON.parse(JSON.stringify(json));
    copyJson.object.layers = 0;
    const spaceJson = three2spaceJSON(copyJson);
    return { uuid: json.object.uuid, val: spaceJson };
}

export const BASIC_LIGHTS = {
    ambient: {
        get: function() {
            const light = new THREE.AmbientLight(0x505050, 5);
            const uuid = light.uuid;
            const val = light.toJSON();
            // console.log('ambeint light json', val)
            return { uuid, val };
        },
    },
    directional: {
        get: function() {
            const light = new THREE.DirectionalLight(0xffffff, 0.5);
            light.position.y = 3;
            const uuid = light.uuid;
            const val = light.toJSON();
            return { uuid, val };
        },
    },
    point: {
        get: function() {
            const light = new THREE.PointLight(0xff0000, 1, 100);
            light.position.set(50, 50, 50);
            const uuid = light.uuid;
            const val = light.toJSON();
            return { uuid, val };
        },
    },
};
export const BASIC_OBJECTS = {
    box: {
        get: function() {
            const geometry = new THREE.BoxGeometry(0.005, 0.005, 0.005);
            const material = new THREE.MeshBasicMaterial({ color: "red" });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 0, -2);
            return mesh2json(mesh);
        },
    },
    sphere: {
        get: function() {
            const geometry = new THREE.SphereGeometry(0.1);
            const material = new THREE.MeshBasicMaterial({ color: "yellow" });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 0, -2);
            return mesh2json(mesh);
        },
    },
    cylinder: {
        get: function() {
            const geometry = new THREE.CylinderGeometry(0.25, 0.25, 0.25);
            const material = new THREE.MeshBasicMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 0, -2);
            return mesh2json(mesh);
        },
    },
    plane: {
        get: function() {
            const geometry = new THREE.PlaneGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 0, -2);
            return mesh2json(mesh);
        },
    },

    ellipse: {
        get: function() {
            const curve = new THREE.EllipseCurve(
                0,
                0, // ax, aY
                5,
                1, // xRadius, yRadius
                0,
                2 * Math.PI, // aStartAngle, aEndAngle
                false, // aClockwise
                0, // aRotation
            );

            const points = curve.getPoints(50);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            const material = new THREE.LineBasicMaterial({
                color: 0x000000,
                linewidth: 2,
                dashed: false,
            });
            // Create the final object to add to the scene
            const ellipse = new THREE.Line(geometry, material);
            ellipse.userData = { "type": SHAPE_TYPES.ELLIPSE };
            ellipse.position.set(0, 0, -2);
            ellipse.rotation.set(Math.PI / 2, 0, 0);
            return mesh2json(ellipse);
        },
    },
    line: {
        get: function() {
            // Create the geometry for the line with two points
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(1, 0, 0),
            ]);

            const material = new THREE.LineBasicMaterial({
                color: 0x000000,
                linewidth: 2,
                dashed: false,
            });
            // Create the final object to add to the scene
            const line = new THREE.Line(geometry, material);
            line.userData = { "type": SHAPE_TYPES.LINE };
            line.position.set(0, 0, -2);
            return mesh2json(line);
        },
    },
};

// <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
export const SCENE_PROPS_TYPES = {
    stars:{
        background: {
            op_type: 'star',
            uuid: 'background',
                radius: 100,
                depth: 50,
                count: 5000,
                factor: 4,
                saturation: 0,
                speed: 1,
                fade: true,
        },
    },
    sky: {
        background: {
            op_type: 'sky',
            uuid: 'background',
                distance: 450000,
                sunPosition: [0, 1, 0],
                inclination: 0,
                azimuth: 0.25,
        },
    },
    color: {
        background: {
            uuid: 'background',
            op_type: 'color',
            args: ['#ff0000'], 
        },
    },
    environment: {
        background: {
           op_type: 'environment',
           uuid: 'background',
                background: false,
                blur: 0,
                files: ['', '', '', '', '', ''],
                path: '',
                scene: undefined,
                encoding: undefined,
         
        },
    },
    light: {
        light: {
            op_type: 'light',
            uuid: 'light',
                intensity: 10,
                color: '#0000ff',

        },
    },
};



export const TYPES = {
    MESH: "Mesh",
    GEOMETRY: "Gemometry",
    MATERIAL: "Material",
    ANIMATION: "Animation",
    SCENE: "Scene",
};
