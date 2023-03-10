import {WebsocketProvider} from "y-websocket";
import * as Y from "yjs";

let singleProvider = null;
let singleDoc = null;

const HOST = 'localhost'
const WS = `ws://${HOST}:1234`
export default class SingletonSocketProvider {
    getProvider(roomId) {

        if (!singleProvider){
            // Create the doc
            singleDoc = new Y.Doc();
            singleProvider = new WebsocketProvider(WS, roomId,
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
                singleProvider = new WebsocketProvider(WS, roomId,
                    singleDoc, {connect: true})
                return {provider: singleProvider, doc: singleDoc};
            }
            return {provider: singleProvider, doc: singleDoc};

        }

    }
}