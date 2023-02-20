import React, { useState } from 'react';
import SphereGeometryEditor from "./SphereGeometryPropsEditor";
import {TYPES} from "../../constants";

const MeshEditor = ({ mesh, onObjectPropsChanged }) => {
    const [color, setColor] = useState('#'+mesh.material.color.getHexString());
    const [size, setSize] = useState(mesh.scale.x);

    const handleColorChange = e => {
        setColor(e.target.value);
        mesh.material.color.set(e.target.value);
        onObjectPropsChanged({uuid:mesh.material.uuid, key: "color", value:e.target.value, type: TYPES.MATERIAL})
    };

    const handleSizeChange = e => {
        setSize(e.target.value);
        mesh.scale.set(e.target.value, e.target.value, e.target.value);
        onObjectPropsChanged({uuid:mesh.uuid, key: "scale", value:e.target.value, type: TYPES.MESH})

    };

    return (
        <div>
            <div>
                <label htmlFor="color">Color:</label>
                <input
                    type="color"
                    id="color"
                    value={color}
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
