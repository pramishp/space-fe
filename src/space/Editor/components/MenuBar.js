
import sphereImage from '../../../assets/sphere.jpg'

import React, {useState} from 'react';
import {Interactive} from "@react-three/xr";
import {Box, Text} from "@react-three/drei";
import {Button} from "./VRUIs/Button";
import VRUIContainer from "./VRUIs/VRUIContainer";
import {Heading6} from "./VRUIs/Headings";


function VRMenuItem({menuItem, handleButtonSelect, isXR}) {
    //onCli(ck, onHover, title, isXR
    return (
        <Button
            isXR={isXR}
            title={menuItem.name}
            onClick={() => handleButtonSelect(menuItem)}
        />
    )

}


function MenuBar({
  isXR,
  onMeshSelected,
  onLightSelected,
  onGroupSelected,
  onBackgroundSelected,
}) {
  const meshOptions = [
    { name: 'Sphere', id: 'sphere' },
    { name: 'Box', id: 'box' },
    { name: 'Cylinder', id: 'cylinder' },
    { name: 'Plane', id: 'plane' },
    { name: 'Ellipse', id: 'ellipse' },
  ]

  const lightOptions = [
    { name: 'Ambient', id: 'ambient' },
    { name: 'Directional', id: 'directional' },
    { name: 'Point', id: 'point' },
  ]
  const groupOptions = [{ name: 'Group', id: 'group' }]

  const backgroundOptions = [
    { name: 'Stars', id: 'stars' },
    { name: 'Sky', id: 'sky' },
    { name: 'Color', id: 'color' },
    { name: 'Environment', id: 'environment' },
  ]

  const handleMeshSelected = (id) => {
    // const selectedId = event.target.value
    onMeshSelected(id)
  }


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
        onBackgroundSelected(selectedId)

    }

    const handleButtonSelect = (menuItem) => {
        const selectedId = menuItem.id;
        onMeshSelected(selectedId);
    }
    
  const handleBackgroundSelected = (event) => {
    const selectedId = event.target.value
    console.log('selectedId', selectedId)
    onBackgroundSelected(selectedId)
  }
  
  if (isXR) {
        const meshOptionsJSX = meshOptions.map((menuItem, index) => {

                return <VRMenuItem isXR={isXR} menuItem={menuItem} handleButtonSelect={handleButtonSelect}/>
            }
        )

        const lightOptionsJSX = lightOptions.map((menuItem, index) => {

                    return <VRMenuItem isXR={isXR} menuItem={menuItem} handleButtonSelect={handleButtonSelect}/>
                }
            )

        return (
            <>
                <VRUIContainer position={[-4, 1, 0]} title={"Objects"}>
                    {meshOptionsJSX}
                </VRUIContainer>
                <VRUIContainer position={[-4, 1, -1]} title={"Lights"}>
                    {lightOptionsJSX}
                </VRUIContainer>

            </>
        )
    }

  return (
    <div className='flex flex-col'>
      <h4>Add</h4>
      <h5>Group</h5>
      <select
        className='w-full px-4 py-2 rounded-md border border-gray-300 mt-2 mb-4'
        onChange={handleGroupSelected}
      >
        {groupOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <div className='text-left'>
        <h5 className='mb-2'>Mesh</h5>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        {meshOptions.map((option) => (
          <div key={option.id}>
            <img
              src={sphereImage}
              className='w-24 h-24 cursor-pointer'
              onClick={() => handleMeshSelected(option.id)}
            />
          </div>
        ))}
      </div>
      <h5>Light</h5>
      <select
        className='w-full px-4 py-2 rounded-md border border-gray-300 mt-2 mb-4'
        onChange={handleLightSelected}
      >
        {lightOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <h5>background</h5>
      <select
        className='w-full px-4 py-2 rounded-md border border-gray-300 mt-2'
        onChange={handleBackgroundSelected}
      >
        {backgroundOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default MenuBar
