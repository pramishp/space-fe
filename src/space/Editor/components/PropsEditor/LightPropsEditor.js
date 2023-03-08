import React, {useState} from 'react';
import {Heading5, Heading6} from "../VRUIs/Headings";
import {NumberInput} from "../VRUIs/NumberInput";
import VRUIContainer from "../VRUIs/VRUIContainer";
import {Box} from "@react-three/flex";

const LightEditor = ({light, onObjectPropsChanged, isXR}) => {

    const {color, intensity, distance, decay} = light;

    const handleColorChange = e => {
        onObjectPropsChanged({uuid: light.uuid, key: "color", val: e.target.value})
    };

    const handleIntensityChange = e => {
        onObjectPropsChanged({uuid: light.uuid, key: "intensity", val: parseFloat(e.target.value)})
    };

    const handleDistanceChange = e => {
        onObjectPropsChanged({uuid: light.uuid, key: "distance", val: parseFloat(e.target.value)})
    };

    const handleDecayChange = e => {
        onObjectPropsChanged({uuid: light.uuid, key: "decay", val: parseFloat(e.target.value)})
    };


    if (isXR) {
        return (
            <VRUIContainer position={[1, 4, 0]}>
                <Heading5>Light Editor</Heading5>
                <Box>
                    <Heading6>Intensity:</Heading6>
                    <NumberInput value={intensity}
                             onChange={handleIntensityChange}
                    />
                </Box>
                {light.type === 'PointLight' && (
                    <Box>
                        <Heading6>Distance:</Heading6>
                        <NumberInput
                            value={distance}
                            onChange={handleDistanceChange}
                        />
                    </Box>
                )}
                {light.type === 'PointLight' && (
                    <Box>
                        <Heading6>Decay:</Heading6>
                        <NumberInput value={decay} onChange={handleDecayChange}/>
                    </Box>
                )}

            </VRUIContainer>
            )

    }

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
                    <input type="color" value={'#' + color.getHexString()} onChange={handleColorChange}/>
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
