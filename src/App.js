import {useEffect, useRef, useState} from "react";
import {Canvas} from "@react-three/fiber";

import './App.css';
import Renderer from "./space/Renderer";
import AnimationApp from "./space/Animation";
import Presentation from "./space/Presentation";
import XRApp from "./space/webxr";
import Editor from "./space/Editor/EditorClass";
import {BASIC_LIGHTS} from "./space/Editor/constants";
import {MyComponent} from "./space/RefTest";
import {room, useMultiplayerState} from "./space/hooks/useMultiplayerState";
import {roomID} from "./space/store";

function App() {
    const editorRef = useRef();
    const [isXR, setXR] = useState(false);
    let joinedUsers = room.getOthers();
    const [otherUsers, setOtherUsers] = useState(joinedUsers.map(i=>i.presence.tdUser));
    const checkXR = () => {
        if (navigator.xr) {
            setXR(true)
        } else {
            setXR(false)
        }
    }
    useEffect(() => {
        checkXR();
    })

    const {
        onMount,
        onChangePage,
        onInsertMesh,
        onDelete,
        onInsertGroup,
        onAddChildren,
        onRemoveChildren,
        onUpdate,
        onUndo,
        onRedo,
        loading,
        onChangePresence,
        getInitData
    } = useMultiplayerState(roomID);

    useEffect(() => {
        onMount(app);
        onChangePresence(app, app.user)
    }, [isXR, otherUsers]);

    const app = {}

    // load room
    app.loadRoom = (roomId) => {
        app.room = {roomId, userId: room.awareness.clientID, users: otherUsers}
    }

    // user handling
    app.user = {instanceId: room.awareness.clientID, id: room.awareness.clientID} //TODO: change user id

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

    // mesh
    app.onMeshInserted = ({uuid, val, instanceId}) => {
        //TODO: update DB

        const mesh = val.objects[Object.keys(val.objects)[0]]
        mesh.instanceId = instanceId;
        const geometry = val.geometries[Object.keys(val.geometries)[0]]
        const material = val.materials[Object.keys(val.materials)[0]]
        onInsertMesh({uuid, mesh, geometry, material})
    }

    app.insertMesh = ({ uuid, val, instanceId }) =>{
        if (editorRef && editorRef.current){
            const editor = editorRef.current;
            if (instanceId !== app.user.instanceId){
                editor.insertMesh({uuid, val, instanceId})
            }
        }
    }

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

    // delete

    app.deleteMesh = ({uuid, instanceId})=>{

    }

    app.onDeleteMesh = ({uuid, instanceId})=>{

    }

    // updateMesh props

    app.updateMesh = ({ uuid, key, val, instanceId })=>{

    }

    app.onUpdateMesh = ({uuid, key, val, instanceId})=>{

    }


    /**
     * `animationOrderChanged` is a callback function triggered by Editor that takes an
     * object with a `uuid`:(animation uuid from slide) and a `to`: (order) property and returns
     * nothing
     */

    app.onAnimationOrderChanged = ({uuid, to})=>{
        console.log(uuid, " applied animation order changed to ", to)
    }

    let initData = {...getInitData()}
    //TODO: Why console.log(initData) here is called 8 times ?
    const slideData = {};

    const onClick = ()=>{
        if (editorRef){
            console.log(app)
        }
    }

    return (
        <div className="App" style={{height: window.innerHeight}}>
            {/*<Canvas>*/}
                {/*<Renderer data={sampleJson} setRefs={setRefs}/>*/}
            {/*    /!*<AnimationApp/>*!/*/}
            {/*</Canvas>*/}
            <button onClick={onClick}>Get Editor Ref</button>
            <Editor ref={editorRef} app={app} initData={initData} slideData={slideData} isXR={isXR} otherUsers={otherUsers}/>
            {/*<MyComponent/>*/}
            {/*<XRApp/>*/}
        </div>
    );
}

export default App;
