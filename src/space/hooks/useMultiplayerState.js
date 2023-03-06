import { useCallback, useEffect, useMemo, useState } from "react";
import { Room } from "@y-presence/client";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

import { generateUniqueId, objectToYMap } from "../../utils";
import SingletonSocketProvider from "./Provider";
import { UndoManager } from "yjs";
import { TYPES } from "../Editor/constants";
import { IMPORT_MESH_TYPES } from "../../common/consts";
import { keys } from "lodash";

const _ = require("lodash");

export function useMultiplayerState(roomId, appInit) {
    const [app, setApp] = useState(appInit);
    const [loading, setLoading] = useState(true);

    const { doc, provider, room } = useMemo(() => {
        // create provider
        const { provider, doc } = new SingletonSocketProvider().getProvider(roomId);
        const room = new Room(provider.awareness);
        return { doc, provider, room };
    }, [roomId]);

    const yMeshes = doc.getMap("objects");
    const yGeometry = doc.getMap("geometries");
    const yMaterial = doc.getMap("materials");
    const yAnimation = doc.getMap("animations");
    const yScene = doc.getMap("scene");
    // const yScene = doc.getMap("scene")
    const { undoManager } = useMemo(() => {
        //TODO: undo manager for geometry, materials
        const undoManager = new Y.UndoManager([yMeshes, yGeometry, yMaterial]);
        return { undoManager };
    }, [roomId]);

    let joinedUsers = room.getOthers();
    const instanceId = room.awareness.clientID;

    /*
      *   app.loadRoom(roomId, room);
          app.setInstanceId(room.awareness.clientID);
          app.setOtherUsers(joinedUsers)
          app.setInitData(doc.toJSON())
      * */

    const onMount = useCallback(
        (app_local) => {
            // app_local.loadRoom(roomId);
            app_local.pause();
            setApp(app_local);
        },
        [roomId, app],
    );

    useEffect(() => {
        if (provider) {
            provider.on("sync", function(isSynced) {
                if (doc && isSynced && loading) {
                    setLoading(false);
                    if (app) {
                        app.updateUsers(room.getOthers());
                    }
                }
            });
        }
        return () => {
        };
    });

    const onChangePage = useCallback((app, shapes) => {
        undoManager.stopCapturing();
        doc.transact(() => {
            Object.entries(shapes).forEach(([id, shape]) => {
                if (!shape) {
                    yMeshes.delete(id);
                } else {
                    yMeshes.set(id, shape);
                }
            });
        });
    }, []);
    // maybe we don't need YJS for the background change implementation.
    const onInsertMesh = useCallback(({ mesh, geometry, material }) => {
        undoManager.stopCapturing();

        doc.transact(() => {
            // convert JS object to Yjs Map
            const shapesMap = objectToYMap(mesh);
            const geometryMap = objectToYMap(geometry);
            const materialMap = objectToYMap(material);

            //insert into yJs
            yMeshes.set(mesh.uuid, shapesMap);
            yGeometry.set(geometry.uuid, geometryMap);
            yMaterial.set(material.uuid, materialMap);
        });
    });

    const onMeshFileInserted = useCallback(({ uuid, val }) => {
        undoManager.stopCapturing();
        // create the group in the first transaction
        doc.transact(() => {
            // convert JS object to Yjs Map
            const shapesMap = objectToYMap({ ...val, isFile: true });
            //insert into yJs
            yMeshes.set(uuid, shapesMap);
        });
    });

    const onInsertObject = useCallback(({ mesh }) => {
        undoManager.stopCapturing();

        doc.transact(() => {
            // convert JS object to Yjs Map
            const shapesMap = objectToYMap(mesh);

            //insert into yJs
            yMeshes.set(mesh.uuid, shapesMap);
        });
    });

    const onInsertGroup = useCallback(({ group }) => {
        undoManager.stopCapturing();
        const group_uuid = "group_" + generateUniqueId();
        // create the group in the first transaction
        doc.transact(() => {
            group.uuid = group_uuid;
            const shapesMap = objectToYMap(group);
            yMeshes.set(group_uuid, shapesMap);
        });
    });

    const onAddChildren = useCallback(({ group_id, children_id }) => {
        undoManager.stopCapturing();
        doc.transact(() => {
            const props = {};
            props.parent = group_id;
            const [key, value] = Object.entries(props)[0];
            console.log(key, value, children_id);
            children_id.forEach((item) => {
                yMeshes.get(item).set(key, value);
            });
        });
    });

    const onRemoveChildren = useCallback(({ children_id }) => {
        undoManager.stopCapturing();
        doc.transact(() => {
            children_id.forEach((item) => {
                yMeshes.get(item).delete("parent");
            });
        });
    });

    // there is no dependency array added here. Perhaps the dependency array to be used is the app as well. Just like in the insert method.
    const onDelete = useCallback((id) => {
        undoManager.stopCapturing();
        doc.transact(() => {
            yMeshes.delete(id);
        });
    });

    const onUpdate = useCallback(({ uuid, key, val, type }) => {
        undoManager.stopCapturing();
        doc.transact(() => {
            switch (type) {
                case TYPES.MATERIAL:
                    yMaterial.get(uuid).set(key, val);
                    break;
                case TYPES.MESH:
                    yMeshes.get(uuid).set(key, val);
                    break;
                default:
                    console.error("No case handled for ", type, "onUpdate");
            }
        });
    });

    // maybe we can map the op_type with the associated parameters.
    // FIX: 5
    const onScenePropChange = useCallback(({ prop_type, op_type, val }) => {
        console.log('onScenePropChanged')
        undoManager.stopCapturing();
        doc.transact(() => {
            // const params to Yjs map
            console.log(val)
            const backgroundMap = objectToYMap({op_type, val});
            console.log(backgroundMap);
            // insert into yjs

            yScene.set(prop_type, backgroundMap);
            //yScene.set(background, )
            //scene: {background:{ op_type: {} , val: {}}}
        });
    });
    const onAnimationAdd = useCallback(({ uuid, val }) => {
        undoManager.stopCapturing();
        doc.transact(() => {
            // convert JS object to Yjs Map
            const animationMap = objectToYMap(val);
            //insert into yJs
            yAnimation.set(uuid, animationMap);
        });
    });

    const onAnimationDelete = useCallback(({ uuid }) => {
        undoManager.stopCapturing();
        doc.transact(() => {
            yAnimation.delete(uuid);
        });
    });

    const onUndo = useCallback(() => {
        undoManager.undo();
    });

    const onRedo = useCallback(() => {
        undoManager.redo();
    });

    /**
     * Callback to update user's (self) presence
     */
    const onChangePresence = useCallback((app, user) => {
        if (!app.room) return;
        room.setPresence({ id: app.room.userId, tdUser: user });
    });

    /**
     * Update app users whenever there is a change in the room users
     */

    useEffect(() => {
        if (!app || !room) return;

        const unsubOthers = room.subscribe("others", (users) => {
            if (!app.room) return;
            const ids = users
                .filter((user) => user.presence)
                .map((user) => user.presence.tdUser.id);

            Object.values(app.room.users).forEach((user) => {
                if (user && !ids.includes(user.id) && user.id !== app.room?.userId) {
                    app.removeUser(user);
                }
            });

            app.updateUsers(
                users
                    .filter((user) => user.presence)
                    .map((other) => other.presence.tdUser)
                    .filter(Boolean),
            );
        });

        return () => {
            unsubOthers();
        };
    }, [app, room]);

    useEffect(() => {
        if (!app) return;

        function handleDisconnect() {
            provider.disconnect();
        }

        window.addEventListener("beforeunload", handleDisconnect);

        function handleMeshChanges(events) {
            console.log('here')
            console.log(events)
            events.forEach((event) => {
                const parents = Array.from(event.transaction.changedParentTypes);
                const origin = event.transaction.origin;
                const isFromUndoManager = origin instanceof UndoManager;
                // isFromSelf holds if the change is client's own change or the event if from a remote client
                const isMyEvent = !(origin instanceof WebsocketProvider);
                const level = parents.length; // if level == 4, it is the property of a mesh object like {position, rotation, ...}
                // genericProps are meant to be sent for all callbacks, they contain important decision params like isFromUndoManger
                const genericProps = { isFromUndoManager, isMyEvent };
                event.changes.keys.forEach((val, key) => {
                    console.log(val, key)
                    switch (val.action) {
                        case "update":
                            const targetData = event.target.toJSON();
                            if (level === 2) {
                                app.updateObject({
                                    uuid: targetData.uuid,
                                    key: key,
                                    val: targetData[key],
                                    ...genericProps,
                                });
                            } else {
                                console.warn("update is not handled for level ", level);
                            }
                            break;
                        case "add":
                            if (level === 1) {
                                const mesh = yMeshes.get(key);
                                const meshJson = mesh.toJSON();
                                // lights, undo,
                                const fullData = {
                                    objects: {
                                        [meshJson.uuid]: meshJson,
                                    },
                                };

                                if (meshJson.isFile) {
                                    app.insertMeshFile({
                                        uuid: key,
                                        val: meshJson,
                                        ...genericProps,
                                    });
                                } else {
                                    app.insertMesh({ uuid: key, val: fullData, ...genericProps });
                                }
                            } else if (level === 3) {
                                const mesh = yMeshes.get(key);
                                const meshJson = mesh.toJSON();
                                if (meshJson.isFile) {
                                    app.insertMeshFile({
                                        uuid: key,
                                        val: meshJson,
                                        ...genericProps,
                                    });
                                } else {
                                    const material = yMaterial.get(mesh.get("material"));
                                    const geometry = yGeometry.get(mesh.get("geometry"));

                                    const materialJson = material.toJSON();
                                    const geometryJson = geometry.toJSON();

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
                                    };
                                    // this is where the insertMesh function defined in the renderer gets used
                                    app.insertMesh({ uuid: key, val: fullData, ...genericProps });
                                }
                            } else if (level === 2) {
                                // object property add
                                const mesh = event.target.toJSON();
                                app.updateObject({
                                    uuid: mesh.uuid,
                                    key: key,
                                    val: mesh[key],
                                    ...genericProps,
                                });
                            }
                            break;
                        case "delete":
                            if (key === "parent") {
                                const mesh = event.target.toJSON();
                                app.removeGroupItem(
                                    {
                                        parent_id: val.oldValue,
                                        child_id: mesh.uuid,
                                    },
                                );
                            } else {
                                app.deleteMesh({ uuid: key, ...genericProps });
                            }
                            break;
                        default:
                            console.error("no such action");
                    }
                    //console.log('handle mesh changes called')
                    //console.log(key, val.action, 'level:', level)
                });
            });
            // app.replacePageContent(
            //     Object.fromEntries(yShapes.entries()),
            //     {}
            // );
        }

        function handleMaterialChanges(events) {
            events.forEach((event) => {
                const parents = Array.from(event.transaction.changedParentTypes);
                const origin = event.transaction.origin;
                const isFromUndoManager = origin instanceof UndoManager;
                const isMyEvent = !(origin instanceof WebsocketProvider);

                const level = parents.length; // if level == 4, it is the property of a mesh object like {position, rotation, ...}
                // genericProps are meant to be sent for all callbacks, they contain important decision params like isFromUndoManger
                const genericProps = { isFromUndoManager };
                event.changes.keys.forEach((val, key) => {
                    switch (val.action) {
                        case "update":
                            //TODO: bug: called 3 times for single event
                            const material = event.target.toJSON();
                            const objectsList = Object.entries(yMeshes.toJSON()).map((
                                [uuid, val],
                            ) => val);
                            // get mesh uuid
                            const object = _.find(objectsList, { material: material.uuid });
                            app.updateMaterial({
                                uuid: material.uuid,
                                object_uuid: object.uuid,
                                key,
                                val: material[key],
                            });
                            break;

                        case "add":
                            break;

                        case "delete":
                            break;

                        default:
                            console.error("no such action");
                    }
                    //console.log('handle mesh changes called')
                    //console.log(key, val.action, 'level:', level)
                });
            });
        }

        function handleAnimationChanges(events) {
            events.forEach((event) => {
                const parents = Array.from(event.transaction.changedParentTypes);
                const origin = event.transaction.origin;
                const isFromUndoManager = origin instanceof UndoManager;
                const isMyEvent = !(origin instanceof WebsocketProvider);

                const level = parents.length; // if level == 4, it is the property of a mesh object like {position, rotation, ...}
                // genericProps are meant to be sent for all callbacks, they contain important decision params like isFromUndoManger
                const genericProps = { isFromUndoManager };
                event.changes.keys.forEach((val, key) => {
                    switch (val.action) {
                        case "update":
                            break;
                        case "add":
                            const data = yAnimation.get(key).toJSON();
                            app.addAnimation({ uuid: data.uuid, val: data, ...genericProps });
                            break;

                        case "delete":
                            app.deleteAnimation({ uuid: key, ...genericProps });
                            break;

                        default:
                            console.error("no such action");
                    }
                    //console.log('handle mesh changes called')
                    //console.log(key, val.action, 'level:', level)
                });
            });
        }

        function handleSceneChanges(events){
            console.log('here')
            console.log('events',events)
            events.forEach((event) => {
                const parents = Array.from(event.transaction.changedParentTypes);
                const origin = event.transaction.origin;
                const isFromUndoManager = origin instanceof UndoManager;
                const isMyEvent = !(origin instanceof WebsocketProvider);

                const level = parents.length;
                const genericProps = { isFromUndoManager, isMyEvent };

                event.changes.keys.forEach((val, key)=>{
                    console.log(val, key)
                    switch (val.action) {
                        case 'add':
                            const data = yScene.get(key).toJSON();
                            console.log(data);
                            app.addBackground({prop_type: key, op_type: data.op_type, val: data.val, ...genericProps})
                            break;

                        default:
                            break;
                    }

                })
            })
        }
        async function setup() {
            yMeshes.observeDeep(handleMeshChanges);
            yMaterial.observeDeep(handleMaterialChanges);
            yAnimation.observeDeep(handleAnimationChanges);
            yScene.observeDeep(handleSceneChanges);
            setLoading(false);
        }

        setup();
        //callback
        // console.log('setup called')
        return () => {
            window.removeEventListener("beforeunload", handleDisconnect);
            yMeshes.unobserveDeep(handleMeshChanges);
        };
    }, [app, doc, yMeshes]);

    const getInitData = useCallback(() => {
        if (doc) {
            return doc.toJSON();
        }
        //empty object
        return {};
    });

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
        onAnimationDelete,
        onScenePropChange,
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
    };
}
