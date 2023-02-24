import React, {useState} from 'react';
import LightEditor from "./PropsEditor/LightPropsEditor";
import GroupEditor from "./PropsEditor/GroupPropsEditor";
import MeshEditor from "./PropsEditor/MeshPropsEditor";

const _ = require("lodash")

function AnimationEditItem({item, onDelete}){

    return (
        <div>
            <h6>{item.name}</h6>
            <button onClick={()=>{onDelete(item)}}>Delete</button>
        </div>
    )
}
function AnimationEditor({animations, selectedItems, onAnimationDelete}) {
    const Empty = <div/>
    if (selectedItems.length === 0) {
        return Empty
    }

    const selectedObjectUUID = selectedItems[0]
    const animationList = _.filter(animations, {object_uuid: selectedObjectUUID})
    if (animationList.length === 0){
        return Empty
    }

    return (
        <div>
            <h6>Animations:</h6>
            {animationList.map((item) => {
                return <AnimationEditItem item={item} onDelete={()=>onAnimationDelete({uuid: item.uuid})}/>
            })}
        </div>
    )
}

function PropsEditor(props) {
    const {isXR, selectedItems, refs} = props;
    const Empty = <div style={{'margin': '40px'}}/>
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
            {object.type.indexOf("Group") !== -1 && <GroupEditor group={object} {...props} />}
            {object.type.indexOf("Mesh") !== -1 && <MeshEditor mesh={object} {...props} />}
            <AnimationEditor {...props}/>
        </>
    )
}

export default PropsEditor;
