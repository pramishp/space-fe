import * as Y from "yjs";
import {WebsocketProvider} from "y-websocket";

const VERSION = 3;

// Create the doc
export const doc = new Y.Doc();

export const roomID = `y-space-${VERSION}`;

// Create a websocket provider
// export const provider = new WebsocketProvider(
//     "wss://demos.yjs.dev",
//     roomID,
//     doc,
//     {
//         connect: true,
//     }
// );

export const provider = new WebsocketProvider('ws://localhost:1234', roomID,
     doc, {connect: true})
//
// Export the provider's awareness API
export const awareness = provider.awareness;

export const yMeshes = doc.getMap("objects");
export const yGeometry = doc.getMap("geometries");
export const yMaterial = doc.getMap("materials");

// Create an undo manager for the shapes and binding maps
export const undoManager = new Y.UndoManager([yMeshes]);
