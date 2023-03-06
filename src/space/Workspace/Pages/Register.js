import React, { useState } from 'react'
import axios from 'axios'

//TODO: notify the user in the frontend that the registration has been successful
function Register() {
  const [username, setUsername] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    axios
      .post('http://127.0.0.1:8000/app/register/', {
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error.response.data)
      })
  }
  return (
    <section className='min-h-screen flex flex-col'>
      <div className='flex flex-1 items-center justify-center'>
        <div className='rounded-lg sm:border-2 px-4 lg:px-24 py-16 lg:max-w-xl sm:max-w-md w-full text-center'>
          <form className='text-center'>
            <h1 className='font-bold tracking-wider text-3xl mb-8 w-full text-gray-600'>
              Register
            </h1>
            <div className='py-2 text-left'>
              <input
                className='bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 '
                type='text'
                placeholder='First Name'
                value={firstname}
                onChange={(event) => setFirstname(event.target.value)}
              />
            </div>
            <div className='py-2 text-left'>
              <input
                className='bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 '
                type='text'
                placeholder='Last Name'
                value={lastname}
                onChange={(event) => setLastname(event.target.value)}
              />
            </div>
            <div className='py-2 text-left'>
              <input
                className='bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 '
                type='text'
                placeholder='Username'
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className='py-2 text-left'>
              <input
                className='bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 '
                type='email'
                placeholder='Email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className='py-2 text-left'>
              <input
                className='bg-gray-200 border-2 border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700 '
                type='password'
                placeholder='Password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className='py-2'>
              <button
                type='submit'
                className='border-2 border-gray-100 focus:outline-none bg-purple-600 text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-purple-700'
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Register
