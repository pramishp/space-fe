import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../Context/AuthContext"
const AddProject = (props) => {
    let { authTokens } = useContext(AuthContext)
    let [newProject, setNewProject] = useState({ name: '', title: '' })
    const navigate = useNavigate()
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
        console.log(data)
        //setNewProject({ name: '', title: '' })
        //props.setProjects([...props.projects, data])
        navigate(`/workspace/${data.id}`)
      }
      props.setDisplayAdd(false)
    }

    let handleInputChange = (e) => {
      setNewProject({
        ...newProject,
        [e.target.name]: e.target.value
      })
    }

    return (
<div className="flex items-center justify-center h-full w-full bg-gray-100 bg-opacity-50 backdrop-filter backdrop-blur-sm" style={{position:'absolute', top:0, left:0}}>
<form onSubmit={handleFormSubmit} className="max-w-lg mx-auto">
  <div className="mb-4">
    <input
      type="text"
      name="name"
      placeholder="Project Name"
      value={newProject.name}
      onChange={handleInputChange}
      className="bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
    />
  </div>
  <div className="mb-4">
    <input
      type="text"
      name="title"
      placeholder="Project Description"
      value={newProject.title}
      onChange={handleInputChange}
      className="bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
    />
  </div>
  <div className="flex justify-center">
    <button
      type="submit"
      className="border-2 border-gray-100 focus:outline-none bg-purple-600 text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-purple-700"
    >
      Add
    </button>
  </div>
</form>
</div>
    )
}

export default AddProject

