import {useCallback, useEffect, useState} from "react";
import {Room} from "@y-presence/client";
import {
    awareness,
    doc,
    provider,
    undoManager,
    yShapes
} from "../store";

export const room = new Room(awareness);

export function useMultiplayerState(roomId) {
    const [app, setApp] = useState();
    const [loading, setLoading] = useState(true);

    const onMount = useCallback(
        (app_local) => {
            app_local.loadRoom(roomId);
            app_local.pause();
            if (!app) {
                setApp(app_local);
            }

        },
        [roomId, app]
    );

    const onChangePage = useCallback(
        (
            app,
            shapes
        ) => {
            undoManager.stopCapturing();
            doc.transact(() => {

                Object.entries(shapes).forEach(([id, shape]) => {
                    if (!shape) {
                        yShapes.delete(id);
                    } else {
                        yShapes.set(id, shape);
                    }
                });
                // console.log('transaction: ',shapes)
            });
        },
        []
    );

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

            app.updateUsers(
                users
                    .filter((user) => user.presence)
                    .map((other) => other.presence.tdUser)
                    .filter(Boolean)
            );
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

        function handleChanges() {
            // console.log('handle changes called')
            app.replacePageContent(
                Object.fromEntries(yShapes.entries()),
                {}
            );
        }

        async function setup() {
            yShapes.observeDeep(handleChanges);
            handleChanges();
            setLoading(false);
        }

        setup();

        // console.log('setup called')
        return () => {
            window.removeEventListener("beforeunload", handleDisconnect);
            yShapes.unobserveDeep(handleChanges);
        };
    }, [app]);

    return {
        onMount,
        onChangePage,
        onUndo,
        onRedo,
        loading,
        onChangePresence
    };
}
