import React, {useState} from 'react';
import LightEditor from "./PropsEditor/LightPropsEditor";
import GroupEditor from "./PropsEditor/GroupPropsEditor";
import MeshEditor from "./PropsEditor/MeshPropsEditor";

function PropsEditor({isXR, selectedItems, refs}) {
    const Empty = <div style={{'margin': '40px'}}/>
    if (selectedItems.length === 0){
        return Empty
    }
    // handling single item selection only
    const selectedItemUUID = selectedItems[0]
    // in case the ref.current is null , return null

    if (!(refs[selectedItemUUID] && refs[selectedItemUUID].current)){
        return Empty
    }
    const object =refs[selectedItemUUID].current;

    return (
        <>
            {object.type.indexOf("Light") !== -1 && <LightEditor light={object}/>}
            {object.type.indexOf("Group") !== -1 && <GroupEditor group={object}/>}
            {object.type.indexOf("Mesh") !== -1 && <MeshEditor mesh={object}/>}
        </>
    )
}

export default PropsEditor;
