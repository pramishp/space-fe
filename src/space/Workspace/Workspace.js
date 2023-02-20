import {useEffect, useRef, useState} from "react";
import '../../App.css';

import Editor from "../Editor/EditorClass";
import Menu from './Menu';

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


    function handleKeyDown(event){
        if ((event.ctrlKey||event.metaKey) && event.shiftKey && (event.key === 'z'|| event.key === 'Z' || event.key === 'KeyZ')) {
            onRedo();
        } else if ((event.ctrlKey||event.metaKey) && event.key === 'z') {
            onUndo();
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // mesh
    app.onMeshInserted = ({uuid, val, instanceId}) => {
        const mesh = val.objects[Object.keys(val.objects)[0]]
        mesh.instanceId = instanceId; //TODO: better way to send around instance-id
        const geometry = val.geometries[Object.keys(val.geometries)[0]]
        const material = val.materials[Object.keys(val.materials)[0]]
        onInsertMesh({uuid, mesh, geometry, material})
    }

    app.insertMesh = ({ uuid, val, instanceId, isFromUndoManager }) =>{

        if (editorRef && editorRef.current){
            const editor = editorRef.current;
            if (instanceId !== app.user.instanceId || isFromUndoManager){
                console.log('insertMesh', val)
                editor.insertMesh({uuid, val, instanceId}, false)
            }
        }
    }

    /*
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

     */

    // delete

    app.deleteMesh = ({uuid, instanceId, isFromUndoManager})=>{
        if (editorRef && editorRef.current){
            const editor = editorRef.current;
            // console.log('delete Mesh is called')
            if (instanceId !== app.user.instanceId || isFromUndoManager){
                editor.deleteMesh({uuid, instanceId}, false)
            }

        }
    }

    app.onDeleteMesh = ({uuid, instanceId})=>{

    }

    // updateMesh props

    app.updateMesh = ({ uuid, key, val, instanceId })=>{

    }

    app.onUpdateMesh = ({uuid, key, val, instanceId})=>{

    }

    app.updateMaterial = ({ uuid, key, val, instanceId })=>{

    }

    app.onUpdateMaterial = ({uuid, key, val, instanceId})=>{

    }

     app.onReplaceGeometry = ({uuid, key, val, instanceId})=>{

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
        <Menu />
        <div className="App" style={{height: window.innerHeight}}>
            {/*<Canvas>*/}
                {/*<Renderer data={sampleJson} setRefs={setRefs}/>*/}
            {/*    /!*<AnimationApp/>*!/*/}
            {/*</Canvas>*/}
            <Editor ref={editorRef} instanceId={instanceId} app={app} initData={initData} slideData={slideData} isXR={isXR} otherUsers={otherUsers}/>
            {/*<MyComponent/>*/}
            {/*<XRApp/>*/}
        </div>
        </>
    );
}

export default Workspace;
