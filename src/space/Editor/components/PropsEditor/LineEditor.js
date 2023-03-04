import React, {useEffect, useState} from 'react';
import SphereGeometryEditor from "./SphereGeometryPropsEditor";
import {TYPES} from "../../constants";
import VRUIContainer from "../VRUIs/VRUIContainer";
import {Heading6} from "../VRUIs/Headings";
import {NumberInput} from "../VRUIs/NumberInput";

const LineEditor = ({ mesh, onObjectPropsChanged, onMaterialPropsChanged, isXR}) => {
    const size = mesh.scale.x;
    const color = mesh.material.color;
    const lineWidth = mesh.material.linewidth;

    const handleColorChange = e => {
        onMaterialPropsChanged({object_uuid: mesh.uuid, uuid:mesh.material.uuid, key: "color", val: e.target.value})
    };

    // const handleSizeChange = e => {
    //     const value = parseFloat(e.target.value);
    //     onObjectPropsChanged({object_uuid: mesh.uuid, uuid:mesh.uuid, key: "scale", val: [value, value, value]})
    // };

    const handleLineWidthChange = e => {
        onMaterialPropsChanged({object_uuid: mesh.uuid, uuid:mesh.material.uuid, key: "linewidth", val:parseInt(e.target.value)})
    };

    if (isXR){
        return (
            <VRUIContainer position={[1,4,0]}>
                {/*<>*/}
                {/*    <Heading6>Size:</Heading6>*/}
                {/*    <NumberInput value={size} onChange={handleSizeChange}/>*/}
                {/*</>*/}
                <>
                    <Heading6>LineWidth:</Heading6>
                    <NumberInput value={lineWidth} onChange={handleLineWidthChange}/>
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
            {/*<div>*/}
            {/*    <label htmlFor="size">Size:</label>*/}
            {/*    <input*/}
            {/*        type="number"*/}
            {/*        id="size"*/}
            {/*        value={size}*/}
            {/*        onChange={handleSizeChange}*/}
            {/*    />*/}
            {/*</div>*/}
            <div>
                    <label htmlFor="linewidth">LineWidth:</label>
                    <input
                        type="number"
                        id="linewidth"
                        value={lineWidth}
                        onChange={handleLineWidthChange}
                    />
                </div>

        </div>
    );
};

export default LineEditor;
