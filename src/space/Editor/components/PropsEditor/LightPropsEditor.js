import React, {useState} from 'react';

const LightEditor = ({light, onObjectPropsChanged}) => {

    const {color, intensity, distance, decay} = light;

    const handleColorChange = e => {
        onObjectPropsChanged({uuid: light.uuid, key: "color", val: e.target.value})
    };

    const handleIntensityChange = e => {
        onObjectPropsChanged({uuid: light.uuid, key: "intensity", val: e.target.value})
    };

    const handleDistanceChange = e => {
        onObjectPropsChanged({uuid: light.uuid, key: "distance", val: e.target.value})
    };

    const handleDecayChange = e => {
        onObjectPropsChanged({uuid: light.uuid, key: "decay", val: e.target.value})
    };

    return (
        <div>
            <h5>Light Editor</h5>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
            <div>
                <label>Color:</label>
                <input type="color" value={'#'+color.getHexString()} onChange={handleColorChange}/>
            </div>
            <div>
                <label>Intensity:</label>
                <input
                    type="number"
                    value={intensity}
                    onChange={handleIntensityChange}
                />
            </div>
            {light.type === 'PointLight' && (
                <div>
                    <label>Distance:</label>
                    <input
                        type="number"
                        value={distance}
                        onChange={handleDistanceChange}
                    />
                </div>
            )}
            {light.type === 'PointLight' && (
                <div>
                    <label>Decay:</label>
                    <input type="number" value={decay} onChange={handleDecayChange}/>
                </div>
            )}
            </div>
        </div>
    );
};

export default LightEditor;
