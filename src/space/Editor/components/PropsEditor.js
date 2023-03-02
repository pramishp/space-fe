import React, {useState} from 'react';
import LightEditor from "./PropsEditor/LightPropsEditor";
import GroupEditor from "./PropsEditor/GroupPropsEditor";
import MeshEditor from "./PropsEditor/MeshPropsEditor";
import {Heading6} from "./VRUIs/Headings";
import {Button} from "./VRUIs/Button";
import VRUIContainer from "./VRUIs/VRUIContainer";

const _ = require("lodash")

function AnimationEditItem({item, onDelete, isXR}) {
    if (isXR) {
        return (
            <>
                    <Button title={`${item.name} | Delete`} onClick={() => {
                        onDelete(item)
                    }}/>
            </>
        )
    }
    return (
        <div>
            <h6>{item.name}</h6>
            <button onClick={() => {
                onDelete(item)
            }}>Delete
            </button>
        </div>
    )
}

function AnimationEditor({animations, selectedItems, onAnimationDelete, isXR}) {
    const Empty = isXR ? <></> : <div/>
    if (selectedItems.length === 0) {
        return Empty
    }

    const selectedObjectUUID = selectedItems[0]
    const animationList = _.filter(animations, {object_uuid: selectedObjectUUID})
    if (animationList.length === 0) {
        return Empty
    }

    const heading = isXR?<Heading6>Animations:</Heading6>: <h6>Animations:</h6>

    if (isXR){
        return (
            <VRUIContainer position={[1, 4, 0]}>
                {heading}
                {animationList.map((item) => {
                    return <AnimationEditItem isXR={isXR} item={item}
                                              onDelete={() => onAnimationDelete({uuid: item.uuid})}/>
                })}
            </VRUIContainer>
        )
    }
    return (
        <>
            {heading}
            {animationList.map((item) => {
                return <AnimationEditItem isXR={isXR} item={item}
                                          onDelete={() => onAnimationDelete({uuid: item.uuid})}/>
            })}
        </>
    )
}

function PropsEditor(props) {
    const {isXR, selectedItems, refs} = props;
    const Empty = isXR ? <></> : <div style={{'margin': '40px'}}/>
    if (selectedItems.length === 0) {
        return Empty
    }
    // handling single item selection only
    const selectedItemUUID = selectedItems[0]
    // in case the ref.current is null , return null

    if (!(refs[selectedItemUUID] && refs[selectedItemUUID].current)) {
        return Empty
    }
    const object = refs[selectedItemUUID].current;

    return (
        <>
            {object.type.indexOf("Light") !== -1 && <LightEditor light={object} {...props} />}
            {/*{object.type.indexOf("Group") !== -1 && <GroupEditor group={object} {...props} />}*/}
            {object.type.indexOf("Mesh") !== -1 && <MeshEditor mesh={object} {...props} />}
            <AnimationEditor {...props}/>
        </>
    )
}

export default PropsEditor;
