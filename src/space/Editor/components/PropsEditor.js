import React, { useState } from 'react'
import LightEditor from './PropsEditor/LightPropsEditor'
import GroupEditor from './PropsEditor/GroupPropsEditor'
import MeshEditor from './PropsEditor/MeshPropsEditor'
import { Heading6 } from './VRUIs/Headings'
import { Button } from './VRUIs/Button'
import VRUIContainer from './VRUIs/VRUIContainer'
import { SHAPE_TYPES } from '../constants'
import LineEditor from './PropsEditor/LineEditor'
import { Box } from '@react-three/flex'
import { NumberInput } from './VRUIs/NumberInput'
import ScenePropsEditor from './PropsEditor/ScenePropsEditor'

const _ = require('lodash')
// this is to be displayed on the right sidebar.
function AnimationEditItem({ item, onDelete, isXR, updateAnimation }) {
  const { timeScale } = item
  const onValueChange = (e) => {
    const value = e.target.value
    if (updateAnimation) {
      updateAnimation({ uuid: item.uuid, key: 'timeScale', val: value })

    }
  }
  const tmin = 1,
    tmax = 5
  if (isXR) {
    return (
      <>
        <Box>
          <>
            <Heading6>Time Scale: </Heading6>
            <NumberInput value={timeScale} onChange={onValueChange} />
          </>
        </Box>

        <Box>
          <Button
            title={`${item.name} | Delete`}
            onClick={() => {
              onDelete(item)
            }}
          />
        </Box>
      </>
    )
  }

  return (
    <div class='bg-white shadow-lg rounded-lg p-6'>
      <h6 class='text-lg font-medium mb-4 justify-start'>{item.name}</h6>
      <div class='flex items-center justify-between mb-4'>
        <label for='timeScale' class='text-gray-700 justify-start'>
          TimeScale:
        </label>

        <div className='relative flex items-center'>
          <input
            type='range'
            id='timescale'
            min={tmin}
            max={tmax}
            step='0.01'
            value={timeScale}
            onChange={onValueChange}
            className='w-48 h-4 appearance-none bg-gray-300 rounded-full focus:outline-none focus:ring-2'
            style={{
              background: `linear-gradient(to right, #7F00FF 0%, #7F00FF
            ${((timeScale - 1) / (tmax - tmin)) * 100}%,
            #D5D5D5 ${((timeScale - 1) / (tmax - tmin)) * 100}%,
            #D5D5D5 100%)`,
            }}
          />
        </div>
      </div>
      <button
        class='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg'
        onClick={() => {
          onDelete(item)
        }}
      >
        Delete
      </button>
    </div>
  )
}

export function AnimationEditor({
  animations,
  selectedItems,
  onAnimationDelete,
  updateAnimation,
  isXR,
  setAnimationSidebar,
  animationSidebar,
}) {
  const Empty = isXR ? <></> : <div />
  if (selectedItems.length === 0) {
    return Empty
  }

  const selectedObjectUUID = selectedItems[0]
  const animationList = _.filter(animations, {
    object_uuid: selectedObjectUUID,
  })
  if (animationList.length === 0) {
    return Empty
  }
  // the animations on a object if the previous two condition are met then render the right sidebar.
  // console.log('something has been selected along with some animation.')
  const heading = isXR ? <Heading6>Animations:</Heading6> : <h6>Animations:</h6>
  if (isXR) {
    return (
      <VRUIContainer position={[1, 4, 0]}>
        {heading}
        {animationList.map((item) => {
          return (
            <AnimationEditItem
              isXR={isXR}
              item={item}
              updateAnimation={updateAnimation}
              onDelete={() => onAnimationDelete({ uuid: item.uuid })}
              className='mt-4'
            />
          )
        })}
      </VRUIContainer>
    )
  }
  return (
    <div className='flex flex-col'>
      {heading}
      {animationList.map((item) => {
        return (
          <AnimationEditItem
            isXR={isXR}
            item={item}
            onDelete={() => onAnimationDelete({ uuid: item.uuid })}
            updateAnimation={updateAnimation}
          />
        )
      })}
    </div>
  )
}

export function PropsEditor(props) {
  const { isXR, selectedItems, refs } = props
  // console.log('isXR', isXR)
  const Empty = isXR ? <></> : <div style={{ margin: '40px' }} />
  if (selectedItems.length === 0) {
    // bgMode is not called here
    // return <ScenePropsEditor {...props} />
    return Empty
  }
  // handling single item selection only
  const selectedItemUUID = selectedItems[0]
  // in case the ref.current is null , return null

  if (!(refs[selectedItemUUID] && refs[selectedItemUUID].current)) {
    return Empty
  }
  const object = refs[selectedItemUUID].current

  return (
    <>
      {object.type.indexOf('Light') !== -1 && (
        <LightEditor light={object} {...props} />
      )}
      {/*{object.type.indexOf("Group") !== -1 && <GroupEditor group={object} {...props} />}*/}
      {object.type.indexOf('Mesh') !== -1 && (
        <MeshEditor mesh={object} {...props} />
      )}
      {object.type.indexOf('Line') !== -1 && (
        <LineEditor mesh={object} {...props} />
      )}
      {/*<AnimationEditor {...props} />*/}
    </>
  )
}
