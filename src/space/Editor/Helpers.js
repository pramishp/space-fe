import * as React from "react";
import {useThree} from "@react-three/fiber";
import {useEffect, useState} from "react";
import * as THREE from "three";

let geometry = new THREE.SphereGeometry(2, 4, 2);
let material = new THREE.MeshBasicMaterial({color: 0xff0000, visible: false});

export default function Helpers({selectedItems, refs, onSelect}) {

    return (
        <>
            {Object.entries(refs).map(([uuid, ref])=>{
                const mesh = ref.current;
                if (!mesh){
                    return null;
                }

                if (mesh.type.indexOf("Light") !== -1) {
                    switch (mesh.type) {
                        case 'AmbientLight':
                            return null

                        case 'DirectionalLight':
                            return (
                                <directionalLightHelper args={[mesh, 1]}>
                                    <mesh onClick={()=>onSelect({uuid, object:mesh})}>
                                        <sphereGeometry args={[2, 4, 2]}/>
                                        <meshBasicMaterial color={0xff0000} visible={false}/>
                                    </mesh>
                                </directionalLightHelper>
                            )

                        case 'PointLight':
                            return (
                                <pointLightHelper args={[mesh, 1]}>
                                    <mesh onClick={()=>onSelect({uuid, object:mesh})}>
                                        <sphereGeometry args={[2, 4, 2]}/>
                                        <meshBasicMaterial color={0xff0000} visible={false}/>
                                    </mesh>
                                </pointLightHelper>
                            )
                        default:
                            break
                    }
                }


            })}
        </>
    )
}