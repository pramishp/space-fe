import React, { useEffect, useState } from 'react'
import SphereGeometryEditor from './SphereGeometryPropsEditor'
import { TYPES } from '../../constants'
import VRUIContainer from '../VRUIs/VRUIContainer'
import { Heading6 } from '../VRUIs/Headings'
import { NumberInput } from '../VRUIs/NumberInput'

const MeshEditor = ({
  mesh,
  onObjectPropsChanged,
  onMaterialPropsChanged,
  isXR,
}) => {
  const size = mesh.scale.x
  const color = mesh.material.color

  const handleColorChange = (e) => {
    onMaterialPropsChanged({
      object_uuid: mesh.uuid,
      uuid: mesh.material.uuid,
      key: 'color',
      val: e.target.value,
    })
  }

  const handleSizeChange = (e) => {
    const value = parseFloat(e.target.value)
    onObjectPropsChanged({
      object_uuid: mesh.uuid,
      uuid: mesh.uuid,
      key: 'scale',
      val: [value, value, value],
    })
  }

  if (isXR) {
    return (
      <VRUIContainer position={[1, 4, 0]}>
        {/*<>*/}
        {/*    <Heading6>Size:</Heading6>*/}
        {/*    <NumberInput value={size} onChange={handleSizeChange}/>*/}
        {/*</>*/}
      </VRUIContainer>
    )
  }

  return (
    <div className='flex items-center h-12 bg-gray-100 border-b border-gray-300 px-4'>
      <label htmlFor='color' className='font-medium'>
        Color:
      </label>
      <input
        type='color'
        id='color'
        value={'#' + color.getHexString()}
        onChange={handleColorChange}
        className='w-16 h-8 border border-gray-300 rounded-md'
      />
      {mesh.geometry.type === 'SphereGeometry' && (
        <SphereGeometryEditor mesh={mesh} />
      )}
    </div>
  )
}

export default MeshEditor
/* <div
style={{
display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}}
>
<div>
<label htmlFor='color'>Color:</label>
<input
type='color'
id='color'
value={'#' + color.getHexString()}
onChange={handleColorChange}
/>
</div>

{mesh.geometry.type === 'SphereGeometry' && (
    <SphereGeometryEditor mesh={mesh} />
)}
</div> */
