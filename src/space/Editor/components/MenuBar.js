import React, { useState } from 'react'
import sphereImage from '../../../assets/sphere.jpg'

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
    const selectedId = event.target.value
    onLightSelected(selectedId)
  }

  const handleGroupSelected = (event) => {
    const selectedId = event.target.value
    onGroupSelected(selectedId)
  }
  const handleBackgroundSelected = (event) => {
    const selectedId = event.target.value
    console.log('selectedId', selectedId)
    onBackgroundSelected(selectedId)
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
