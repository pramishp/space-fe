import React, {useEffect, useState} from 'react';
import SphereGeometryEditor from "./SphereGeometryPropsEditor";
import {TYPES} from "../../constants";
import VRUIContainer from "../VRUIs/VRUIContainer";
import {Heading6} from "../VRUIs/Headings";
import {NumberInput} from "../VRUIs/NumberInput";

const MeshEditor = ({ mesh, onObjectPropsChanged, onMaterialPropsChanged, isXR}) => {
    const size = mesh.scale.x;
    const color = mesh.material.color;

    const handleColorChange = e => {
        onMaterialPropsChanged({object_uuid: mesh.uuid, uuid:mesh.material.uuid, key: "color", val: e.target.value})
    };

    const handleSizeChange = e => {
        onObjectPropsChanged({object_uuid: mesh.uuid, uuid:mesh.uuid, key: "scale", val:e.target.value})
    };

    if (isXR){
        return (
            <VRUIContainer position={[1,4,0]}>
                <>
                    <Heading6>Size:</Heading6>
                    <NumberInput value={size} onChange={handleSizeChange}/>
                </>
            </VRUIContainer>
        )
    }

    return (
        <div>
            <div>
                <label htmlFor="color">Color:</label>
                <input
                    type="color"
                    id="color"
                    value={'#'+color.getHexString()}
                    onChange={handleColorChange}
                />
            </div>
            <div>
                <label htmlFor="size">Size:</label>
                <input
                    type="number"
                    id="size"
                    value={size}
                    onChange={handleSizeChange}
                />
            </div>

            {mesh.geometry.type==="SphereGeometry" && <SphereGeometryEditor mesh={mesh}/>}
        </div>
    );
};

export default MeshEditor;
