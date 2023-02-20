import { useContext } from 'react'
import AuthContext from '../Context/AuthContext.js'

function LoginPage() {
  let {loginUser} = useContext(AuthContext)
    return (
    <div>
      <form onSubmit={loginUser}>
        <input type='text' placeholder='enter username' name='username' />
        <input type='password' placeholder='enter password' name='password' />
        <input type='submit' />
      </form>
    </div>
  )
}

export default LoginPage

