import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider} from './space/Workspace/Context/AuthContext'

import PrivateRoute from './space/Workspace/utils/PrivateRoute'
import Dashboard from './space/Workspace/Dashboard'
import LoginPage from './space/Workspace/Pages/LoginPage'
import Navbar from './space/Workspace/Components/Navbar'
import Register from './space/Workspace/Pages/Register'

const App = () => {
    return (
        <div className='App'>
            <Router>
                <AuthProvider>
                    <Navbar />
                    <Routes>
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

export default App