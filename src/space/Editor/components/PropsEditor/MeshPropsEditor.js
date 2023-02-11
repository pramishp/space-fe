import React, { useState } from 'react';
import * as THREE from 'three';
import SphereGeometryEditor from "./SphereGeometryPropsEditor";

const MeshEditor = ({ mesh }) => {
    const [color, setColor] = useState('#'+mesh.material.color.getHexString());
    const [size, setSize] = useState(mesh.scale.x);

    const handleColorChange = e => {
        setColor(e.target.value);
        mesh.material.color.set(e.target.value);
    };

    const handleSizeChange = e => {
        setSize(e.target.value);
        mesh.scale.set(e.target.value, e.target.value, e.target.value);
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
