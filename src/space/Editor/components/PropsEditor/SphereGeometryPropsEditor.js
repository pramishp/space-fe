import React, { useState } from 'react';
import * as THREE from 'three';

const SphereGeometryEditor = ({ mesh }) => {
    let sphereGeometry = mesh.geometry;
    const [radius, setRadius] = useState(sphereGeometry.parameters.radius);
    const [widthSegments, setWidthSegments] = useState(sphereGeometry.parameters.widthSegments);
    const [heightSegments, setHeightSegments] = useState(sphereGeometry.parameters.heightSegments);

    const handleRadiusChange = e => {
        setRadius(e.target.value);
        mesh.geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    };

    const handleWidthSegmentsChange = e => {
        setWidthSegments(e.target.value);
        mesh.geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    };

    const handleHeightSegmentsChange = e => {
        setHeightSegments(e.target.value);
        mesh.geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div>
                <label htmlFor="radius">Radius:</label>
                <input
                    type="number"
                    id="radius"
                    value={radius}
                    onChange={handleRadiusChange}
                />
            </div>
            <div>
                <label htmlFor="widthSegments">Width Segments:</label>
                <input
                    type="number"
                    id="widthSegments"
                    value={widthSegments}
                    onChange={handleWidthSegmentsChange}
                />
            </div>
            <div>
                <label htmlFor="heightSegments">Height Segments:</label>
                <input
                    type="number"
                    id="heightSegments"
                    value={heightSegments}
                    onChange={handleHeightSegmentsChange}
                />
            </div>
        </div>
    );
};

export default SphereGeometryEditor;
