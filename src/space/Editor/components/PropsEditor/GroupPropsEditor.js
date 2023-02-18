import React, { useState } from 'react';

const GroupEditor = ({ group }) => {
    const [scale, setScale] = useState(group.scale.x);

    const handleScaleChange = e => {
        setScale(e.target.value);
        group.scale.set(e.target.value, e.target.value, e.target.value);
    };

    return (
        <div>
            <h3>Group Editor</h3>
            <div>
                <label>Scale:</label>
                <input type="number" value={scale} onChange={handleScaleChange} />
            </div>
        </div>
    );
};

export default GroupEditor;
