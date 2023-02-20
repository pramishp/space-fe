import { useContext, useEffect } from 'react'
import AuthContext from './Workspace/Context/AuthContext'
import WorkspaceContext from './Workspace/Context/WorkspaceContext'
import Workspace from './Workspace/Workspace'

// if a user is logged in and has decided to opne a workspace then create/open a workspace
const WorkspaceWrapper = () => {
  const { user } = useContext(AuthContext)
  const { workspaceId } = useContext(WorkspaceContext)
    useEffect(() => {
        console.log('user changed', user)
    }, [user])
    useEffect(() => {
        console.log('workspaceId changed', workspaceId)
    }, [workspaceId])
  return user && workspaceId ? (
    <Workspace roomId={workspaceId} user={user} />
  ) : (
    <></>
  )
}
export default WorkspaceWrapper
