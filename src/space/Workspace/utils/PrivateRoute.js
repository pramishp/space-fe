import { useContext } from 'react'
import { Route, Navigate } from 'react-router-dom'
import AuthContext from '../Context/AuthContext'

const PrivateRoute = ({ children, redirectTo }) => {
  const { user } = useContext(AuthContext)


  return user ? children : <Navigate to={redirectTo} />
}

export default PrivateRoute