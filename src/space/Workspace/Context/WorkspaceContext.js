import { createContext, useState } from 'react'

const WorkspaceContext = createContext()

export default WorkspaceContext

export const WorkspaceProvider = ({ children }) => {
    console.log('this function is getting called.')
  let [workspaceId, setWorkspaceId] = useState(null)
  let contextData = {
    workspaceId: workspaceId,
    setWorkspaceId: setWorkspaceId,
  }
  return (
    <WorkspaceContext.Provider value={contextData}>
      {children}
    </WorkspaceContext.Provider>
  )
}
