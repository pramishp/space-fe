import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from './Context/AuthContext'
import AddProject from './Components/AddProject'
import AddCollaboration from './Components/AddCollaboration.js'
import useAxios from './utils/useAxios'

const Dashboard = () => {
  const { user, authTokens, logoutUser } = useContext(AuthContext)
  const api = useAxios()

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
                  return (
                    <div className='flex flex-col pb-2 overflow-auto'>
                      <div
                        className='relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100'
                        onClick={() => handleClick(project.id)}
                      >
                        <button
                          onClick={(event) => {
                            event.stopPropagation()
                            handleDropDownOption()
                          }}
                          className='absolute top-0 right-0 flex items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex'
                        >
                          <svg
                            className='w-4 h-4 fill-current'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                          >
                            <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
                          </svg>
                        </button>
                      {/*TODO: change this code so that the scroll bar on the dropdown does not appear.*/}
                        {presentOptions && (
                          <div className='absolute z-10 bg-white rounded-lg shadow-md mt-5 right-0 scrollbar-none overflow-y-hidden'>
                            <button
                              onClick={() => {
                                console.log(
                                  'Interactive 2D Presentation selected'
                                )
                                handle2dClicked(project.workspace_id.key)
                              }}
                              className='block w-full px-4 py-2 text-left hover:bg-gray-200'
                            >
                              2D Presentation
                            </button>
                            <button
                              onClick={() => {
                                console.log('VR Presentation selected')
                                handleVRClicked(project.workspace_id.key)
                              }}
                              className='block w-full px-4 py-2 text-left hover:bg-gray-200'
                            >
                              VR Presentation
                            </button>
                            <button
                              onClick={() => {
                                console.log('AR Presentation selected')
                                handleARClicked(project.workspace_id.key)
                              }}
                              className='block w-full px-4 py-2 text-left hover:bg-gray-200'
                            >
                              AR Presentation
                            </button>
                          </div>
                        )}
                        <h4 className='mt-3 text-lg font-bold'>
                          {project.name}
                        </h4>
                        <div className='flex items-center w-full mt-3 text-xs font-medium text-gray-400'>
                          <div className='flex items-center'>
                            <svg
                              className='w-4 h-4 text-gray-300 fill-current'
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='ml-1 leading-none'>
                              {project.created_date}
                            </span>
                          </div>
                          {/* NOTE: this is where the Name Initials Needs to be added*/}
                          <img
                            className='w-6 h-6 ml-auto rounded-full'
                            src='https://randomuser.me/api/portraits/women/26.jpg'
                          />
                        </div>
                      </div>
                    </div>
                  )
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
                    <div
                      className='flex flex-col pb-2 overflow-auto'
                      onClick={() => handleClick(project.id)}
                    >
                      <div className='relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100'>
                      <button
                          onClick={(event) => {
                            event.stopPropagation()
                            handleDropDownOption2()
                          }}
                          className='absolute top-0 right-0 flex items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex'
                        >
                          <svg
                            className='w-4 h-4 fill-current'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                          >
                            <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
                          </svg>
                        </button>
                      {/*TODO: change this code so that the scroll bar on the dropdown does not appear.*/}
                        {presentOptions2 && (
                          <div className='absolute z-10 bg-white rounded-lg shadow-md mt-5 right-0 scrollbar-none overflow-y-hidden'>
                            <button
                              onClick={() => {
                                console.log(
                                  'Interactive 2D Presentation selected'
                                )
                                handle2dClicked(project.workspace_id.key)
                              }}
                              className='block w-full px-4 py-2 text-left hover:bg-gray-200'
                            >
                              2D Presentation
                            </button>
                            <button
                              onClick={() => {
                                console.log('VR Presentation selected')
                                handleVRClicked(project.workspace_id.key)
                              }}
                              className='block w-full px-4 py-2 text-left hover:bg-gray-200'
                            >
                              VR Presentation
                            </button>
                            <button
                              onClick={() => {
                                console.log('AR Presentation selected')
                                handleARClicked(project.workspace_id.key)
                              }}
                              className='block w-full px-4 py-2 text-left hover:bg-gray-200'
                            >
                              AR Presentation
                            </button>
                          </div>
                        )}
                        <h4 className='mt-3 text-lg font-bold'>
                          {project.name}
                        </h4>
                        <div className='flex items-center w-full mt-3 text-xs font-medium text-gray-400'>
                          <div className='flex items-center'>
                            <svg
                              className='w-4 h-4 text-gray-300 fill-current'
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='ml-1 leading-none'>
                              {project.created_date}
                            </span>
                          </div>
                          <img
                            className='w-6 h-6 ml-auto rounded-full'
                            src='https://randomuser.me/api/portraits/women/26.jpg'
                          />
                        </div>
                      </div>
                    </div>
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
