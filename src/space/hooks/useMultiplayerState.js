import { useCallback, useEffect, useMemo, useState } from 'react'
import { Room } from '@y-presence/client'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

import { generateUniqueId, objectToYMap } from '../../utils'
import SingletonSocketProvider from './Provider'
import { UndoManager } from 'yjs'
import { TYPES } from '../Editor/constants'
import { IMPORT_MESH_TYPES } from '../../common/consts'
import { keys } from 'lodash'
import { SCENE_PROPS_TYPES } from '../Editor/constants'
import { ConnectingAirportsOutlined } from '@mui/icons-material'
const _ = require('lodash')

export function useMultiplayerState(roomId, appInit) {
  const [app, setApp] = useState(appInit)
  const [loading, setLoading] = useState(true)

  const { doc, provider, room } = useMemo(() => {
    // create provider
    const { provider, doc } = new SingletonSocketProvider().getProvider(roomId)
    const room = new Room(provider.awareness)
    return { doc, provider, room }
  }, [roomId])

  const yMeshes = doc.getMap('objects')
  const yGeometry = doc.getMap('geometries')
  const yMaterial = doc.getMap('materials')
  const yAnimation = doc.getMap('animations')
  const yScene = doc.getMap('scene')

  // const [uuid_l, val_l] = Object.entries(SCENE_PROPS_TYPES['light'])[0]
  // const ambientLight = objectToYMap(val_l)
  // yScene.set(uuid_l, ambientLight)
  //
  // const [uuid_b, val_b] = Object.entries(SCENE_PROPS_TYPES['color'])[0]
  // const backgroundMap = objectToYMap(val_b)
  // yScene.set(uuid_b, backgroundMap)
  // add the light prop here so that it can be passed to the init data.
  // The data to be initialized is inside the constants file in the id light.
  // const yScene = doc.getMap("scene")
  const { undoManager } = useMemo(() => {
    //TODO: undo manager for geometry, materials
    const undoManager = new Y.UndoManager([yMeshes, yGeometry, yMaterial])
    return { undoManager }
  }, [roomId])

  let joinedUsers = room.getOthers()
  const instanceId = room.awareness.clientID

  /*
                              *   app.loadRoom(roomId, room);
                                  app.setInstanceId(room.awareness.clientID);
                                  app.setOtherUsers(joinedUsers)
                                  app.setInitData(doc.toJSON())
                              * */

  const onMount = useCallback(
    (app_local) => {
      // app_local.loadRoom(roomId);
      app_local.pause()
      setApp(app_local)
    },
    [roomId, app]
  )

  useEffect(() => {
    if (provider) {
      provider.on('sync', function (isSynced) {
        if (doc && isSynced && loading) {
          setLoading(false)
          if (app) {
            app.updateUsers(room.getOthers().map((i) => i.presence))
          }
        }
      })
    }
    return () => {}
  })

  const onChangePage = useCallback((app, shapes) => {
    undoManager.stopCapturing()
    doc.transact(() => {
      Object.entries(shapes).forEach(([id, shape]) => {
        if (!shape) {
          yMeshes.delete(id)
        } else {
          yMeshes.set(id, shape)
        }
      })
    })
  }, [])
  // maybe we don't need YJS for the background change implementation.
  const onInsertMesh = useCallback(({ mesh, geometry, material }) => {
    undoManager.stopCapturing()

    doc.transact(() => {
      // convert JS object to Yjs Map
      const shapesMap = objectToYMap(mesh)
      const geometryMap = objectToYMap(geometry)
      const materialMap = objectToYMap(material)

      //insert into yJs
      yMeshes.set(mesh.uuid, shapesMap)
      yGeometry.set(geometry.uuid, geometryMap)
      yMaterial.set(material.uuid, materialMap)
    })
  })

  const onMeshFileInserted = useCallback(({ uuid, val }) => {
    undoManager.stopCapturing()
    // create the group in the first transaction
    doc.transact(() => {
      // convert JS object to Yjs Map
      const shapesMap = objectToYMap({ ...val, isFile: true })
      //insert into yJs
      yMeshes.set(uuid, shapesMap)
    })
  })

  const onInsertObject = useCallback(({ mesh }) => {
    undoManager.stopCapturing()

    doc.transact(() => {
      // convert JS object to Yjs Map
      const shapesMap = objectToYMap(mesh)

      //insert into yJs
      yMeshes.set(mesh.uuid, shapesMap)
    })
  })

  const onInsertGroup = useCallback(({ group }) => {
    undoManager.stopCapturing()
    const group_uuid = 'group_' + generateUniqueId()
    // create the group in the first transaction
    doc.transact(() => {
      group.uuid = group_uuid
      const shapesMap = objectToYMap(group)
      yMeshes.set(group_uuid, shapesMap)
    })
  })

  const onAddChildren = useCallback(({ group_id, children_id }) => {
    undoManager.stopCapturing()
    doc.transact(() => {
      const props = {}
      props.parent = group_id
      const [key, value] = Object.entries(props)[0]
      children_id.forEach((item) => {
        yMeshes.get(item).set(key, value)
      })
    })
  })

  const onRemoveChildren = useCallback(({ children_id }) => {
    undoManager.stopCapturing()
    doc.transact(() => {
      children_id.forEach((item) => {
        yMeshes.get(item).delete('parent')
      })
    })
  })

  // there is no dependency array added here. Perhaps the dependency array to be used is the app as well. Just like in the insert method.
  const onDelete = useCallback(({ uuid, type }) => {
    undoManager.stopCapturing()
    doc.transact(() => {
      switch (type) {
        case TYPES.MESH:
          //TODO: delete associated geometry, materials

          yMeshes.delete(uuid)
          const animationList = _.filter(yAnimation.toJSON(), {
            object_uuid: uuid,
          })
          if (animationList) {
            animationList.forEach((item) => {
              yAnimation.delete(item.uuid)
            })
          }
          break
        case TYPES.ANIMATION:
          yAnimation.delete(uuid)
          break
        case TYPES.MATERIAL:
          yMaterial.delete(uuid)
          break
        case TYPES.GEOMETRY:
          yGeometry.delete(uuid)
          break
        case TYPES.SCENE:
          yScene.delete(uuid)
          break
        default:
          console.error(`No ${type} type found for onDelete`)
      }
    })
  })

  const onUpdate = ({ uuid, key, val, type }) => {
    undoManager.stopCapturing()
    doc.transact(() => {
      switch (type) {
        case TYPES.MATERIAL:
          yMaterial.get(uuid).set(key, val)
          break
        case TYPES.MESH:
          console.log(yMeshes.toJSON())
          console.log(uuid)
          yMeshes.get(uuid).set(key, val)
          break
        case TYPES.ANIMATION:
          yAnimation.get(uuid).set(key, val)
          break
        case TYPES.SCENE:
          // in the background of a scene for the op type star or something else values are set.
          // NOTE:while creating the scene the op_type and val are entered into the map together so the structure needs to change either here or in the initial addition.
          // NOTE: since we are only updating here i will not pass the color hex as an args
          //console.log(yScene.get(uuid).toJSON())
          yScene.get(uuid).set(key, val)
          //console.log(yScene.get(uuid).toJSON())
          break
        default:
            console.log('No such operation found')
            break;
      }
    })
  }

  // maybe we can map the op_type with the associated parameters.
  // FIX: 5
  const onInsertSceneProps = useCallback(({ uuid, val }) => {
    undoManager.stopCapturing()
    doc.transact(() => {
      const sceneMap = objectToYMap(val)
      yScene.set(uuid, sceneMap)
    })
  })
  const onAnimationAdd = useCallback(({ uuid, val }) => {
    undoManager.stopCapturing()
    doc.transact(() => {
      // convert JS object to Yjs Map
      const animationMap = objectToYMap(val)
      //insert into yJs
      yAnimation.set(uuid, animationMap)
    })
  })

  const onUndo = useCallback(() => {
    undoManager.undo()
  })

  const onRedo = useCallback(() => {
    undoManager.redo()
  })

  /**
   * Callback to update user's (self) presence
   */
  const onChangePresence = useCallback((app, user) => {
    if (!app.room) return
    room.setPresence({ id: app.room.userId, tdUser: user })
  })

  /**
   * Update app users whenever there is a change in the room users
   */

  useEffect(() => {
    if (!app || !room) return

    const unsubOthers = room.subscribe('others', (users) => {
      if (!app.room) return
      const ids = users
        .filter((user) => user.presence)
        .map((user) => user.presence.tdUser.id)

      Object.values(app.room.users).forEach((user) => {
        if (user && !ids.includes(user.id) && user.id !== app.room?.userId) {
          app.removeUser(user)
        }
      })

      app.updateUsers(
        users
          .filter((user) => user.presence)
          .map((other) => other.presence)
          .filter(Boolean)
      )
    })

    return () => {
      unsubOthers()
    }
  }, [app, room])

  useEffect(() => {
    if (!app) return

    function handleDisconnect() {
      provider.disconnect()
    }

    window.addEventListener('beforeunload', handleDisconnect)

    function handleMeshChanges(events) {
      events.forEach((event) => {
        const parents = Array.from(event.transaction.changedParentTypes)
        const origin = event.transaction.origin
        const isFromUndoManager = origin instanceof UndoManager
        // isFromSelf holds if the change is client's own change or the event if from a remote client
        const isMyEvent = !(origin instanceof WebsocketProvider)
        const level = parents.length // if level == 4, it is the property of a mesh object like {position, rotation, ...}
        // genericProps are meant to be sent for all callbacks, they contain important decision params like isFromUndoManger
        const genericProps = { isFromUndoManager, isMyEvent }
        event.changes.keys.forEach((val, key) => {
          // console.log(val, key)
          switch (val.action) {
            case 'update':
              const targetData = event.target.toJSON()
              if (level === 2) {
                app.updateObject({
                  uuid: targetData.uuid,
                  key: key,
                  val: targetData[key],
                  ...genericProps,
                })
              } else {
                console.warn('update is not handled for level ', level)
              }
              break
            case 'add':
              if (level === 1) {
                const mesh = yMeshes.get(key)
                const meshJson = mesh.toJSON()
                // lights, undo, delete undo
                let fullData = {
                  objects: {
                    [meshJson.uuid]: meshJson,
                  },
                }

                if (meshJson.type === 'Mesh' || meshJson.type === 'Line') {
                  const material = yMaterial.get(meshJson['material'])
                  const geometry = yGeometry.get(meshJson['geometry'])

                  const materialJson = material.toJSON()
                  const geometryJson = geometry.toJSON()

                  fullData = {
                    ...fullData,
                    materials: {
                      [materialJson.uuid]: materialJson,
                    },
                    geometries: {
                      [geometryJson.uuid]: geometryJson,
                    },
                  }
                }

                if (meshJson.isFile) {
                  app.insertMeshFile({
                    uuid: key,
                    val: meshJson,
                    ...genericProps,
                  })
                } else {
                  app.insertMesh({ uuid: key, val: fullData, ...genericProps })
                }
              } else if (level === 3) {
                const mesh = yMeshes.get(key)
                const meshJson = mesh.toJSON()
                if (meshJson.isFile) {
                  app.insertMeshFile({
                    uuid: key,
                    val: meshJson,
                    ...genericProps,
                  })
                } else {
                  const material = yMaterial.get(mesh.get('material'))
                  const geometry = yGeometry.get(mesh.get('geometry'))

                  const materialJson = material.toJSON()
                  const geometryJson = geometry.toJSON()

                  const fullData = {
                    objects: {
                      [meshJson.uuid]: meshJson,
                    },
                    materials: {
                      [materialJson.uuid]: materialJson,
                    },
                    geometries: {
                      [geometryJson.uuid]: geometryJson,
                    },
                  }
                  // this is where the insertMesh function defined in the renderer gets used
                  app.insertMesh({ uuid: key, val: fullData, ...genericProps })
                }
              } else if (level === 2) {
                // object property add
                const mesh = event.target.toJSON()
                app.updateObject({
                  uuid: mesh.uuid,
                  key: key,
                  val: mesh[key],
                  ...genericProps,
                })
              }
              break
            case 'delete':
              if (key === 'parent') {
                const mesh = event.target.toJSON()
                app.removeGroupItem({
                  parent_id: val.oldValue,
                  child_id: mesh.uuid,
                })
              } else {
                app.deleteMesh({ uuid: key, ...genericProps })
              }
              break
            default:
              console.error('no such action')
          }
        })
      })
      // app.replacePageContent(
      //     Object.fromEntries(yShapes.entries()),
      //     {}
      // );
    }

    function handleMaterialChanges(events) {
      events.forEach((event) => {
        const parents = Array.from(event.transaction.changedParentTypes)
        const origin = event.transaction.origin
        const isFromUndoManager = origin instanceof UndoManager
        const isMyEvent = !(origin instanceof WebsocketProvider)

        const level = parents.length // if level == 4, it is the property of a mesh object like {position, rotation, ...}
        // genericProps are meant to be sent for all callbacks, they contain important decision params like isFromUndoManger
        const genericProps = { isFromUndoManager }
        event.changes.keys.forEach((val, key) => {
          switch (val.action) {
            case 'update':
              //TODO: bug: called 3 times for single event
              const material = event.target.toJSON()
              const objectsList = Object.entries(yMeshes.toJSON()).map(
                ([uuid, val]) => val
              )
              // get mesh uuid
              const object = _.find(objectsList, { material: material.uuid })
              app.updateMaterial({
                uuid: material.uuid,
                object_uuid: object.uuid,
                key,
                val: material[key],
              })
              break

            case 'add':
              break

            case 'delete':
              break

            default:
              console.error('no such action')
          }
        })
      })
    }

    function handleAnimationChanges(events) {
      events.forEach((event) => {
        const parents = Array.from(event.transaction.changedParentTypes)
        const origin = event.transaction.origin
        const isFromUndoManager = origin instanceof UndoManager
        const isMyEvent = !(origin instanceof WebsocketProvider)

        const level = parents.length // if level == 4, it is the property of a mesh object like {position, rotation, ...}
        // genericProps are meant to be sent for all callbacks, they contain important decision params like isFromUndoManger
        const genericProps = { isFromUndoManager }
        event.changes.keys.forEach((val, key) => {
          switch (val.action) {
            case 'update':
              const animation = event.target.toJSON()
              app.updateAnimation({
                uuid: animation.uuid,
                key: key,
                val: animation[key],
                ...genericProps,
              })
              break
            case 'add':
              const data = yAnimation.get(key).toJSON()
              app.addAnimation({ uuid: data.uuid, val: data, ...genericProps })
              break

            case 'delete':
              app.deleteAnimation({ uuid: key, ...genericProps })
              break

            default:
              console.error('no such action')
          }
        })
      })
    }

    function handleSceneChanges(events) {
      events.forEach((event) => {
        const parents = Array.from(event.transaction.changedParentTypes)
        const origin = event.transaction.origin
        const isFromUndoManager = origin instanceof UndoManager
        const isMyEvent = !(origin instanceof WebsocketProvider)

        const level = parents.length
        const genericProps = { isFromUndoManager, isMyEvent }
        // console.log(event.changes.keys)
        event.changes.keys.forEach((val, key) => {
          switch (val.action) {
            case 'add':
              const data = yScene.get(key).toJSON()
              app.addSceneProps({
                uuid: key,
                val: data,
                ...genericProps,
              })
              break
            case 'update':
              const sceneProps = event.target.toJSON()
              console.log('update', sceneProps)
              app.updateSceneProps({
                uuid: sceneProps.uuid,
                key : key,
                val: sceneProps[key],
                ...genericProps,
              })
              // app.updateSceneProps()
              break
            case 'delete':
              app.deleteSceneProps({ uuid: key, ...genericProps })
              break

            default:
              break
          }
        })
      })
    }

    async function setup() {
      yMeshes.observeDeep(handleMeshChanges)
      yMaterial.observeDeep(handleMaterialChanges)
      yAnimation.observeDeep(handleAnimationChanges)
      yScene.observeDeep(handleSceneChanges)
      setLoading(false)
    }

    setup()
    //callback
    // console.log('setup called')
    return () => {
      window.removeEventListener('beforeunload', handleDisconnect)
      yMeshes.unobserveDeep(handleMeshChanges)
      yMaterial.unobserveDeep(handleMaterialChanges)
      yAnimation.unobserveDeep(handleAnimationChanges)
      yScene.unobserveDeep(handleSceneChanges)
    }
  }, [app, doc, yMeshes])

  const getInitData = useCallback(() => {
    if (doc) {
      return provider.doc.toJSON()
    }
    //empty object
    return {}
  })

  return {
    onMount,
    onInsertMesh,
    onInsertObject,
    onMeshFileInserted,
    onDelete,
    onUpdate,
    onInsertGroup,
    onAddChildren,
    onRemoveChildren,
    onAnimationAdd,
    onInsertSceneProps,
    onUndo,
    onRedo,
    loading,
    onChangePresence,
    onChangePage,
    getInitData,
    room,
    doc,
    joinedUsers,
    instanceId,
  }
}
