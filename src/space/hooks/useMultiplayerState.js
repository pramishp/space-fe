import {useCallback, useState, useMemo, useEffect} from "react";
import {Room} from "@y-presence/client";
import {WebsocketProvider} from "y-websocket";
import * as Y from "yjs";

import {generateUniqueId, objectToYMap} from "../../utils";
import SingletonSocketProvider from "./Provider";
import {UndoManager} from "yjs";


export function useMultiplayerState(roomId, appInit) {
    const [app, setApp] = useState(appInit);
    const [loading, setLoading] = useState(true);

    const {doc, provider, room} = useMemo(() => {

        // create provider
        const {provider, doc} = new SingletonSocketProvider().getProvider(roomId)
        const room = new Room(provider.awareness);
        return {doc, provider, room}

    }, [roomId])

    const yMeshes = doc.getMap("objects");
    const yGeometry = doc.getMap("geometries");
    const yMaterial = doc.getMap("materials");

    const {undoManager} = useMemo(() => {
        //TODO: undo manager for geometry, materials
        const undoManager = new Y.UndoManager([yMeshes, yGeometry, yMaterial]);
        return {undoManager}
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
            provider.on('sync', function (isSynced) {
                if (doc && isSynced && loading) {
                    setLoading(false);
                    if (app){
                        app.updateUsers(room.getOthers())
                    }

                }
            })
        }
        return () => {

        }
    })

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

    const onInsertMesh = useCallback(({mesh, geometry, material}) => {
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
    },);

    const onInsertGroup = useCallback(({group}) => {
        undoManager.stopCapturing();
        const group_uuid = "group_" + generateUniqueId();
        // create the group in the first transaction
        doc.transact(() => {
            group.uuid = group_uuid;
            const shapesMap = objectToYMap(group);
            yMeshes.set(group_uuid, shapesMap);
        });
    },);

    const onAddChildren = useCallback(({group_id, children_id}) => {
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
    },);

    const onRemoveChildren = useCallback(({children_id}) => {
        undoManager.stopCapturing()
        doc.transact(() => {
            children_id.forEach(item => {
                yMeshes.get(item).delete('parent');
            });
        })
    })

    // there is no dependency array added here. Perhaps the dependency array to be used is the app as well. Just like in the insert method.
    const onDelete = useCallback((id) => {
        undoManager.stopCapturing();
        doc.transact(() => {
            yMeshes.delete(id);
        });
    },);

    const onUpdate = useCallback((uuid, val) => {
        undoManager.stopCapturing();
        doc.transact(() => {
            Object.entries(val).forEach(([id, prop]) => {
                yMeshes.get(uuid).set(id, prop);
            });
            // console.log('transaction: ',shapes)
        });
    },);

    const onUndo = useCallback(() => {
        undoManager.undo();
    },);

    const onRedo = useCallback(() => {
        undoManager.redo();
    },);

    /**
     * Callback to update user's (self) presence
     */
    const onChangePresence = useCallback((app, user) => {
        if (!app.room) return;
        room.setPresence({id: app.room.userId, tdUser: user});
    },);

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

            events.forEach((event) => {
                const parents = Array.from(event.transaction.changedParentTypes);
                const origin = event.transaction.origin;
                const isFromUndoManager = origin instanceof UndoManager
                const level = parents.length; // if level == 4, it is the property of a mesh object like {position, rotation, ...}
                // genericProps are meant to be sent for all callbacks, they contain important decision params like isFromUndoManger
                const genericProps = {isFromUndoManager}
                event.changes.keys.forEach((val, key) => {
                    switch (val.action) {
                        case "update": {
                            const fullData = event.target.toJSON();
                            if (key === "position") {
                                app.updateMesh({
                                    uuid: fullData.uuid,
                                    key: key,
                                    val: fullData[key],
                                    ...genericProps
                                });
                            }
                            break;
                        }
                        case "add":
                            if (level === 1) {
                                const mesh = yMeshes.get(key);
                                const meshJson = mesh.toJSON();
                                // const yMeshObjects = yMeshes.toJSON();

                                // let children_ids = [];
                                const fullData = {
                                    objects: {
                                        [meshJson.uuid]: meshJson,
                                    },
                                };
                                if (isFromUndoManager){
                                    //
                                    app.insertMesh({uuid: key, val: fullData, instanceId, ...genericProps});
                                } else {
                                    // we must also send the group data through here.
                                    app.insertGroup({
                                        uuid: key,
                                        val: fullData,
                                        ...genericProps
                                    });
                                }

                            } else if (level === 3) {
                                // maybe the recursive function needs to be added here.
                                // maybe we can see if the group exists here.
                                if (key === "parent") {
                                    const mesh = event.target.toJSON();
                                    app.addGroupItem({
                                        parent_id: mesh.parent,
                                        child_id: mesh.uuid,
                                    });
                                } else {
                                    const mesh = yMeshes.get(key);
                                    const meshJson = mesh.toJSON();
                                    const instanceId = meshJson.instanceId;
                                    if (meshJson.type === "Group") {
                                        const fullData = {
                                            objects: {
                                                [meshJson.uuid]: meshJson,
                                            },
                                        };

                                        app.insertMesh({uuid: key, val: fullData, instanceId, ...genericProps});
                                    } else if (meshJson.type === "Mesh") {
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
                                        app.insertMesh({uuid: key, val: fullData, instanceId, ...genericProps});
                                    }
                                }
                                // it is a mesh
                            } else if (level === 2) {
                                // it is property of a mesh
                                const parentId = Array.from(parents[1][0]._map.keys())[1];
                            }
                            break;
                        case "delete":
                            if (key === 'parent') {
                                const mesh = event.target.toJSON()
                                app.removeGroupItem(
                                    {
                                        parent_id: val.oldValue,
                                        child_id: mesh.uuid,
                                    }
                                )
                            } else {
                                app.deleteMesh({uuid: key, instanceId, ...genericProps});
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

        async function setup() {
            yMeshes.observeDeep(handleMeshChanges);
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
    },)


    return {
        onMount,
        onInsertMesh,
        onDelete,
        onUpdate,
        onInsertGroup,
        onAddChildren,
        onRemoveChildren,
        onUndo,
        onRedo,
        loading,
        onChangePresence,
        onChangePage,
        getInitData,
        room,
        doc,
        joinedUsers,
        instanceId
    };
}
