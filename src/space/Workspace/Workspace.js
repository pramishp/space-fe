import {useEffect, useRef, useState} from "react";
import {Canvas} from "@react-three/fiber";

import '../../App.css';
import Renderer from "../Renderer";
import AnimationApp from "../Animation";
import Presentation from "../Presentation";
import XRApp from "../webxr";
import Editor from "../Editor/EditorClass";
import Main from '../../space/Components/Main';

import {useMultiplayerState} from "../hooks/useMultiplayerState";


function Workspace({roomId, user, isXR}) {
    const editorRef = useRef();
    const [otherUsers, setOtherUsers] = useState([]);

    const app = {}

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
        getInitData,
        room,
        instanceId
    } = useMultiplayerState(roomId, app);

    // load room
    app.room = {roomId, userId: instanceId, users: otherUsers}

    // user handling
    app.user = {id: instanceId, instanceId} //TODO: change user id

    useEffect(() => {
        onMount(app);
        onChangePresence(app, app.user);
    }, [isXR, otherUsers]);

    // console.log('other users: ', instanceId)

    // mesh
    app.onMeshInserted = ({uuid, val, instanceId}) => {
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

    //TODO: Why console.log(initData) here is called 8 times ?
    const slideData = {};

    if (loading){
        return <div>Loading</div>
    }

    const initData = getInitData();

    return (
        <>
        <Main />
        <div className="App" style={{height: window.innerHeight}}>
            {/*<Canvas>*/}
                {/*<Renderer data={sampleJson} setRefs={setRefs}/>*/}
            {/*    /!*<AnimationApp/>*!/*/}
            {/*</Canvas>*/}
            <Editor ref={editorRef} app={app} initData={initData} slideData={slideData} isXR={isXR} otherUsers={otherUsers}/>
            {/*<MyComponent/>*/}
            {/*<XRApp/>*/}
        </div>
        </>
    );
}

export default Workspace;
