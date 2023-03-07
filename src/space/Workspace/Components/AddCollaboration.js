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
      navigate(`/workspace/${data.project_id}`)
    } else if (response.statusText === 'Unauthorized') {
      logoutUser()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-opacity-50 backdrop-filter backdrop-blur-sm">      
      <form onSubmit={handleWPSubmit} className="max-w-lg mx-auto">
      <div className="mb-4">
        <input
          type='text'
          placeholder='Enter Workspace Pin'
          value={workspacePin}
          onChange={(event) => setWorkspacePin(event.target.value)}
        />
        </div>
        <div className="flex justify-center">
    <button
      type="submit"
      className="border-2 border-gray-100 focus:outline-none bg-purple-600 text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-purple-700"
    >
      Enter
    </button>
  </div>
      </form>
    </div>
  )
}

export default AddCollaboration
