import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './space/Workspace/Context/AuthContext'

import PrivateRoute from './space/Workspace/utils/PrivateRoute'
import Dashboard from './space/Workspace/Dashboard'
import LoginPage from './space/Workspace/Pages/LoginPage'
import Navbar from './space/Workspace/Components/Navbar'
import Register from './space/Workspace/Pages/Register'
import WorkspaceWrapper from './space/WorkspaceWrapper'
import { useEffect, useState } from 'react'
import { WorkspaceProvider } from './space/Workspace/Context/WorkspaceContext'

import Workspace from "./space/Workspace/Workspace";
import {useEffect, useState} from "react";

// how to create a link for each workspace.
export const Navigator = () => {
    return (
        <div className='App'>
            <Router>
                <AuthProvider>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<App/>}/>
                        <Route path='/register' element={<Register/>} />
                        <Route path='/login' element={<LoginPage/>} />
                        <Route
                        path='/dashboard'
                        element = {
                            <PrivateRoute redirectTo='/login'>
                                <Dashboard />
                            </PrivateRoute>
                        }
                        />
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    )
}

function App(){
    const [isXR, setXR] = useState(false);

  useEffect(() => {
    checkXR()
  })

  const checkXR = () => {
    if (navigator.xr) {
      setXR(true)
    } else {
      setXR(false)
    }
  }

    const user = {id: "aadsd345-khajs43"}
    const roomId = "1234-v1.5"

    return <Workspace roomId={roomId} user={user}/>

}

export default App
