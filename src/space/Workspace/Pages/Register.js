import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    axios.post('http://127.0.0.1:8000/app/register/', {
      username: username,
      email: email,
      password: password,
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error.response.data);
      });
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" value={username} onChange={event => setUsername(event.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={event => setEmail(event.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={event => setPassword(event.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
