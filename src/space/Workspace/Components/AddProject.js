import { useState, useContext } from "react"
import AuthContext from "../Context/AuthContext"
const AddProject = (props) => {
    let { authTokens } = useContext(AuthContext)
    let [newProject, setNewProject] = useState({ name: '', title: '' })

    let handleFormSubmit = async (e) => {
      e.preventDefault()
      let response = await fetch('http://127.0.0.1:8000/app/project-add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization : 'Bearer ' + String(authTokens.access),
        },
        body: JSON.stringify(newProject)
      })
      let data = await response.json()
      if (response.status === 201) {
        setNewProject({ name: '', title: '' })
        props.setProjects([...props.projects, data])
      }
    }

    let handleInputChange = (e) => {
      setNewProject({
        ...newProject,
        [e.target.name]: e.target.value
      })
    }

    return (
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" value={newProject.name} onChange={handleInputChange} />
        <br />
        <label htmlFor="title">Title:</label>
        <input type="text" name="title" value={newProject.title} onChange={handleInputChange} />
        <br />
        <button type="submit">Add</button>
      </form>
    )
}

export default AddProject

