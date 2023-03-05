import {useCallback, useState, useMemo, useEffect} from "react";
import {Room} from "@y-presence/client";
import SingletonSocketProvider from "./Provider";
import {ANIMATION_TYPES} from "../Editor/constants";

export function usePresentationData(roomId) {
    const [loading, setLoading] = useState(true);

    const {doc, provider, room} = useMemo(() => {

        // create provider
        const {provider, doc} = new SingletonSocketProvider().getProvider(roomId)
        const room = new Room(provider.awareness);
        return {doc, provider, room}

    }, [roomId]);

    const yMeshes = doc.getMap("objects");
    const yGeometry = doc.getMap("geometries");
    const yMaterial = doc.getMap("materials");
    const yAnimation = doc.getMap("animations");

    useEffect(() => {
        console.log('getting called')
        if (provider) {
            provider.on('sync', function (isSynced) {
                if (doc && isSynced && loading) {
                    setLoading(false);
                }
            })
        }
        return () => {

        }
    }, [roomId]);

    const getData = useCallback(() => {
        console.log('getting called')
        if (doc) {
            // formatting data for support in presentation layer
            const presentationData = doc.toJSON();
            const slideKey = "uuid-834kjasf";
            presentationData.slides = {
                [slideKey]: {
                    uuid: slideKey,
                    order: 0,
                    animations: {}
                }
            }
            const animations = {};
            Object.entries(presentationData.animations).forEach(([uuid, i]) => {
                i.animation_uuid = uuid;
                presentationData.slides[slideKey].animations[uuid] = i

                if (i.animationType === ANIMATION_TYPES.KEYFRAME){
                    animations[uuid] = i.keyframe_animation;
                } else if (i.animationType === ANIMATION_TYPES.PATH){
                    animations[uuid] = i.path_animation;
                } else {
                    console.error(`No ${i.animationType} case is handled`)
                }
                // animation_uuid
            })
            presentationData.animations = animations;
            return presentationData;
        }
        //empty object
        return {};
    },)

    return {
        loading,
        getData,
        room,
        doc
    };
}
