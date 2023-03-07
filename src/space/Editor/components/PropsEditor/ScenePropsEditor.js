import React from "react";

export default function ScenePropsEditor({onBackgroundSelected, sceneBackgroundColor, onBackgroundColorChange, bgMode}) {
    const backgroundOptions = [
        { name: 'Stars', id: 'stars' },
        { name: 'Sky', id: 'sky' },
        { name: 'Color', id: 'color' },
        { name: 'Environment', id: 'environment' },
    ]
    const handleBackgroundSelected = (event) => {
        const selectedId = event.target.value
        onBackgroundSelected(selectedId)
    }

    const handleColorChange = e => {
        onBackgroundColorChange({color: e.target.value})
        // onMaterialPropsChanged({object_uuid: mesh.uuid, uuid:mesh.material.uuid, key: "color", val: e.target.value})
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <label>Background:</label>
            <select
                className='w-full px-4 py-2 rounded-md border border-gray-300 mt-2'
                value={bgMode}
                onChange={handleBackgroundSelected}
            >
                {backgroundOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>

            {/*TODO: Add condition for color option display*/}
            {<div>
                <label htmlFor="color">Color:</label>
                <input
                    type="color"
                    id="color"
                    value={sceneBackgroundColor}
                    onChange={handleColorChange}
                />
            </div>}
        </div>
    )
}