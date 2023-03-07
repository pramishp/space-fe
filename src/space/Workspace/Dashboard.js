import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from './Context/AuthContext'
import AddProject from './Components/AddProject'

import WorkspaceWrapper from '../WorkspaceWrapper'
import PresentationWrapper from '../PresentationWrapper.js'
import AddCollaboration from './Components/AddCollaboration.js'
import AddPresentationLink from './Components/AddPresentationLink.js'
const Dashboard = () => {
  const { user, authTokens, logoutUser } = useContext(AuthContext)

  // const [workspacePin, setWorkspacePin] = useState('')
  // const [presentationLink, setPresentationLink] = useState('')
  const [projects, setProjects] = useState([])
  const [collaborations, setCollaborations] = useState([])
  useEffect(() => {
    getProjects()
  }, [])
  let getProjects = async () => {
    console.log('getProjects is getting called.')
    let response = await fetch('http://127.0.0.1:8000/app/project-list/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
    })
    let data = await response.json()
    console.log(response.status)
    if (response.status === 200) {
      setProjects(data)
    } else if (response.statusText === 'Unauthorized') {
      logoutUser()
    }
  }
  const navigate = useNavigate()
  //url to workspace page.
  // authencate
  // TODO: list of users who are authenticated for a project.
  // TODO: create a url which the user will navigate to.
  const handleClick = (projectId) => {
    console.log(projectId)
    navigate(`/workspace/${projectId}`)
  }

  //  TODO:add routes for presentation
  // TODO: here the new workspace wrapper is not created for another user because it is being created here.
  // we need to change this so that all the routes to workspace wrapper are avaible to every user.
  return (
    <>
      <div className='flex flex-col w-screen h-screen overflow-auto text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200'>
        <div className='mr-auto px-10 mt-6'>
          <h1 className='text-2xl font-bold'>Welcome, {user.username}</h1>
        </div>
        <div className='flex flex-grow px-10 mt-4 space-x-6 overflow-auto'>
          <div className='flex flex-col flex-shrink-0 w-72'>
            <div className='flex items-center flex-shrink-0 h-10 px-2'>
              <span className='block text-sm font-semibold'>My Projects</span>
              <span className='flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30'>
                6
              </span>
              <button className='flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100'>
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
            <ul>
              {projects.map((project) => {
                return (
                  <div className='flex flex-col pb-2 overflow-auto' onClick={handleClick}>
                    <div className='relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100'>
                      <h4 className='mt-3 text-sm font-medium'>
                        {project.name} - {project.title}
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
                          <span className='ml-1 leading-none'>Dec 12</span>
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
            </ul>
          </div>
        </div>
      </div>
      <br></br>
      <div>Add a project</div>
      <AddProject projects={projects} setProjects={setProjects} />
      <br></br>
      <div>Enter workspace pin to join a workspace</div>
      <AddCollaboration collaborations={collaborations} setCollaborations={setCollaborations} />
      <br></br>
      <div>Enter presentation link</div>
      <AddPresentationLink />
    </>
  )
}

export default Dashboard
