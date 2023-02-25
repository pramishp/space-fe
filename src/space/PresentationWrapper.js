import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AuthContext from "./Workspace/Context/AuthContext"
import Workspace from "./Workspace/Workspace"

// go to this link after the fetch of workspaceId from the presentation link is completed
const PresentationWrapper = () => {
    const { id } = useParams();
    console.log('id inside presentationwrapper', id)
    const { user, authTokens } = useContext(AuthContext)
    const [workspaceId, setWorkspaceId] = useState('')
    useEffect(() => {
        const fetchWorkspaceId = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/app/workspace-id/?project_id=${id}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + String(authTokens.access),
                        },
                    }
                )
                const data = await response.json()
                setWorkspaceId(data.key)
            } catch (error) {
                console.log(error)
            }
        }
        fetchWorkspaceId()
    }, [])
    //TODO: send data to the presentation component
    return (
        <div>
            <Workspace roomId={workspaceId} user={user} />
        </div>

    )
}

export default PresentationWrapper
