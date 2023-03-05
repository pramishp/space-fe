import {useContext, useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import AuthContext from "./Workspace/Context/AuthContext"
import Workspace from "./Workspace/Workspace"
import Presentation from "./Presentation";
import {usePresentationData} from "./hooks/usePresentationData";
import {Canvas} from "@react-three/fiber";

// go to this link after the fetch of workspaceId from the presentation link is completed
const PresentationWrapper = () => {
    // const {id} = useParams();
    // console.log('id inside presentationwrapper', id)
    // const {user, authTokens} = useContext(AuthContext)
    // const [workspaceId, setWorkspaceId] = useState(null)
    //
    // useEffect(() => {
    //     const fetchWorkspaceId = async () => {
    //         try {
    //             const response = await fetch(
    //                 `http://127.0.0.1:8000/app/workspace-id/?project_id=${id}`,
    //                 {
    //                     headers: {
    //                         Authorization: 'Bearer ' + String(authTokens.access),
    //                     },
    //                 }
    //             )
    //             const data = await response.json()
    //             setWorkspaceId(data.key)
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    //     fetchWorkspaceId()
    // }, [])

    const workspaceId = '1234-v2.13';
    const {
        loading,
        getData,
        room,
        doc
    } = usePresentationData(workspaceId);
    if (!workspaceId && loading) {
        return <div>Loading...</div>
    }
    const presentationData = getData();

    return (
        <div style={{height: window.innerHeight}}>
            <Canvas legacy={false}
                    camera={{
                        fov: 50, aspect: 1,
                        near: 0.01, far: 1000,
                        position: [0, 5, 10],
                    }}>
                <Presentation data={presentationData}/>
            </Canvas>
        </div>

    )
}

export default PresentationWrapper
