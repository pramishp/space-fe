import * as THREE from 'three'

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

console.log(ellipse.scale.fromArray([2,2,2]))