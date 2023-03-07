import * as React from "react";
import {useThree, extend} from "@react-three/fiber";
import {useEffect, useState} from "react";
import * as THREE from "three";
import {SHAPE_TYPES} from "./constants";
import {Line, useHelper} from "@react-three/drei";
import {LineHelperComponent} from "./components/helpers/LineHelper";

import * as EmptyHelper from "../../common/helpers/EmptyHelper";

extend(EmptyHelper)

let geometry = new THREE.SphereGeometry(2, 4, 2);
let material = new THREE.MeshBasicMaterial({color: 0xff0000, visible: false});

export default function Helpers({selectedItems, refs, onSelect, graph, clickCallbacks}) {

    return (
        <>
            {Object.entries(refs).map(([uuid, ref]) => {
                const mesh = ref.current;
                const callbackProps = {};
                if (clickCallbacks) {
                    // set callbacks
                    Object.entries(clickCallbacks).forEach(([id, callback]) => {
                        callbackProps[id] = (e) => callback(e, mesh.uuid)
                    })
                }
                if (!mesh) {
                    return null;
                }

                if (mesh.type.indexOf("Light") !== -1) {
                    switch (mesh.type) {
                        case 'AmbientLight':
                            return null

                        case 'DirectionalLight':
                            return (
                                <directionalLightHelper args={[mesh, 0.5, '#000']}>
                                    <mesh {...clickCallbacks} onClick={() => onSelect({uuid, object: mesh})}>
                                        <sphereGeometry args={[0.5, 1, 0.5]}/>
                                        <meshBasicMaterial color={0xff0000} visible={false}/>
                                    </mesh>
                                </directionalLightHelper>
                            )

                        case 'PointLight':
                            return (
                                <pointLightHelper args={[mesh, 0.5, '#000']}>
                                    <mesh {...clickCallbacks} onClick={() => onSelect({uuid, object: mesh})}>
                                        <sphereGeometry args={[0.5, 1, 0.5]}/>
                                        <meshBasicMaterial color={0xff0000} visible={false}/>
                                    </mesh>
                                </pointLightHelper>
                            )
                        default:
                            break
                    }
                }

                if (mesh.type === 'Line') {
                    const points = mesh.geometry.toJSON().data.attributes.position.array;
                    // TODO: if item is active, set sphere as click region
                    return (
                        <emptyHelper args={[mesh]}>
                            <Line key={`${mesh.uuid}-line-helper`} visible={false}
                                  points={points}
                                  lineWidth={20}
                                  {...clickCallbacks}
                                  onClick={() => {
                                      onSelect({uuid: uuid, object: mesh})
                                  }}
                            />

                        </emptyHelper>
                    )
                }

            })}
        </>
    )
}