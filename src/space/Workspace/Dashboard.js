import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from './Context/AuthContext'
import AddProject from './Components/AddProject'

import WorkspaceWrapper from '../WorkspaceWrapper'
import PresentationWrapper from '../PresentationWrapper.js'
const Dashboard = () => {
  const { authTokens, logoutUser } = useContext(AuthContext)

  const [workspacePin, setWorkspacePin] = useState('')
  const [presentationLink, setPresentationLink] = useState('')
  const [projects, setProjects] = useState([])
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
  // receive the data here and then send it to the presentation wrapper
  // navigate to another link.
  // get the workspace id then navigate to it.
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
  // receive the data here and then send it to the workspace wrapper
  const handlePLSubmit = async (event) => {
    event.preventDefault()
    const response = await fetch(
      `http://127.0.0.1:8000/app/pid-by-presentation-link/?presentation_link=${presentationLink}`,
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
      navigate(`/presentation/${data.project_id}/2d`)
    } else if (response.statusText === 'Unauthorized') {
      logoutUser()
    }
  }
  // put two forms here to join a workspace.
  //  TODO:add routes for presentation
// TODO: here the new workspace wrapper is not created for another user because it is being created here.
        // we need to change this so that all the routes to workspace wrapper are avaible to every user.
  return (
    <>
      <p>Welcome to the Dashboard</p>
      <ul>
        {projects.map((project) => {
          return (
            <div key={project.id}>
              <li>
                {project.name} - {project.title}

              </li>
              <button onClick={() => handleClick(project.id)}>Enter</button>
            </div>
          )
        })}
      </ul>
      <br></br>
      <div>Add a project</div>
      <AddProject projects={projects} setProjects={setProjects} />
      <br></br>
      <div>Enter workspace pin to join a workspace</div>
      <form onSubmit={handleWPSubmit}>
        <input
          type='text'
          placeholder='Enter Workspace Pin'
          value={workspacePin}
          onChange={(event) => setWorkspacePin(event.target.value)}
        />
        <button type='submit'>Enter</button>
      </form>
      <br></br>
      <div>Enter presentation link</div>
      <form onSubmit={handlePLSubmit}>
        <input
          type='text'
          placeholder='Enter presentation Link'
          value={presentationLink}
          onChange={(event) => setPresentationLink(event.target.value)}
        />
        <button type='submit'>Enter</button>
      </form>
    </>
  )
}

export default Dashboard
