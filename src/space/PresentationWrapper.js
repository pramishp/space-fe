import { useContext, useEffect, useState } from "react"
import AuthContext from "./Workspace/Context/AuthContext"

// go to this link after the fetch of workspaceId from the presentation link is completed
const PresentationWrapper = (props) => {
console.log(props.project_id)
   const {user, authTokens} = useContext(AuthContext)
    const [workspaceId, setWorkspaceId] = useState('')
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
//TODO: send data to the presentation component
  return (
      <div>
      </div>

  )
}

export default PresentationWrapper
