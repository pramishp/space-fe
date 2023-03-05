import * as THREE from 'three'
import {AnimationMixer} from "three";

const curve = new THREE.EllipseCurve(
    0,  0,            // ax, aY
    10, 10,           // xRadius, yRadius
    0,  2 * Math.PI,  // aStartAngle, aEndAngle
    false,            // aClockwise
    0                 // aRotation
);

const points = curve.getPoints( 5 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );

const material = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 5} );

// Create the final object to add to the scene
const ellipse = new THREE.Line( geometry, material );
ellipse.material.linewidth = 100

// console.log(ellipse.geometry)

// create animation

const times = [0, 10]; // start at 0 seconds and end at 1 second
const position = [
    2, 0, 0, 3, 0,
    0, 2, 0, 0
]

const trackName = '.position'; // name of the property to animate
const track = new THREE.VectorKeyframeTrack(trackName, times , position); // create a track
const clip = new THREE.AnimationClip('positionChange', -1 , [track]);
const mixer = new AnimationMixer(ellipse)
const action = mixer.clipAction(clip)
console.log(clip.toJSON())