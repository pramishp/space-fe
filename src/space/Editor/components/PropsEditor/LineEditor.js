import React, { useEffect, useState } from 'react'
import SphereGeometryEditor from './SphereGeometryPropsEditor'
import { TYPES } from '../../constants'
import VRUIContainer from '../VRUIs/VRUIContainer'
import { Heading6 } from '../VRUIs/Headings'
import { NumberInput } from '../VRUIs/NumberInput'

const LineEditor = ({
  mesh,
  onObjectPropsChanged,
  onMaterialPropsChanged,
  isXR,
}) => {
  const size = mesh.scale.x
  const color = mesh.material.color
  const lineWidth = mesh.material.linewidth

  const handleColorChange = (e) => {
    onMaterialPropsChanged({
      object_uuid: mesh.uuid,
      uuid: mesh.material.uuid,
      key: 'color',
      val: e.target.value,
    })
  }

  // const handleSizeChange = e => {
  //     const value = parseFloat(e.target.value);
  //     onObjectPropsChanged({object_uuid: mesh.uuid, uuid:mesh.uuid, key: "scale", val: [value, value, value]})
  // };

  const handleLineWidthChange = (e) => {
    onMaterialPropsChanged({
      object_uuid: mesh.uuid,
      uuid: mesh.material.uuid,
      key: 'linewidth',
      val: parseInt(e.target.value),
    })
  }

  if (isXR) {
    return (
      <VRUIContainer position={[1, 4, 0]}>
        {/*<>*/}
        {/*    <Heading6>Size:</Heading6>*/}
        {/*    <NumberInput value={size} onChange={handleSizeChange}/>*/}
        {/*</>*/}
        <>
          <Heading6>LineWidth:</Heading6>
          <NumberInput value={lineWidth} onChange={handleLineWidthChange} />
        </>
      </VRUIContainer>
    )
  }

  return (
    <div className='flex flex-col items-center h-12 bg-gray-100 border-b border-gray-300 px-4'>
      <div className='flex items-center mb-2'>
        <label htmlFor='color' className='mr-2'>
          Color:
        </label>
        <input
          type='color'
          id='color'
          value={'#' + color.getHexString()}
          onChange={handleColorChange}
          className='w-12 h-8 border border-gray-300 rounded-md'
        />
      </div>

      <div className='flex items-center'>
        <label htmlFor='linewidth' className='mr-2'>
          LineWidth:
        </label>
        <input
          type='number'
          id='linewidth'
          value={lineWidth}
          onChange={handleLineWidthChange}
          className='w-16 px-2 py-1 border border-gray-300 rounded-md'
        />
      </div>
    </div>
  )
}

export default LineEditor
// <div>
//     <div>
//     <label htmlFor="color">Color:</label>
//     <input
// type="color"
// id="color"
// value={'#'+color.getHexString()}
// onChange={handleColorChange}
//     />
//     </div>
//     {/*<div>*/}
// {/*    <label htmlFor="size">Size:</label>*/}
// {/*    <input*/}
// {/*        type="number"*/}
// {/*        id="size"*/}
// {/*        value={size}*/}
// {/*        onChange={handleSizeChange}*/}
// {/*    />*/}
// {/*</div>*/}
//     <div>
//     <label htmlFor="linewidth">LineWidth:</label>
//     <input
// type="number"
// id="linewidth"
// value={lineWidth}
// onChange={handleLineWidthChange}
//     />
//     </div>
//
//     </div>
