import { useEffect, useRef, useState } from 'react'
import '../../App.css'

import Editor from '../Editor/EditorClass'
import Menu from './Menu'

import { useMultiplayerState } from '../hooks/useMultiplayerState'
import { FILE_TYPES, TYPES } from '../Editor/constants'
import { IMPORT_MESH_TYPES } from '../../common/consts'
import TestCanvas from '../Editor/Editor'
import { VRButton } from '@react-three/xr'
import * as React from 'react'
import PresentationWrapper, { PRESENTATION_TYPES } from '../PresentationWrapper'

function Workspace({ roomId, user }) {
  const editorRef = useRef()
  const [otherUsers, setOtherUsers] = useState([])
  /*
   * mode 0 : editor
   * mode 1: preview
   * */
  const [mode, setMode] = useState(0)

  const app = {}

  app.pause = () => {}

  app.removeUser = (userId) => {
    // console.log('remove user :', userId.instanceId)
    // setOtherUsers(currentUsers=>{
    //     delete currentUsers[currentUsers.map(i=> i.instanceId).indexOf(userId)]
    //     return [...currentUsers]
    // })
  }

  app.updateUsers = (users) => {
    setOtherUsers([...users])
  }

  const {
    onMount,
    onChangePage,
    onInsertMesh,
    onInsertObject,
    onDelete,
    onInsertGroup,
    onMeshFileInserted,
    onAddChildren,
    onRemoveChildren,
    onAnimationAdd,
    onUpdate,
    onInsertSceneProps,
    onUndo,
    onRedo,
    loading,
    onChangePresence,
    getInitData,
    room,
    instanceId,
  } = useMultiplayerState(roomId, app)

  // load room
  app.room = { roomId, userId: instanceId, users: otherUsers }

  // user handling
  app.user = { instanceId, ...user }

  useEffect(() => {
    onMount(app)
    onChangePresence(app, app.user)
  }, [otherUsers])

  function handleKeyDown(event) {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      (event.key === 'z' || event.key === 'Z' || event.key === 'KeyZ')
    ) {
      onRedo()
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
      onUndo()
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      // delete the selected item
      if (editorRef && editorRef.current) {
        const editor = editorRef.current
        const selectedItems = editor.state.selectedItems
        if (selectedItems.length > 0) {
          selectedItems.forEach((uuid) => {
            editor.deleteMesh({ uuid }, true)
          })
        }
      }
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
      event.preventDefault()
      if (mode !== 1) {
        setMode(1)
      }
    } else if (event.key === 'Escape' || event.key === 'Esc') {
      // set to editor mode if not so
      if (mode !== 0) {
        setMode(0)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mode])

  // mesh
  // NOTE: YJS
  app.onMeshInserted = ({ uuid, val }) => {
    const objType = val.objects[Object.keys(val.objects)[0]].type
    const type = objType.indexOf('Light') !== -1 ? 'Light' : objType
    switch (type) {
      case 'Line':
      case 'Mesh':
        const mesh = val.objects[Object.keys(val.objects)[0]]
        const geometry = val.geometries[Object.keys(val.geometries)[0]]
        const material = val.materials[Object.keys(val.materials)[0]]
        onInsertMesh({ uuid, mesh, geometry, material })
        break
      case 'Light':
        const light = val.objects[Object.keys(val.objects)[0]]
        onInsertObject({ uuid, mesh: light })
        break

      case 'Group':
        onInsertGroup({ uuid, mesh, geometry, material })
        break

      default:
        console.error('No case handled for ', val.type)
        break
    }
  }
  // might not need switch here
  // FIX: 4
  app.onScenePropsAdded = ({ prop_type, op_type, val }) => {
    onInsertSceneProps({ prop_type, op_type, val })
  }

  app.addSceneProps = ({
    prop_type,
    op_type,
    val,
    isFromUndoManager,
    isMyEvent,
  }) => {
    if (editorRef && editorRef.current) {
      const editor = editorRef.current
      if (!isMyEvent || isFromUndoManager) {
        editor.insertSceneProps({ prop_type, op_type, val }, false)
      }
    }
  }

    app.onScenePropsUpdated = ({prop_type, op_type, val}) => {
        onUpdate({prop_type, op_type, val , type:TYPES.SCENE})
    }
    app.updateSceneProps = () => {

    }
    app.onScenePropsDeleted = ({prop_type}) => {
        onDelete({prop_type, type:TYPES.SCENE})
    }
    app.deleteSceneProps = () => {

    }


    app.insertMesh = ({ uuid, val, isFromUndoManager, isMyEvent }) => {
    if (editorRef && editorRef.current) {
      const editor = editorRef.current
      if (!isMyEvent || isFromUndoManager) {
        editor.insertMesh({ uuid, val }, false)
      }
    }
  }

  app.onMeshFileInserted = ({ uuid, val }) => {
    onMeshFileInserted({ uuid, val })
  }

  app.insertMeshFile = ({ uuid, val, isFromUndoManager, isMyEvent }) => {
    if (editorRef && editorRef.current) {
      const editor = editorRef.current
      if (!isMyEvent || isFromUndoManager) {
        // console.log('mesh file to be inserted', val)
        editor.insertMeshFile({ uuid, val }, false)
      }
    }
  }

  /*
      //group
      app.insertGroup = ({ uuid, val, instanceId }) =>{

      }

      app.onInsertGroup = ({ uuid, val, instanceId })=>{

      }

      // add children
      app.addChildren = ({ parent_id, child_id, instanceId }) => {

      }

      app.onAddChildren = ({ parent_id, child_id, instanceId }) =>{

      }

      // remove children
      app.removeChildren = ({ parent_id, child_id, instanceId })=>{

      }

      app.onRemoveChildren = ({parent_id, child_id, instanceId})=>{

      }

       */

  // delete

  app.deleteMesh = ({ uuid, isFromUndoManager, isMyEvent }) => {
    if (editorRef && editorRef.current) {
      const editor = editorRef.current
      // console.log('delete Mesh is called')
      if (!isMyEvent || isFromUndoManager) {
        editor.deleteMesh({ uuid, instanceId }, false)
      }
    }
  }

  app.onDeleteMesh = ({ uuid }) => {
    onDelete({ uuid, type: TYPES.MESH })
  }

  // updateMesh props
  app.updateObject = ({ uuid, key, val, isFromUndoManager, isMyEvent }) => {
    if (editorRef && editorRef.current) {
      const editor = editorRef.current
      if (!isMyEvent || isFromUndoManager) {
        editor.updateObject({ uuid, key, val })
      }
    }
  }

  app.onUpdateObject = ({ uuid, key, val }) => {
    onUpdate({ uuid, key, val, type: TYPES.MESH })
  }

  app.updateMaterial = ({ uuid, key, val, object_uuid }) => {
    if (editorRef && editorRef.current) {
      const editor = editorRef.current
      editor.updateMaterial({ uuid, key, val, object_uuid })
    }
  }

  app.onUpdateMaterial = ({ uuid, key, val }) => {
    onUpdate({ uuid, key, val, type: TYPES.MATERIAL })
  }

  app.onReplaceGeometry = ({ uuid, key, val }) => {}

  /*
   * Animation
   * */

  /* A callback function triggered by Editor that takes an object with a `uuid`:(animation uuid)
       and a `val`:(animation object) property and returns nothing */
  app.onAddAnimation = ({ uuid, val }) => {
    onAnimationAdd({ uuid, val })
  }

  app.addAnimation = ({ uuid, val, isMyEvent, isFromUndoManager }) => {
    if (editorRef && editorRef.current) {
      const editor = editorRef.current
      if (!isMyEvent || isFromUndoManager) {
        editor.addAnimation({ uuid, val }, false)
      }
    }
  }

  app.onUpdateAnimation = ({ uuid, key, val }) => {
    onUpdate({ uuid, key, val, type: TYPES.ANIMATION })
  }

  app.updateAnimation = ({ uuid, key, val, isMyEvent, isFromUndoManager }) => {
    if (editorRef && editorRef.current) {
      const editor = editorRef.current
      if (!isMyEvent || isFromUndoManager) {
        editor.updateAnimation({ uuid, val, key }, false)
      }
    }
  }

  app.onDeleteAnimation = ({ uuid }) => {
    onDelete({ uuid, type: TYPES.ANIMATION })
  }

  app.deleteAnimation = ({ uuid, isMyEvent, isFromUndoManager }) => {
    if (editorRef && editorRef.current) {
      const editor = editorRef.current
      if (!isMyEvent || isFromUndoManager) {
        editor.deleteAnimation({ uuid }, false)
      }
    }
  }

  /**
   * `animationOrderChanged` is a callback function triggered by Editor that takes an
   * object with a `uuid`:(animation uuid from slide) and a `to`: (order) property and returns
   * nothing
   */

  app.onAnimationOrderChanged = ({ uuid, to }) => {
    console.log(uuid, ' applied animation order changed to ', to)
  }

  if (loading) {
    return <div>Loading Data</div>
  }


  app.onModelUpload = (url) => {
    console.log(url)
    editorRef.current.onModelUpload(url)
  }
  const onModelUpload = (url) => {
    app.onModelUpload(url)
  }
  const initData = getInitData()
  //TODO: Why console.log(initData) here is called 8 times ?

  return (
    <>
      <div className='App' style={{ height: window.innerHeight }}>
        {/*<Canvas>*/}
        {/*<Renderer data={sampleJson} setRefs={setRefs}/>*/}
        {/*    /!*<AnimationApp/>*!/*/}
        {/*</Canvas>*/}
        {/*<TestCanvas/>*/}

        {mode === 0 && (
          <Editor
            ref={editorRef}
            app={app}
            initData={initData}
            otherUsers={otherUsers}
            onModelUpload={onModelUpload}
          />
        )}
        {mode === 1 && (
          <PresentationWrapper
            workspaceId={roomId}
            type={PRESENTATION_TYPES['2D_INTERACTIVE']}
          />
        )}

        {/*<MyComponent/>*/}
        {/*<XRApp/>*/}
      </div>
    </>
  )
}

export default Workspace
