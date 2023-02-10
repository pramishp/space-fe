import * as THREE from 'three'

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material);
const group = new THREE.Group();
console.log('group : \n', group.toJSON())
group.add(cube)
console.log('geometry : \n', geometry.toJSON())
console.log('cube : \n', cube.toJSON())
console.log('group : \n', group.toJSON())


