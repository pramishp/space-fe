import React, {useState} from 'react';
import {Interactive} from "@react-three/xr";
import {Box, Text} from "@react-three/drei";
import {Button} from "./VRUIs/Button";
import VRUIContainer from "./VRUIs/VRUIContainer";


function VRMenuItem({menuItem, handleButtonSelect, position}) {
    //onCli(ck, onHover, title, isXR
    return (
        <Button
            title={menuItem.name}
            onClick={() => handleButtonSelect(menuItem)}
            position={position}
        />
    )

}

function MenuBar({isXR, onMeshSelected, onLightSelected, onGroupSelected, onBackgroundChanged}) {

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

    const backgroundOptions = [
        {name: 'Stars', id: 'stars'},
        {name: 'Sky', id: 'sky'},
        {name: 'Color', id: 'color'},
        {name: 'Environment', id: 'environment'},
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
    const handleBackgroundSelected = (event) => {
        const selectedId = event.target.value;
        console.log('selectedId', selectedId)
        onBackgroundChanged(selectedId)

    }

    const handleButtonSelect = (menuItem) => {
        const selectedId = menuItem.id;
        onMeshSelected(selectedId);
    }

    if (isXR) {
        const options = meshOptions.map((menuItem, index) => {
                // change the position based on the index of the button

                const planePosition = {x: 0, y: 0, z: 0}
                const position = [planePosition.x, 1 - index * 0.08, planePosition.z]

                return <VRMenuItem position={position} menuItem={menuItem} handleButtonSelect={handleButtonSelect}/>
            }
        )

        return <VRUIContainer position={[-1, 0, 1]}>
            {options}
        </VRUIContainer>
    }


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
            <h5>background</h5>
            <select onChange={handleBackgroundSelected}>
                {backgroundOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default MenuBar;
