import { useContext, useEffect, useState } from "react";
import AuthContext from "./Context/AuthContext";
import AddProject from "./Components/AddProject";
const Dashboard  = () => {
let { authTokens, logoutUser } = useContext(AuthContext)
let [projects, setProjects] = useState([])
useEffect(() => {
  getProjects()
}, [])
let getProjects = async () => {
    console.log('getProjects is getting called.')
    let response = await fetch('http://127.0.0.1:8000/app/project-list/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access),
        },
    })
    let data = await response.json()
    if (response.status === 200) {
        setProjects(data)
    }
    else if (response.statusText === 'Unauthorized') {
        logoutUser()
    }
}
console.log(projects)
    return (
        <>
        <p>Welcome to the Dashboard</p>
        <ul>
            {projects.map((project) => (
            <li key={project.id}>{project.name} - {project.title}</li>
            ))}
        </ul>
        <AddProject projects={projects} setProjects={setProjects}/>
        </>
    )
}

export default Dashboard;