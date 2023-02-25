import * as THREE from 'three'

// Define a custom toJSON() method for the Box mesh
THREE.Mesh.prototype.toJSON = function () {
    var data = THREE.Object3D.prototype.toJSON.call(this);
    data.position = this.position.toArray();
    return data;
};

const geometry = new THREE.PlaneGeometry( 0.1, 0.1, 0.1 );
const material = new THREE.MeshBasicMaterial();
const mesh = new THREE.Mesh( geometry, material );
mesh.position.set(1,1,1)

console.log(mesh.toJSON())