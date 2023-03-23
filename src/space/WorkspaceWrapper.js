import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AuthContext from './Workspace/Context/AuthContext'
import Workspace from './Workspace/Workspace'
import useAxios from './Workspace/utils/useAxios'

//TODO:the new workspace appears along with the dashboard. The dashboard should not appear anymore.
// roomId/workspaceId is found uing project id.
//HACK: does authTokens.access needs to be in the dependency array.
const WorkspaceWrapper = () => {
    const { id } = useParams();
    console.log('id inside workspacewrapper', id)
    console.log('workspace wrapper was called.')
    const { user, authTokens } = useContext(AuthContext)
    const [workspaceId, setWorkspaceId] = useState('')
    const api = useAxios()
    useEffect(() => {
        const fetchWorkspaceId = async () => {
            /* try {
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
            }*/
            try {
                const response = await api.get('/app/workspace-id/?project_id=${id}')
                setWorkspaceId(response.key)
            } catch (error) {
                console.log(error)
            }
        }
        fetchWorkspaceId()
    }, [])

    //TODO: check if the user data is enough
    return (
        <div>
            <Workspace roomId={workspaceId} user={user} />
        </div>

    )
}
export default WorkspaceWrapper
