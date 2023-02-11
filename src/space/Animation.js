import React, {useEffect} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import * as THREE from "three";
function AnimationApp() {
    const meshRef = React.useRef();

    let mixer;
    // define animation
    // POSITION
    const positionKF = new THREE.VectorKeyframeTrack( '.position', [ 0, 1, 2 ], [ 0, 0, 0, 30, 0, 0, 0, 0, 0 ] );
    // SCALE
    const scaleKF = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ 1, 1, 1, 2, 2, 2, 1, 1, 1 ] );

    // create an animation sequence with the tracks
    // If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
    const clip = new THREE.AnimationClip( 'position', 3, [ positionKF] );
    const clip2 = new THREE.AnimationClip( 'scale', 3, [ scaleKF] );

    useEffect(()=>{
        // setup the THREE.AnimationMixer
        if (meshRef.current){
            mixer = new THREE.AnimationMixer( meshRef.current );

            // create a ClipAction and set it to play
            const clipAction = mixer.clipAction( clip );
            clipAction.play();
            clipAction.loop = THREE.LoopOnce;
        }

        function onAnimationFinished(e){
            console.log('animation finished', e.action._clip.name)
            if (e.action._clip.name == ""){}
            const action2 = mixer.clipAction(clip2)
            action2.play();
            action2.loop = THREE.LoopOnce;

        }
        mixer.addEventListener('finished', onAnimationFinished)

        return ()=>{
            mixer.removeEventListener('finished', onAnimationFinished)
        }
    })

    useFrame((state, delta)=>{
        if ( mixer ) {

            mixer.update( delta );

        }

    })

    return (
                <mesh ref={meshRef}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color={'orange'} />
                </mesh>
    );
}

export default AnimationApp;
