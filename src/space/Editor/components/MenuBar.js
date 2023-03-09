import sphereImage from '../../../assets/sphere.png'
import cubeImage from '../../../assets/cube.png'

import React, { useState } from 'react'
import { Interactive } from '@react-three/xr'
import { Box, Text } from '@react-three/drei'
import { Button } from './VRUIs/Button'
import VRUIContainer from './VRUIs/VRUIContainer'
import { Heading6 } from './VRUIs/Headings'

function VRMenuItem({ menuItem, handleButtonSelect, isXR }) {
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
  onScenePropsSelected,
}) {
  const meshOptions = [
    { name: 'Sphere', id: 'sphere', img: sphereImage },
    { name: 'Box', id: 'box', img: cubeImage },
    { name: 'Cylinder', id: 'cylinder', img: sphereImage },
    { name: 'Plane', id: 'plane', img: sphereImage },
    { name: 'Ellipse', id: 'ellipse', img: sphereImage },
    { name: 'Line', id: 'line', img: sphereImage },
  ]

  const lightOptions = [
    { name: 'Ambient', id: 'ambient', img:''},
    { name: 'Directional', id: 'directional', img: '' },
    { name: 'Point', id: 'point', img: '' },
  ]
  const groupOptions = [{ name: 'Group', id: 'group', img:''}]

  const backgroundOptions = [
    { name: 'Stars', id: 'stars' , img:''},
    { name: 'Sky', id: 'sky', img:'' },
    { name: 'Color', id: 'color', img:'' },
    { name: 'Environment', id: 'environment', img:'' },
  ]

  const handleMeshSelected = (id) => {
    // const selectedId = event.target.value
    onMeshSelected(id)
  }

  const handleLightSelected = (id) => {
    // const selectedId = event.target.value;
    onLightSelected(id)
  }

  const handleGroupSelected = (id) => {
    // const selectedId = event.target.value;
    onGroupSelected(id)
  }

  const handleButtonSelect = (menuItem) => {
    const selectedId = menuItem.id
    onMeshSelected(selectedId)
  }

  const handleBackgroundSelected = (id) => {
    // const selectedId = event.target.value
    // console.log('selectedId', selectedId)
    onScenePropsSelected(id)
  }

  if (isXR) {
    const meshOptionsJSX = meshOptions.map((menuItem, index) => {
      return (
        <VRMenuItem
          isXR={isXR}
          menuItem={menuItem}
          handleButtonSelect={handleButtonSelect}
        />
      )
    })

    const lightOptionsJSX = lightOptions.map((menuItem, index) => {
      return (
        <VRMenuItem
          isXR={isXR}
          menuItem={menuItem}
          handleButtonSelect={handleButtonSelect}
        />
      )
    })

    return (
      <>
        <VRUIContainer position={[-4, 1, 0]} title={'Objects'}>
          {meshOptionsJSX}
        </VRUIContainer>
        <VRUIContainer position={[-4, 1, -1]} title={'Lights'}>
          {lightOptionsJSX}
        </VRUIContainer>
      </>
    )
  }

  return (
    <div className='flex flex-col'>
      <div className='text-left'>
        <h5 className='mb-2'>Add</h5>
      </div>
      /* <h5>Group</h5>
      <select
        className='w-full px-4 py-2 rounded-md border border-gray-300 mt-2 mb-4'
        onChange={handleGroupSelected}
      >
        {groupOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>{' '}
      */
      <div className='text-left'>
        <h5 className='mb-2'>Mesh</h5>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        {meshOptions.map((option) => (
          <div key={option.id}>
            <img
              src={option.img}
              className='w-24 h-24 cursor-pointer'
              onClick={() => handleMeshSelected(option.id)}
            />
          </div>
        ))}
      </div>
      <div className='text-left'>
        <h5 className='mb-2'>Light</h5>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        {lightOptions.map((option) => (
          <div key={option.id}>
            <img
              src={option.img}
              className='w-24 h-24 cursor-pointer'
              onClick={() => handleLightSelected(option.id)}
            />
          </div>
        ))}
      </div>
      <div className='text-left'>
        <h5 className='mb-2'>background</h5>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        {backgroundOptions.map((option) => (
          <div key={option.id}>
            <img
              src={option.img}
              className='w-24 h-24 cursor-pointer'
              onClick={() => handleBackgroundSelected(option.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MenuBar
