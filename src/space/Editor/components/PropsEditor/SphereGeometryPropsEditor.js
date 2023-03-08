import { Timer10 } from '@mui/icons-material'
import React, { useState } from 'react'
import * as THREE from 'three'

const SphereGeometryEditor = ({ mesh }) => {
  let sphereGeometry = mesh.geometry
  const [radius, setRadius] = useState(sphereGeometry.parameters.radius)
  const [widthSegments, setWidthSegments] = useState(
    sphereGeometry.parameters.widthSegments
  )
  const [heightSegments, setHeightSegments] = useState(
    sphereGeometry.parameters.heightSegments
  )

  const handleRadiusChange = (e) => {
    setRadius(e.target.value)
    mesh.geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    )
  }

  const handleWidthSegmentsChange = (e) => {
    setWidthSegments(e.target.value)
    mesh.geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    )
  }

  const handleHeightSegmentsChange = (e) => {
    setHeightSegments(e.target.value)
    mesh.geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    )
  }
  const rmin = 1,
    rmax = 10
  const wmin = 1,
    wmax = 100
  const hmin = 1,
    hmax = 100
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className='flex items-center space-x-4'>
        <label
          htmlFor='widthSegments'
          className='text-sm uppercase text-gray-600'
        >
          Radius:
        </label>
        <div className='relative flex items-center'>
          <input
            type='range'
            id='widthSegments'
            min={rmin}
            max={rmax}
            step='1'
            value={radius}
            onChange={handleRadiusChange}
            className='w-48 h-4 appearance-none bg-gray-300 rounded-full focus:outline-none focus:ring-2'
            style={{
              background: `linear-gradient(to right, #7F00FF 0%, #7F00FF
            ${((radius - 1) / (rmax - rmin)) * 100}%,
            #D5D5D5 ${((radius - 1) / (rmax - rmin)) * 100}%,
            #D5D5D5 100%)`,
            }}
          />
          {/*<output className='ml-2 text-gray-600'>{widthSegments}</output>*/}
        </div>
      </div>

      <div className='flex items-center space-x-4'>
        <label
          htmlFor='widthSegments'
          className='text-sm uppercase text-gray-600'
        >
          Width Segments:
        </label>
        <div className='relative flex items-center'>
          <input
            type='range'
            id='widthSegments'
            min={wmin}
            max={wmax}
            step='1'
            value={widthSegments}
            onChange={handleWidthSegmentsChange}
            className='w-48 h-4 appearance-none bg-gray-300 rounded-full focus:outline-none focus:ring-2'
            style={{
              background: `linear-gradient(to right, #7F00FF 0%, #7F00FF
            ${((widthSegments - 1) / (wmax - wmin)) * 100}%,
            #D5D5D5 ${((widthSegments - 1) / (wmax - wmin)) * 100}%,
            #D5D5D5 100%)`,
            }}
          />
          {/*<output className='ml-2 text-gray-600'>{widthSegments}</output>*/}
        </div>
      </div>

      <div className='flex items-center space-x-4'>
        <label
          htmlFor='widthSegments'
          className='text-sm uppercase text-gray-600'
        >
          Height Segments:
        </label>
        <div className='relative flex items-center'>
          <input
            type='range'
            id='widthSegments'
            min={hmin}
            max={hmax}
            step='1'
            value={heightSegments}
            onChange={handleHeightSegmentsChange}
            className='w-48 h-4 appearance-none bg-gray-300 rounded-full focus:outline-none focus:ring-2'
            style={{
              background: `linear-gradient(to right, #7F00FF 0%, #7F00FF
            ${((heightSegments - 1) / (hmax - hmin)) * 100}%,
            #D5D5D5 ${((heightSegments - 1) / (hmax - hmin)) * 100}%,
            #D5D5D5 100%)`,
            }}
          />
          {/*<output className='ml-2 text-gray-600'>{widthSegments}</output>*/}
        </div>
      </div>
    </div>
  )
}

export default SphereGeometryEditor
