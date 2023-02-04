import React, {useEffect, useState} from "react";
import * as THREE from "three";
import {AnimationClip} from "three";
import * as _ from "lodash"
import {parseAnimations, toJSX} from "../common/loader";
import {useFrame} from "@react-three/fiber";
import {getIndexAndSubIndex} from "../utils";
import {ANIMATION_TYPES} from "../common/consts";


function Presentation({data}) {
    const {jsxs, refs} = toJSX(data);
    const [graph, setGraph] = useState(jsxs);
    const [refGraph, setRefGraph] = useState(refs);
    const [animationTrackerIndex, setAnimationTrackerIndex] = useState(0);

    // parse animation data
    const animations = parseAnimations(data.animations);
    const mixers = {}

    useEffect(() => {
        const slideIndex = 0;
        const {slides} = data;
        const slides_list = _.orderBy(slides, ['order'], ['asc'])
        const currentSide = slides_list[slideIndex];
        const slide_animations = currentSide['animations']
        // group animations by order and make a list
        const animation_group = _.groupBy(slide_animations, 'order')

        function orderAnimationGroup(item) {
            return parseInt(item[0]['order'])
        }

        const animation_seq = _.orderBy(animation_group, [orderAnimationGroup], ['asc'])

        // create mixer for each object that has animation

        const allMeshes = Object.entries(slide_animations).map(([uuid, val])=>val.object_uuid)
        const uniqueMeshes = new Set(allMeshes);
        uniqueMeshes.forEach((uuid)=>{
            const meshRef = refGraph[uuid]
            mixers[uuid] = new THREE.AnimationMixer(meshRef.current)
        })

        // assign clip actions from parsed animations
        const clipActions = {}
        const listeners = {}

        function onAnimationFinished(e, index, subIndex){
            if (index < animation_seq.length - 1){
                // console.log('playing next animation', index + 1)
                playAnimations(animation_seq, index + 1)

            }
        }

        Object.entries(slide_animations).forEach(([uuid, val])=>{
            // get mesh/object specific mixer
            const mixer = mixers[val.object_uuid];
            // const clip = animations[val.animation_uuid];
            // create new animation for each animation of slide_animation
            const clip = AnimationClip.parse(data.animations[val.animation_uuid])
            // each slide animation is a clip action
            clipActions[uuid] = mixer.clipAction(clip);
            // listeners are mixer based i.e. one listener for one animated mesh
            if (listeners[val.object_uuid] === undefined){
                listeners[val.object_uuid] = (e)=>{
                    const animation_uuid = e.action._clip.uuid;
                    const slide_animation_uuid = e.action.slide_animation_uuid;
                    const {type:animationType, trigger:animationTrigger} = e.action;
                    // find index and subIndex of slide_animation in animation_seq
                    const {i, j} = getIndexAndSubIndex(animation_seq, "uuid", slide_animation_uuid)

                    // attach onAnimationEnd only if it is the longest animation of that index
                    // if there is an animation with type INFINITY, ignore it
                     const sortedSlideAnimations = animation_seq[i].filter(function (i){
                        return (i.type !== ANIMATION_TYPES.INFINITY)
                    }).map(item=>data.animations[item.animation_uuid]).sort(function(a, b) {
                        return b.duration - a.duration;
                    })

                    //make sure the sublist doesn't contain only INFINITY type animations
                    if (sortedSlideAnimations.length >= 1){
                        const longestAnimationUUID = sortedSlideAnimations[0].uuid
                        if (animation_uuid === longestAnimationUUID){
                            onAnimationFinished(e, i, j);
                        }
                    }

                    if (animationType === ANIMATION_TYPES.LOOP_ONCE){
                        // if loop once type animation, stop after animation is over
                        // this step is required to reset the animation state of a mixer
                        // so that we can reapply same animation for same mesh at different timeline time
                        // console.log('calling action stop on ', slide_animation_uuid)
                        // e.action.stop();
                        // e.action.reset();
                        // e.action.paused = true;
                        // mixer.uncacheAction(e.action);
                        // mixer.uncacheClip(e.action._clip)
                    }
                }
                if (val.type === THREE.LoopOnce){
                    mixer.addEventListener('finished', listeners[val.object_uuid])
                }
            }

        })

        /**
         * *
         * Takes a list of animations and plays it at once
         * @param animations_seq
         * @param index
         */
        function playAnimations(animations_seq, index){
            if (index > (animations_seq.length - 1)){
                console.error("Animation Seq Index Out of Bound")
            }
            animations_seq[index].forEach(animation=>{
                console.log("play ", animation.uuid)
                let action = clipActions[animation.uuid];
                action.clampWhenFinished = true;
                // action.enabled = true;
                // action.paused = false;
                action.slide_animation_uuid = animation.uuid;
                action.type = animation.type;
                action.trigger = animation.trigger;

                if (animation.type === ANIMATION_TYPES.LOOP_ONCE){
                    action.loop = THREE.LoopOnce;
                }
                if (animation.type === ANIMATION_TYPES.INFINITY){
                    action.loop = THREE.LoopRepeat;
                }
                action.paused=false;
                // paused=true, enabled=false, weight=0, timeScale=0
                // action.paused = false;
                // action.enabled = true;
                // action.weight = 1000;
                // action.stop();
                action.reset();
                action.play();
                // action.paused = false;
                console.log(animation.uuid,' ',action.paused)
                console.log(animation.uuid,' ',action)
            })

            // if there is no animation with LOOP_ONCE type in index/time,
            // play it and immediately call the next animation

            let hasLoopOnce = false;
            animations_seq[index].forEach(animation=>{
                if (animation.type !== ANIMATION_TYPES.INFINITY) {
                    hasLoopOnce = true;
                }
            })

            if (index < animation_seq.length - 1 && !hasLoopOnce){
                // console.log('all inifinity animation, playing next', animation_seq[index + 1])
                playAnimations(animations_seq, index + 1)
            }



        }

        // play onSlideStart animations
        playAnimations(animation_seq, 0);


        return ()=>{
            // remove all event listeners
            Object.entries(mixers).forEach(([uuid, val])=>{
                val.removeEventListener('finished', listeners[uuid])
            })
        }

    }, [data])

    useFrame((state, delta)=> {
        if (mixers){
            Object.entries(mixers).forEach(([uuid, val])=>{
                val.update(delta)
            })
        }

    })

    return (
        <>
            {Object.entries(graph).map(([uuid, item]) => {
                return (
                    <>
                        {item}
                    </>
                )
            })}
        </>
    );
}

export default Presentation;
