import {animations} from "./AnimationData";
import {Billboard, Text} from "@react-three/drei";
import {Flex, Box} from '@react-three/flex';
import {Button} from "../VRUIs/Button";
import {useFrame, useThree} from "@react-three/fiber";
import {AnimationClip} from "three";
import * as THREE from "three";
import {useEffect} from "react";
import {ANIMATION_TYPES} from "../../constants";
import VRUIContainer from "../VRUIs/VRUIContainer";
import {Heading5, Heading6} from "../VRUIs/Headings";


// the hovered here is for the type of animation.
export default function AnimationPreview({hoveredAnimation, selectedAnimation, refs, selectedItems}) {

    let mixer, action;
    // the mesh to be selected is handled in the editor class.
    
    useEffect(() => {
    //hoveredAnimation
    onItemHovered()
    }, [hoveredAnimation, selectedAnimation])
    

    const onItemHovered = ({uuid, val}) => {
        console.log('uuid and val', uuid, val)
        if (val.type !== ANIMATION_TYPES.KEYFRAME){
            return
        }
        // check for animations coming from another path.
        // the selected item comes from the editor class itself.
        if (selectedItems.length === 1 && refs[selectedItems[0]].current) {
            if (mixer) {
                mixer.stopAllAction();
            }
            const mesh = refs[selectedItems[0]].current;
            // onDeselect();
            // 2. Create the animation clip
            const animationClip = AnimationClip.parse(val)
            // 3. Play the animation
            mixer = new THREE.AnimationMixer(mesh);
            // mixer.addEventListener('finished', (e) => {
            //     // mixer.stopAllAction();
            //     // mixer = null;
            // })
            // mixer.addEventListener( 'loop', (e)=>{
            //     console.log('finished " ', e)
            // });
            action = mixer.clipAction(animationClip);
            action.loop = THREE.LoopOnce;
            action.play();

        }
    }

    useEffect(() => {

        return () => {
            if (mixer) {
                //TODO: destroy mixer
            }
            if (action) {
                //TODO: destroy action
            }
        }
    })

    useFrame((state, delta) => {

        if (mixer) {
            mixer.update(delta)
        }

    })

    

}

