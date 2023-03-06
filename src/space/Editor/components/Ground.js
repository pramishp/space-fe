import React, {useEffect, useRef} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from "three";
import {PlaneHelperComponent} from "./helpers/PlaneHelper";
import {Grid} from "@react-three/drei";

const normal = new THREE.Vector3(0,1,0)

export default function Ground() {

    return (
        <>
            <Grid cellColor="white" args={[10, 10]} fadeDistance={50} sectionSize={2} cellThickness={0.5} sectionThickness={1.5} infiniteGrid={true} />
        </>
    );
}
