import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'


const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    },
    onError: (error) => {
      setError(error.message)
    }
  })


  const submit = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <form onSubmit={submit} id='loginForm'>
      <div className='field_group'>
        <label htmlFor="name">username </label>
        <input
          id="name"
          type='text'
          value={username}
          autoComplete='username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div className='field_group'>
        <label htmlFor="password">password </label>
        <input
          id="password"
          type='password'
          value={password}
          autoComplete='current-password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )
}

export default LoginForm