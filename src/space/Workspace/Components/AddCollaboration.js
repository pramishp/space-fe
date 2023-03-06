import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../Context/AuthContext'

const AddCollaboration = () => {
  const { authTokens, logoutUser } = useContext(AuthContext)

  const [workspacePin, setWorkspacePin] = useState('')
  const navigate = useNavigate()
  const handleWPSubmit = async (event) => {
    event.preventDefault()
    const response = await fetch(
      `http://127.0.0.1:8000/app/pid-by-workspace-pin/?workspace_pin=${workspacePin}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
        },
      }
    )
    const data = await response.json()
    if (response.status === 200) {
        console.log(data)
      navigate(`/workspace/${data.project_id}`)
    } else if (response.statusText === 'Unauthorized') {
      logoutUser()
    }
  }

  return (
    <div>
      <form onSubmit={handleWPSubmit}>
        <input
          type='text'
          placeholder='Enter Workspace Pin'
          value={workspacePin}
          onChange={(event) => setWorkspacePin(event.target.value)}
        />
        <button type='submit'>Enter</button>
      </form>
    </div>
  )
}

export default AddCollaboration
