import React, {useEffect, useRef} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from "three";

const normal = new THREE.Vector3(0,1,0)

export default function Ground() {
    const planeRef = useRef();
    const { viewport } = useThree();

    useFrame((state) => {
        // planeRef.current.position.y = -1;

        // planeRef.current.set(normal)
        planeRef.current.scale.set(viewport.width, viewport.height, 1);
    });

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry( 9, 9, 1, 1 ),
        new THREE.MeshPhongMaterial( { color: 0xa0adaf, shininess: 150 } )
    );

    return (
        <mesh ref={planeRef} receiveShadow={true} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1, 1, 1, 2]}/>
            <meshPhongMaterial color={0xa0adaf}  shininess={150} side={THREE.DoubleSide}/>
        </mesh>
        // <Grid/>
    );
}
