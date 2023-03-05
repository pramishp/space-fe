import React, {useEffect, useState} from "react";
import {toJSX} from "../common/loaders/loader";
import {useFrame} from "@react-three/fiber";
import {ANIMATION_TRIGGERS, ANIMATION_LIFE_TYPES} from "../common/consts";
import AnimationSequence from "./AnimationSequence";
import {Box} from "@react-three/drei";

function Presentation({data}) {
    const {jsxs, refs} = toJSX(data);
    const [graph, setGraph] = useState(jsxs);
    const [refGraph, setRefGraph] = useState(refs);
    const [play, setPlay] = useState(true);


    const seq = new AnimationSequence({
        meshRefs: refGraph,
        slides: data.slides,
        animations: data.animations
    }, onAnimationEnd);

    function onAnimationEnd(e, index, subIndex){
        if (index < seq.length - 1) {
            if (seq.getNextActionTrigger() === ANIMATION_TRIGGERS.ON_ANIMATION_END){
                seq.playAnimations(index + 1)
            }
            //TODO: on slide change
        }
    }

    useEffect(() => {
        if (play){
            if (!seq.initialized) {
                seq.init();
                seq.playAnimations(0);
            }
        }
        return () => {
            // remove all event listeners
            if (seq.mixers){
                Object.entries(seq.mixers).forEach(([uuid, val]) => {
                    val.removeEventListener('finished', seq.listeners[uuid])
                })
            }

        }

    }, [data, play])

    function handleKeyDown(event){
        if (event.key === "ArrowLeft") {
            //TODO: handle back pressed
        } else if (event.key === "ArrowRight") {
            if (seq.getNextActionTrigger() === ANIMATION_TRIGGERS.ON_KEY_PRESSED){
                seq.playNextAnimations()
            }
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useFrame((state, delta) => {

        if (seq.mixers) {
            Object.entries(seq.mixers).forEach(([uuid, val]) => {
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
