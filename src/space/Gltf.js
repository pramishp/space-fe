import {forwardRef, Suspense, useEffect} from 'react'
import {useGLTF} from '@react-three/drei'
import * as React from "react";


const keys = ['position', 'quaternion', 'scale']

export const GltfModel =  React.forwardRef(({val, uuid, clickCallbacks}, ref)=> {
    const {url} = val

    const gltf = useGLTF(url, true)
    const {scene, animations} = gltf;

    // set uuid
    scene.uuid = uuid;
    scene.traverse((object) => {
        object.uuid = uuid; // Set a custom UUID for each object
    });

    const objectProps = {};

    // if key exists, add those props to primitive
    keys.forEach(key => {
        if (val[key]) {
            objectProps[key] = val[key]
        } else {
            // set default props of gltf to val
            val[key] = scene[key].toArray();
            objectProps[key] = scene[key].toArray();
        }
    })


    clickCallbacks && Object.entries(clickCallbacks).forEach(([id, callback]) => {
        objectProps[id] = (e) => callback(e, uuid)
    })

    useEffect(()=>{

        return ()=>{
            //TODO: destroy object on unmount
        }
    }, [])

    return (
        <Suspense>
            <primitive ref={ref} object={gltf.scene} {...objectProps}/>
        </Suspense>
    )
})