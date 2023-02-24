import { useContext, useEffect, useState } from 'react'
import AuthContext from './Workspace/Context/AuthContext'
import Workspace from './Workspace/Workspace'


//TODO:the new workspace appears along with the dashboard. The dashboard should not appear anymore.
// roomId/workspaceId is found uing project id.
//HACK: does authTokens.access needs to be in the dependency array.
const WorkspaceWrapper = (props) => {
    console.log('workspace wrapper was called.')
    const { user, authTokens } = useContext(AuthContext)
    const [workspaceId, setWorkspaceId] = useState('')
    //TODO:
    useEffect(() => {
        const fetchWorkspaceId = async () => {
            try {
                const project_id = props.project_id
                const response = await fetch(
                    `http://127.0.0.1:8000/app/workspace-id/?project_id=${project_id}`,
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
    }, [props.project_id])

    //TODO: check if the user data is enough
    return (
        <div>
            <Workspace roomId={workspaceId} user={user} />
        </div>

    )
}
export default WorkspaceWrapper
