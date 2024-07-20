import axios from 'axios'
import jwt_decode from 'jwt-decode'
import dayjs from 'dayjs'
import { useContext } from 'react'
import AuthContext from '../Context/AuthContext'

// const HOST = '192.168.1.68'
const HOST = 'localhost'
const baseURL = `http://${HOST}:8000`

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext)

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` },
  })

  axiosInstance.interceptors.request.use(async (req) => {
    // check if the token is expired or not.
    const isExpired = dayjs
      .unix(jwt_decode(authTokens.access).exp)
      .diff(dayjs() < 1)
    if (!isExpired) return req
    const response = await axios.post(`${baseURL}/app/token/refresh/`, {
      refresh: authTokens?.refresh,
    })
    localStorage.setItem('authTokens', JSON.stringify(response.data))

    setAuthTokens(response.data)
    setUser(jwt_decode(response.data.access))
    req.headers.Authorization = `Bearer ${authTokens.access}`
    return req
  })
  return axiosInstance
}

export default useAxios
