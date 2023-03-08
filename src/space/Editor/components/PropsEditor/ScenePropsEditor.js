import React from "react";

export default function ScenePropsEditor({ onScenePropsSelected, scenePropsColor, onScenePropsColorChange, bgMode }) {
    const backgroundOptions = [
        { name: 'Stars', id: 'stars' },
        { name: 'Sky', id: 'sky' },
        { name: 'Color', id: 'color' },
        { name: 'Environment', id: 'environment' },
    ]
    const handleBackgroundSelected = (event) => {
        const selectedId = event.target.value
        onScenePropsSelected(selectedId)
    }

    const handleColorChange = e => {
        onScenePropsColorChange({ color: e.target.value })
        // onMaterialPropsChanged({object_uuid: mesh.uuid, uuid:mesh.material.uuid, key: "color", val: e.target.value})
    };

    return (
        <div class="flex items-center h-12 bg-gray-100 border-b border-gray-300 px-4">
            <label class="font-medium">Background:</label>
            <select class="ml-2 py-2 px-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={bgMode} onChange={handleBackgroundSelected}>
                {backgroundOptions.map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                ))}
            </select>
            <div class="ml-4">
                <label for="color" class="font-medium">Color:</label>
                <input type="color"
                    id="color"
                    value={scenePropsColor}
                    onChange={handleColorChange}
                    class="ml-2 w-8 h-8 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>
    )
}
/* <div style={{
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
//TODO: Add condition for color option display
//
    //
/*{<div>
        <label htmlFor="color">Color:</label>
        <input
    type="color"
    id="color"
    value={scenePropsColor}
    onChange={handleColorChange}
        />
        </div>}
    </div> */
