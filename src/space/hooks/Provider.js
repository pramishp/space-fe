import {WebsocketProvider} from "y-websocket";
import * as Y from "yjs";

let singleProvider = null;
let singleDoc = null;

export default class SingletonSocketProvider {
    getProvider(roomId) {

        if (!singleProvider){
            // Create the doc
            singleDoc = new Y.Doc();
            singleProvider = new WebsocketProvider('ws://localhost:1234', roomId,
                singleDoc, {connect: true})
            return {provider: singleProvider, doc: singleDoc};
        } else {
            // if provider exists and the roomId is different
            if (singleProvider.roomname !== roomId){
                singleProvider.disconnect();
                singleProvider.destroy();
                singleDoc.destroy();

                // create new doc and provider
                singleDoc = new Y.Doc();
                singleProvider = new WebsocketProvider('ws://localhost:1234', roomId,
                    singleDoc, {connect: true})
                return {provider: singleProvider, doc: singleDoc};
            }
            return {provider: singleProvider, doc: singleDoc};

        }

    }
}