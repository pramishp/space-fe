import React, {useEffect, useState} from "react";
import {toJSX, toSceneJSX} from "../common/loaders/loader";
import {Canvas, useFrame} from "@react-three/fiber";
import {ANIMATION_TRIGGERS, ANIMATION_LIFE_TYPES} from "../common/consts";
import AnimationSequence from "./AnimationSequence";
import {GltfModel} from "./Gltf";
import {EDITOR_OPS, FILE_TYPES} from "./Editor/constants";
import {loadGltfFromUrl} from "../common/loaders/FileLoaders";
import {Button} from "./Editor/components/VRUIs/Button";
import Controls from "./Editor/Controls";
import {ARButton, VRButton, XR} from "@react-three/xr";
import {PRESENTATION_TYPES} from "./PresentationWrapper";


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

function UpdateMixers({seq}){
    useFrame((state, delta) => {

        if (seq.mixers) {
            Object.entries(seq.mixers).forEach(([uuid, val]) => {
                val.update(delta)
            })
        }

    })
    return null
}

function Presentation({data, type}) {
    const {scene:sceneProps} = data;
    const {jsxs: gltfJsxs, refs: gltfRefs} = getGltfJsx(data);
    // scene also has ambient light does that need to be added here.
    const {jsxs: sceneJsxs, refs: scenePropsRefs} = toSceneJSX({uuid: 'background', ...sceneProps.background})
    let {jsxs, refs} = toJSX(data);

    jsxs = {...jsxs, ...gltfJsxs}
    refs = {...refs, ...gltfRefs}

    const [graph, setGraph] = useState(jsxs);
    const [refGraph, setRefGraph] = useState(refs);
    const [play, setPlay] = useState(false);

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
                seq.init(refGraph);
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


    const playAnimations = ()=>{

        setPlay(true);

    }

    const MainPresentation = (
        <>
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
            <UpdateMixers seq={seq}/>

        </>
    );

    const OrbitControls = <Controls makeDefault/>
    const app = <div style={{height: window.innerHeight}}>
        <button style={{alignSelf: "right"}} onClick={playAnimations}>Play</button>
        {type === PRESENTATION_TYPES.VR? <VRButton/>: null}
        {type === PRESENTATION_TYPES.AR? <ARButton/>: null}
        <Canvas>
            <XR referenceSpace="local-floor">
                {MainPresentation}
            </XR>
            {type !== PRESENTATION_TYPES["2D"] ? OrbitControls : null}
            {/*{type !== PRESENTATION_TYPES["2D"] ? <FirstPersonControls activeLook={false}/> : null}*/}
        </Canvas>
    </div>

    return app
}

export default Presentation;
