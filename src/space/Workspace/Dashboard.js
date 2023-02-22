import { useContext, useEffect, useState } from 'react'
import { Route, useNavigate } from 'react-router-dom'
import AuthContext from './Context/AuthContext'
import AddProject from './Components/AddProject'
import WorkspaceContext from './Context/WorkspaceContext'
import WorkspaceWrapper from '../WorkspaceWrapper'
const Dashboard = () => {
  const { authTokens, logoutUser } = useContext(AuthContext)
  const { setWorkspaceId } = useContext(WorkspaceContext)
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
    setWorkspaceId(projectId)
    navigate(`/workspace:${projectId}`)
  }
  // receive the data here and then send it to the presentation wrapper
  // navigate to another link.
  // get the workspace id then navigate to it.
  const handleWPSubmit = async (event) => {
    event.preventDefault()
    const response = await fetch(`http://127.0.0.1:8000/app/wid-by-presentationlink/${workspacePin}`, {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer' +String(authTokens.access)
    }
    })
    const data = await response.json()
    if (response.status === 200) {
    console.log(data)
    navigate('/workspace:${data}')
    } else if (response.statusText === 'Unauthorized') {
    logoutUser()
    }
  }
  // receive the data here and then send it to the workspace wrapper
  const handlePLSubmit = async (event) => {
    event.preventDefault()
    const response = await  fetch(`http://127.0.0.1:8000/app/wid-by-presentationlink/${presentationLink}`, {
          method: 'GET',
          headers: {
              'Content-Type':'application/json',
              Authorization: 'Bearer '+String(authTokens.access)
          },
      })
      const data = await response.json()
      if (response.status === 200) {
      console.log(data)
          navigate(`/presentation:${data}`)
      } else if (response.statusText === 'Unauthorized') {
      logoutUser()
      }
  }
  // put two forms here to join a workspace.
  //  TODO:add routes for presentation
  return (
    <>
      <p>Welcome to the Dashboard</p>
      <ul>
        {projects.map((project) => {
          return (
            <div>
              <li key={project.id}>
                {project.name} - {project.title}
                <Route
                  path='/workspace:project.id'
                  element={<WorkspaceWrapper project_id={project.id} />}
                ></Route>
                <Route
                  path='/presentation:project.id'
                  elment={<PresentationWrapper project_id={project.id} />}
                ></Route>
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
