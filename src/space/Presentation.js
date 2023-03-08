import React, {useEffect, useState} from "react";
import {toJSX, toSceneJSX} from "../common/loaders/loader";
import {useFrame} from "@react-three/fiber";
import {ANIMATION_TRIGGERS, ANIMATION_LIFE_TYPES} from "../common/consts";
import AnimationSequence from "./AnimationSequence";
import {GltfModel} from "./Gltf";
import {EDITOR_OPS, FILE_TYPES} from "./Editor/constants";
import {loadGltfFromUrl} from "../common/loaders/FileLoaders";
import {Button} from "./Editor/components/VRUIs/Button";


function getGltfJsx({objects}){
    const jsxs = {}
    const refs = {}
    Object.entries(objects).forEach(([uuid, val])=>{
        if (val.isFile) {
            const ref = React.createRef();
            const {uuid} = val;
            const object = <GltfModel ref={ref} key={uuid}
                                      uuid={uuid}
                                      val={val}/>
            jsxs[uuid] = object
            refs[uuid] = ref
        }
    })

    return {jsxs, refs}

}

function Presentation({data}) {
    const {scene:sceneProps} = data;
    const {jsxs: gltfJsxs, refs: gltfRefs} = getGltfJsx(data);

    const {jsxs: sceneJsxs, refs: scenePropsRefs} = toSceneJSX({prop_type: 'background', ...sceneProps.background})
    let {jsxs, refs} = toJSX(data);

    jsxs = {...jsxs, ...gltfJsxs}
    refs = {...refs, ...gltfRefs}

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
                seq.init(refs);
                if (seq.length > 0){
                    seq.playAnimations(0);
                }
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

    const playAnimations = ()=>{

        setPlay(true);

    }


    return (
        <>
            {/*<Button title={"Play"} onClick={playAnimations}/>*/}
            {Object.entries(graph).map(([uuid, item]) => {
                return (
                    <>
                        {item}
                    </>
                )
            })}
            {gltfJsxs && Object.entries(gltfJsxs).map(([uuid, val])=>val)}
            {
                sceneJsxs && Object.entries(sceneJsxs).map(([uuid, val]) => {
                    return (
                        val
                    )
                })
            }
        </>
    );
}

export default Presentation;
