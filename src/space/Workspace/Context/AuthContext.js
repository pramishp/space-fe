import { createContext, useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'

const AuthContext = createContext()

// lets not use interceptors for register
export default AuthContext

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  )
  let [user, setUser] = useState(() =>
    localStorage.getItem('authTokens')
      ? jwt_decode(localStorage.getItem('authTokens'))
      : null
  )

  let [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  let loginUser = async (e) => {
    e.preventDefault()
    try {
        const response = await axiosInstance.post('/app/token/', {
            username: e.target.username.value,
            password: e.target.password.value,
        })
        if (response.status === 200) {
            const data = response.data
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            console.log(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate('/dashboard')
        } else {
            alert('Something went wrong here')
        }
    } catch (error) {
        console.log(error)
    }
    /* let response = await fetch('http://127.0.0.1:8000/app/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    })
    let data = await response.json()
    if (response.status === 200) {
      setAuthTokens(data)
      setUser(jwt_decode(data.access))
      localStorage.setItem('authTokens', JSON.stringify(data))
      navigate('/dashboard')
    } else {
      alert('Something went wrong here')
    } */
  }
  let logoutUser = () => {
    setAuthTokens(null)
    setUser(null)
    localStorage.removeItem('authTokens')
    navigate('/login')
  }
  /* let updateToken = async () => {
      //console.log('update token is getting called.')
      let response = await fetch('http://127.0.0.1:8000/app/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: authTokens?.refresh }),
      })
      let data = await response.json()
      if (response.status === 200) {
        setAuthTokens(data)
        setUser(jwt_decode(data.access))
        localStorage.setItem('authTokens', JSON.stringify(data))
      } else {
        logoutUser()
      }
      if (loading) {
        setLoading(false)
      }
    }*/

    /*
    * user: {
    token_type: 'access',
    exp: 1679561765,
    iat: 1679559701,
    jti: 'ebf6fc237c9d4139a9d9915f44c62829',
    user_id: 1,
    username: 'anubhav',
    first_name: '',
    last_name: ''
    *
    * required:
    *     {id: "aadsd345-khajs43", "name": {"first": "Anubhav", "last": "Khanal"} }

  }
    * */

    let contextData = {
    user: user ? {id: user.id, username:user.username, name: {first: user.first_name, last: user.last_name}}: null,
    loginUser: loginUser,
    logoutUser: logoutUser,
    authTokens: authTokens,
    setUser: setUser,
    setAuthTokens: setAuthTokens,
  }
  useEffect(() => {
    // initailly if the auth token is present then set thr user and then set loading to fasle
    if (authTokens) {
      setUser(jwt_decode(authTokens.access))
    }
    setLoading(false)
  }, [authTokens, loading])
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  )
}
