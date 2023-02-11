import * as THREE from 'three'


const geometry = new THREE.PlaneGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial();
const mesh = new THREE.Mesh( geometry, material );

// console.log(mesh.toJSON())

const light = new THREE.Light()
let mixer;

// define animation
// POSITION
const positionKF = new THREE.VectorKeyframeTrack( '.position', [ 0, 1, 2 ], [ 0, 0, 0, 30, 0, 0, 0, 0, 0 ] );
// SCALE
const scaleKF = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ 1, 1, 1, 2, 2, 2, 1, 1, 1 ] );

// set up rotation about x-axis
const xAxis = new THREE.Vector3( 1, 0, 0 );

const qInitial = new THREE.Quaternion().setFromAxisAngle( xAxis, 0 );
const qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, Math.PI );
const quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w ] );


// create an animation sequence with the tracks
// If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
const clip = new THREE.AnimationClip( 'position', 3, [ positionKF] );
const clip2 = new THREE.AnimationClip( 'scale', 3, [ scaleKF] );
const clip3 = new THREE.AnimationClip( 'rotation', 3, [ quaternionKF] );


mixer = new THREE.AnimationMixer(mesh);
const action = mixer.clipAction(clip3)

const json = THREE.AnimationClip.toJSON(clip3)

// console.log(json.tracks)