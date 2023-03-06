import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../Context/AuthContext.js'

function LoginPage() {
  let { loginUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const handleClick = () => {
        navigate('/register')
    }
  return (
    <section className='min-h-screen flex flex-col'>
      <div className='flex flex-1 items-center justify-center'>
        <div className='rounded-lg sm:border-2 px-4 lg:px-24 py-16 lg:max-w-xl sm:max-w-md w-full text-center'>
          <form className='text-center' onSubmit={loginUser}>
            <h1 className='font-bold tracking-wider text-3xl mb-8 w-full text-gray-600'>
              Sign in
            </h1>
            <div className='py-2 text-left'>
              <input
                type='text'
                placeholder='Username'
                name='username'
                className='bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 '
              />
            </div>
            <input
              type='password'
              placeholder='Password'
              name='password'
              className='bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 '
            />
            <div className='py-2'>
              <input
                type='submit'
                value='Sign In'
                className='border-2 border-gray-100 focus:outline-none bg-purple-600 text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-purple-700'
              />
            </div>
          </form>
          <div className='text-center mt-12'>
            <span>Don't have an account?</span>
            <h5
              onClikck = {handleClick}
              className='font-light text-md text-indigo-600 underline font-semibold hover:text-indigo-800'
            >
              Create One
            </h5>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
