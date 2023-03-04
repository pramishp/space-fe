import {animations} from "./AnimationData";
import {Billboard, Text} from "@react-three/drei";
import {Flex, Box} from '@react-three/flex';
import {Button} from "../VRUIs/Button";
import {useFrame, useThree} from "@react-three/fiber";
import {AnimationClip} from "three";
import * as THREE from "three";
import {useEffect} from "react";
import {ANIMATION_TYPES} from "../../constants";

export default function AnimationList({isXR, onClick, refs, selectedItems}) {

    let mixer, action;

    const {scene} = useThree();

    const onItemClicked = ({uuid, val}) => {
        switch (val.type){
            case ANIMATION_TYPES.KEYFRAME:
                if (onClick) {
                    onClick({uuid, val});
                }
                break

            default:
                console.log(`No case handled for ${val.type} animation`)

        }


    }

    const onItemHovered = ({uuid, val}) => {
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

    return (
        <Billboard
            position={[0, 4, 0]}
            follow={true}
            lockX={false}
            lockY={false}
            lockZ={false} // Lock the rotation on the z axis (default=false)
        >
            <Flex justifyContent="center" alignItems="center">
                {Object.entries(animations).map(([uuid, item]) => {
                    return (
                        <Box key={`box-${uuid}`} centerAnchor>

                            <Button key={`button-${uuid}`} isXR={isXR} onClick={() => onItemClicked({uuid, val: item})}
                                    onHover={() => onItemHovered({uuid, val: item})}
                                    title={item.name}/>

                        </Box>
                    )
                })}
            </Flex>
        </Billboard>
    )
}

