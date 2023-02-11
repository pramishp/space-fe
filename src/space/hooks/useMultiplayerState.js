import {useCallback, useEffect, useState} from "react";
import {Room} from "@y-presence/client";
import {
    awareness, doc, provider, undoManager, yGeometry, yMaterial, yMeshes
} from "../store";
import {generateUniqueId, objectToYMap} from "../../utils";

export const room = new Room(awareness);

export function useMultiplayerState(roomId) {
    const [app, setApp] = useState();
    const [loading, setLoading] = useState(true);

    const onMount = useCallback((app_local) => {
        app_local.loadRoom(roomId);
        app_local.pause();
        setApp(app_local);

    }, [roomId, app]);

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
            // console.log('transaction: ',shapes)
        });
    }, []);

    const onInsertMesh = useCallback(({mesh, geometry, material}) => {
        undoManager.stopCapturing();
        doc.transact(() => {
            // generate unique id
            const mesh_uuid = generateUniqueId();
            const geometry_uuid = generateUniqueId();
            const material_uuid = generateUniqueId();

            //set uuids
            mesh.uuid = mesh_uuid;
            geometry.uuid = geometry_uuid;
            material.uuid = material_uuid;

            // assign geometry and material to mesh
            mesh.geometry = geometry_uuid;
            mesh.material = material_uuid;

            // convert JS object to Yjs Map
            const shapesMap = objectToYMap(mesh);
            const geometryMap = objectToYMap(geometry);
            const materialMap = objectToYMap(material);

            //insert into yJs
            yMeshes.set(mesh_uuid, shapesMap);
            yGeometry.set(geometry_uuid, geometryMap);
            yMaterial.set(material_uuid, materialMap);
        });
    }, [app]);

    const onDelete = useCallback((shapes) => {
        undoManager.stopCapturing();
        doc.transact(() => {
            Object.entries(shapes).forEach(([id, shape]) => {
                yMeshes.delete(id);
            });
        });
    }, []);

    const onUndo = useCallback(() => {
        undoManager.undo();
    }, []);

    const onRedo = useCallback(() => {
        undoManager.redo();
    }, []);

    /**
     * Callback to update user's (self) presence
     */
    const onChangePresence = useCallback((app, user) => {
        if (!app.room) return;
        room.setPresence({id: app.room.userId, tdUser: user});
    }, []);

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
                    app.removeUser(user.id);
                }
            });

            app.updateUsers(users
                .filter((user) => user.presence)
                .map((other) => other.presence.tdUser)
                .filter(Boolean));
        });

        return () => {
            unsubOthers();
        };
    }, [app]);


    useEffect(() => {

        if (!app) return;

        function handleDisconnect() {
            provider.disconnect();
        }

        window.addEventListener("beforeunload", handleDisconnect);

        function handleMeshChanges(events) {

            events.forEach(event => {
                // event.changes.keys
                const parents = Array.from(event.transaction.changedParentTypes)
                const level = parents.length // if level == 4, it is the property of a mesh object like {position, rotation, ...}
                event.changes.keys.forEach((val, key) => {
                    switch (val.action){
                        case "update":

                            break
                        case "add":
                            if (level === 3){
                                // it is a mesh
                                const mesh = yMeshes.get(key);
                                const material = yMaterial.get(mesh.get('material'))
                                const geometry = yGeometry.get(mesh.get('geometry'))

                                const meshJson = mesh.toJSON();
                                const materialJson = material.toJSON();
                                const geometryJson = geometry.toJSON();

                                const fullData = {
                                    'objects': {
                                        [meshJson.uuid]: meshJson
                                    },
                                    'materials': {
                                        [materialJson.uuid]: materialJson
                                    },
                                    'geometries': {
                                        [geometryJson.uuid]: geometryJson
                                    }
                                }
                                app.insertMesh({uuid: key, val: fullData})

                            } else if (level === 2){
                                // it is property of a mesh
                                const parentId = Array.from(parents[1][0]._map.keys())[1]
                            }
                            break
                        case "delete":

                            break
                        default:
                            console.error('no such action')
                    }
                    console.log(key, val.action, 'level:', level)
                })
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

        // console.log('setup called')
        return () => {
            window.removeEventListener("beforeunload", handleDisconnect);
            yMeshes.unobserveDeep(handleMeshChanges);
        };
    }, [app]);

    return {
        onMount, onInsertMesh, onDelete, onUndo, onRedo, loading, onChangePresence, onChangePage
    };
}
