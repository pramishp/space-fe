import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from './Context/AuthContext'
import AddProject from './Components/AddProject'
import AddCollaboration from './Components/AddCollaboration.js'
import useAxios from './utils/useAxios'
import ProjectCard from './Components/projectCard'

const Dashboard = () => {
  const { user, authTokens, logoutUser } = useContext(AuthContext)
  const api = useAxios()
  console.log(user)

  // const [workspacePin, setWorkspacePin] = useState('')
  // const [presentationLink, setPresentationLink] = useState('')
  const [projects, setProjects] = useState([])
  const [collaborations, setCollaborations] = useState([])
  const [displayAdd, setDisplayAdd] = useState(false)
  const [displayCollab, setDisplayCollab] = useState(false)
  const [presentOptions, setPresentOptions] = useState(false)
  const [presentOptions2, setPresentOptions2] = useState(false)
  useEffect(() => {
    getProjects()
    getCollaborations()
  }, [])
  const getProjects = async () => {
    /* let response = await fetch('http://127.0.0.1:8000/app/project-list/', {
                                      method: 'GET',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: 'Bearer ' + String(authTokens.access),
                                      },
                                    })
                                if (response.status === 200) {
                                    setProjects(response.data)
                                } else if (response.statusText === 'Unauthorized') {
                                    logoutUser()
                                } */
    try {
      const response = await api.get('/app/project-list/')
      console.log(response.data)
      setProjects(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  const getCollaborations = async () => {
    /* let response = await fetch(
                                  'http://127.0.0.1:8000/app/collaborations-list/',
                                  {
                                    method: 'GET',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      Authorization: 'Bearer ' + String(authTokens.access),
                                    },
                                  }
                                ) */
    try {
      const response = await api.get('/app/collaborations-list/')
      setCollaborations(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  const navigate = useNavigate()
  //url to workspace page.
  // authencate
  // TODO: list of users who are authenticated for a project.
  const handleClick = (projectId) => {
    navigate(`/workspace/${projectId}`)
  }

  const handleAddClick = () => {
    setDisplayAdd(true)
  }

  const handleCollabClick = () => {
    setDisplayCollab(true)
  }
  const handleDropDownOption = () => {
    setPresentOptions((prevState) => !prevState)
  }
  const handleDropDownOption2 = () => {
    setPresentOptions2((prevState) => !prevState)
  }
  const handle2dClicked = (workspaceId) => {
    navigate(`presentation/${workspaceId}/2d_interactive`)
  }
  const handleVRClicked = (workspaceId) => {
    navigate(`presentation/${workspaceId}/vr`)
  }
  const handleARClicked = (workspaceId) => {
    navigate(`presentation/${workspaceId}/ar`)
  }
  // get information about every project
  console.log(projects)

  return (
    <>
      <div className='flex flex-col w-screen h-screen text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200'>
        <div className='mr-auto px-10 mt-6'>
          <h1 className='text-2xl font-bold'>Welcome, {user.username}</h1>
        </div>
        <div className='flex flex-grow px-10 mt-4 space-x-6 overflow-auto'>
          <div className='flex flex-col flex-shrink-0 w-72'>
            <div className='flex items-center flex-shrink-0 h-10 px-2'>
              <span className='block text-sm font-semibold'>My Projects</span>
              <span className='flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30'>
                {projects.length}
              </span>
              <button
                onClick={handleAddClick}
                className='flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='h-2/3 overflow-y-scroll'>
              {projects.length !== 0 &&
                projects.map((project) => {
                  return (<ProjectCard project={project} />)
                })}
            </div>
          </div>

          <div className='flex flex-col flex-shrink-0 w-72'>
            <div className='flex items-center flex-shrink-0 h-10 px-2'>
              <span className='block text-sm font-semibold'>
                My Collaborations
              </span>
              <span className='flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30'>
                {collaborations.length}
              </span>
              <button
                onClick={handleCollabClick}
                className='flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='h-2/3 overflow-y-scroll'>
              {collaborations.length !== 0 &&
                collaborations.map((project) => {
                  return (
                    <ProjectCard project={project} />
                  )
                })}
            </div>
          </div>
        </div>
      </div>
      {displayAdd && (
        <AddProject
          projects={projects}
          setProjects={setProjects}
          setDisplayAdd={setDisplayAdd}
        />
      )}
      {displayCollab && (
        <AddCollaboration
          collaborations={collaborations}
          setCollaborations={setCollaborations}
          setDisplayCollab={setDisplayCollab}
        />
      )}
    </>
  )
}

export default Dashboard
