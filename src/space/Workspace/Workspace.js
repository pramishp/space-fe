import {useEffect, useRef, useState} from "react";
import '../../App.css';

import Editor from "../Editor/EditorClass";
import Menu from './Menu';

import {useMultiplayerState} from "../hooks/useMultiplayerState";
import {FILE_TYPES, TYPES} from "../Editor/constants";
import {IMPORT_MESH_TYPES} from "../../common/consts";
import TestCanvas from "../Editor/Editor";


function Workspace({roomId, user, isXR}) {
    const editorRef = useRef();
    const [otherUsers, setOtherUsers] = useState([]);

    const app = {}

    app.pause = () => {
    }

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
        onInsertObject,
        onDelete,
        onInsertGroup,
        onMeshFileInserted,
        onAddChildren,
        onRemoveChildren,
        onAnimationAdd,
        onAnimationDelete,
        onUpdate,
        onBackgroundChange,
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


    function handleKeyDown(event) {
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === 'z' || event.key === 'Z' || event.key === 'KeyZ')) {
            onRedo();
        } else if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
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
    // NOTE: YJS
    app.onMeshInserted = ({uuid, val}) => {
        const objType = val.objects[Object.keys(val.objects)[0]].type;
        const type = objType.indexOf("Light") !== -1 ? "Light" : objType;
        switch (type) {
            case "Mesh":
                const mesh = val.objects[Object.keys(val.objects)[0]]
                const geometry = val.geometries[Object.keys(val.geometries)[0]]
                const material = val.materials[Object.keys(val.materials)[0]]
                onInsertMesh({uuid, mesh, geometry, material})
                break
            case "Light":
                const light = val.objects[Object.keys(val.objects)[0]]
                onInsertObject({uuid, mesh: light})
                break

            case "Group":
                onInsertGroup({uuid, mesh, geometry, material})
                break

            default:
                console.error("No case handled for ", val.type)
                break
        }

    }
    // might not need switch here
    app.onBackgroundAdded = ({ op_type , val }) => {
        console.log('here')
        switch (op_type) {
            case "star":
                onBackgroundChange({op_type, val})
                break
            case "sky":
                break
            case "color":
                break
            case "environment":
                break
        }
    }

    app.insertMesh = ({uuid, val, isFromUndoManager, isMyEvent}) => {
        if (editorRef && editorRef.current) {
            const editor = editorRef.current;
            if (!isMyEvent || isFromUndoManager) {
                editor.insertMesh({uuid, val}, false)
            }
        }
    }

    app.onMeshFileInserted = ({uuid, val})=>{

        onMeshFileInserted({uuid, val})
    }


    app.insertMeshFile = ({uuid, val, isFromUndoManager, isMyEvent}) => {

        if (editorRef && editorRef.current) {
            const editor = editorRef.current;
            if (!isMyEvent || isFromUndoManager) {
                // console.log('mesh file to be inserted', val)
                editor.insertMeshFile({uuid, val}, false)
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

    app.deleteMesh = ({uuid, isFromUndoManager, isMyEvent}) => {
        if (editorRef && editorRef.current) {
            const editor = editorRef.current;
            // console.log('delete Mesh is called')
            if (!isMyEvent || isFromUndoManager) {
                editor.deleteMesh({uuid, instanceId}, false)
            }

        }
    }

    app.onDeleteMesh = ({uuid}) => {

    }

    // updateMesh props
    app.updateObject = ({uuid, key, val, isFromUndoManager, isMyEvent, }) => {
        if (editorRef && editorRef.current) {
            const editor = editorRef.current;
            if (!isMyEvent || isFromUndoManager){
                editor.updateObject({uuid, key, val})
            }
        }
    }

    app.onUpdateObject = ({uuid, key, val, extra}) => {

        onUpdate({uuid, key, val, type: TYPES.MESH, extra})
    }

    app.updateMaterial = ({uuid, key, val, object_uuid}) => {
        if (editorRef && editorRef.current) {
            const editor = editorRef.current;
            editor.updateMaterial({uuid, key, val, object_uuid})
        }
    }

    app.onUpdateMaterial = ({uuid, key, val}) => {
        onUpdate({uuid, key, val, type: TYPES.MATERIAL})

    }

    app.onReplaceGeometry = ({uuid, key, val}) => {

    }

    /*
    * Animation
    * */

    /* A callback function triggered by Editor that takes an object with a `uuid`:(animation uuid)
     and a `val`:(animation object) property and returns nothing */
    app.onAddAnimation = ({uuid, val}) => {
        onAnimationAdd(({uuid, val}))
    }

    app.addAnimation = ({uuid, val, isMyEvent, isFromUndoManager}) => {
        if (editorRef && editorRef.current) {
            const editor = editorRef.current;
            if (!isMyEvent || isFromUndoManager) {
                editor.addAnimation({uuid, val}, false)
            }

        }
    }

    app.onDeleteAnimation = ({uuid}) => {
        onAnimationDelete({uuid})
    }

    app.deleteAnimation = ({uuid, isMyEvent, isFromUndoManager}) => {
        if (editorRef && editorRef.current) {
            const editor = editorRef.current;
            if (!isMyEvent || isFromUndoManager) {
                editor.deleteAnimation({uuid}, false)
            }

        }
    }

    /**
     * `animationOrderChanged` is a callback function triggered by Editor that takes an
     * object with a `uuid`:(animation uuid from slide) and a `to`: (order) property and returns
     * nothing
     */

    app.onAnimationOrderChanged = ({uuid, to}) => {
        console.log(uuid, " applied animation order changed to ", to)
    }

    if (loading) {
        return <div>Loading</div>
    }
    app.onBackgroundChanged = ({op_type}) => {
        console.log(op_type)
    }

    app.onModelUpload = (url) => {
        console.log(url)
        editorRef.current.onModelUpload(url)
    }
    const onModelUpload = (url) => {
        app.onModelUpload(url)
    }
    const initData = getInitData();
    //TODO: Why console.log(initData) here is called 8 times ?


    return (
        <>
            <Menu onModelUpload={onModelUpload}/>
            <div className="App" style={{height: window.innerHeight}}>
                {/*<Canvas>*/}
                {/*<Renderer data={sampleJson} setRefs={setRefs}/>*/}
                {/*    /!*<AnimationApp/>*!/*/}
                {/*</Canvas>*/}
                {/*<TestCanvas/>*/}
                <Editor ref={editorRef} app={app} initData={initData} isXR={isXR} otherUsers={otherUsers}/>
                {/*<MyComponent/>*/}
                {/*<XRApp/>*/}
            </div>
        </>
    );
}

export default Workspace;
