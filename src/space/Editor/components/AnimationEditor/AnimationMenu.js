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
import Icon from "../../../../common/components/Icon";


export default function AnimationMenu({isXR, onClick, enterAnimationMode, onHoverOnAnimation, onSelectOnAnimation, onUnhoverOnAnimation}) {

    // the mesh to be selected is handled in the editor class.
    const onItemClicked = ({uuid, val}) => {
        onSelectOnAnimation({uuid, val})
        switch (val.type){
            case ANIMATION_TYPES.KEYFRAME:
                if (onClick) {
                    onClick({uuid, val});
                }
                break
            case ANIMATION_TYPES.PATH:
                if(enterAnimationMode){
                    enterAnimationMode()
                }
                break

            default:
                console.log(`No case handled for ${val.type} animation`)

        }


    }
    const onItemHovered = ({uuid, val}) => {
        console.log('getting called')
        onHoverOnAnimation({uuid, val})
    }
    const onItemUnhovered = () => {
        console.log('getting called')
        onUnhoverOnAnimation()
    }

    

    if (isXR) {
        return (
            <VRUIContainer position={[-4, 1, 1]} title={"Animations"}>
                {Object.entries(animations).map(([uuid, item]) => {
                    return (
                            <Button key={`button-${uuid}`} isXR={isXR} onClick={() => onItemClicked({uuid, val: item})}
                                    onHover={() => onItemHovered({uuid, val: item})}
                                    title={item.name}/>

                    )
                })}
            </VRUIContainer>
        )
    } else {
        // conditionally call on the onMouseEnter?
        return (
            <div className="grid grid-cols-2 gap-4">
            {/* loop through each animation object */}
            {Object.values(animations).map((animation) => (
              <div key={animation.uuid}>
                <Icon
                  name={animation.img}
                  alt={animation.name}
                  className="w-24 h-24 cursor-pointer"
                  onClick={() => onItemClicked({uuid: animation.uuid, val: {...animation}})}
                  onMouseEnter={() => onItemHovered({uuid: animation.uuid, val: {...animation}})}
                  onMouseLeave={() => onItemUnhovered()}
                />
                <div className="text-center font-bold">{animation.name}</div>
              </div>
            ))}
          </div>           
        ) 
    }
    

}
