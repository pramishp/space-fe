import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../Context/AuthContext'
import useAxios from '../utils/useAxios.js'

const AddCollaboration = (props) => {
  const { authTokens, logoutUser } = useContext(AuthContext)

  const [workspacePin, setWorkspacePin] = useState('')
  const navigate = useNavigate()
  const api = useAxios()
  const handleWPSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = api.get(
        `/app/pid-by-workspace-pin/?workspace_pin=${workspacePin}`
      )
      if (response.status === 200) {
        navigate(``)
      } else if (response.statusText === 'Unauthorized') {
        logoutUser()
      }
    } catch (error) {
      console.log(error)
    }
    props.setDisplayCollab(false)
  }

  return (
    <div className='flex items-center justify-center h-full w-full bg-gray-100 bg-opacity-50 backdrop-filter backdrop-blur-sm' style={{position:'absolute', top:0, left:0}}>
      <form onSubmit={handleWPSubmit} className='max-w-lg mx-auto'>
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Enter Workspace Pin'
            value={workspacePin}
            onChange={(event) => setWorkspacePin(event.target.value)}
            className="bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
          />
        </div>
        <div className='flex justify-center'>
          <button
            type='submit'
            className='border-2 border-gray-100 focus:outline-none bg-purple-600 text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-purple-700'
          >
            Enter
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddCollaboration
