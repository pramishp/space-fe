import React, {useState} from 'react';

function MenuBar({isXR, onMeshSelected, onLightSelected, onGroupSelected}) {

    const meshOptions = [
        {name: 'Sphere', id: 'sphere'},
        {name: 'Box', id: 'box'},
        {name: 'Cylinder', id: 'cylinder'},
        {name: 'Plane', id: 'plane'},
        {name: 'Ellipse', id: 'ellipse'}
    ];

    const lightOptions = [
        {name: 'Ambient', id: 'ambient'},
        {name: 'Directional', id: 'directional'},
        {name: 'Point', id: 'point'},
    ];
    const groupOptions = [
        {name: 'Group', id: 'group'},

    ];

    const handleMeshSelected = (event) => {
        const selectedId = event.target.value;
        onMeshSelected(selectedId);
    };

    const handleLightSelected = (event) => {
        const selectedId = event.target.value;
        onLightSelected(selectedId);
    };

    const handleGroupSelected = (event) => {
        const selectedId = event.target.value;
        onGroupSelected(selectedId);
    };


    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <h4>Add</h4>
            <h5>Group</h5>
            <select onChange={handleGroupSelected}>
                {groupOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
            <h5>Mesh</h5>
            <select onChange={handleMeshSelected}>
                {meshOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
            <h5>Light</h5>
            <select onChange={handleLightSelected}>
                {lightOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default MenuBar;
