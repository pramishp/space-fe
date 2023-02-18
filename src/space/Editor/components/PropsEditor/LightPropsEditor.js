import React, {useState} from 'react';

const LightEditor = ({light}) => {
    const [color, setColor] = useState('#'+light.color.getHexString());
    const [intensity, setIntensity] = useState(light.intensity);
    const [distance, setDistance] = useState(light.distance);
    const [decay, setDecay] = useState(light.decay);

    const handleColorChange = e => {
        setColor(e.target.value);
        light.color.set(e.target.value);
    };

    const handleIntensityChange = e => {
        setIntensity(e.target.value);
        light.intensity = e.target.value;
    };

    const handleDistanceChange = e => {
        setDistance(e.target.value);
        light.distance = e.target.value;
    };

    const handleDecayChange = e => {
        setDecay(e.target.value);
        light.decay = e.target.value;
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
                <input type="color" value={color} onChange={handleColorChange}/>
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
