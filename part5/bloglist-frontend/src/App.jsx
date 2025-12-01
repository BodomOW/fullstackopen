import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import loginService from './services/login'
import blogService from './services/blogs'

import Header from './components/Header'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Blog from './components/Blog'

import { setUser, setUsername, setPassword, clearUser } from './reducers/loginReducer'
import { setBlogs } from './reducers/blogReducer'
import { setNotification } from './reducers/notificationReducer'

import { initializeBlogs } from './reducers/blogReducer'
import { useDispatch } from 'react-redux'

import { useSelector } from 'react-redux'

const App = () => {
  const blogs = useSelector(state => state.blogs)
  const login = useSelector(state => state.login)
  const [sortDesc, setSortDesc] = useState(false)
  const blogFormRef = useRef()

  const dispatch = useDispatch()

  // const state = useSelector(state => state)
  // console.log('state now: ', state)

  useEffect(() => {
    dispatch(initializeBlogs())

    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))

      blogService.setToken(user.token)
    }
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username: login.username,
        password: login.password,
      })
      window.localStorage.setItem(
        'loggedBloglistappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(setUser(user))
    } catch (exception) {
      dispatch(setNotification({
        text: 'wrong credentials',
        status: 'error'
      }, 5))
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistappUser')
    dispatch(clearUser())
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        dispatch(setBlogs(blogs.concat({ ...returnedBlog, user: login.user })))
        dispatch(setNotification({
          text: `new blog: ${returnedBlog.title} by ${returnedBlog.author} has been added`,
          status: 'success'
        }, 5))
      })
  }

  const addLike = (id, blogObject) => {
    blogService
      .addLike(id, blogObject)
      .then(returnedBlog => {
        dispatch(setBlogs(blogs.map(blog => blog.id !== id ? blog : { ...returnedBlog, user: blog.user })))
      })
  }

  const handleSort = () => {
    setSortDesc(!sortDesc)
    const sortedBlogs = sortDesc ? blogs.toSorted((a, b) => b.likes - a.likes) : blogs.toSorted((a, b) => a.likes - b.likes)
    dispatch(setBlogs(sortedBlogs))
  }

  const handleDelete = (id, title, author) => {
    const text = `Delete ${title} by ${author} ?`
    if (confirm(text) === true) {
      blogService
        .remove(id)
        .then(dispatch(setBlogs(blogs.filter(blog => blog.id !== id))))
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const blogList = () => (
    <>
      <p>{login.user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <h2>Create new</h2>
      {blogForm()}
      <button className='btn-sort' onClick={handleSort}>Sort by likes {sortDesc ? '↓' : '↑'}</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateLike={addLike} remove={handleDelete} user={login.user.name} />
      )}
    </>
  )

  const usersList = () => (
    <>
      <h1>Users</h1>
      <table>
        <thead style={{ textAlign: 'left' }}>
          <tr>
            <th>Name</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {
            blogs.map(blog => blog.user.name).filter((value, index, self) => self.indexOf(value) === index).map((name, idx) =>
              <tr key={idx}>
                <td>{name}</td>
                <td>{blogs.filter(blog => blog.user.name === name).length}</td>
              </tr>
            )
          }
        </tbody>
      </table>
    </>
  )


  return (
    <>
      <Header />

      {login.user === null
        ? <LoginForm
          username={login.username}
          password={login.password}
          handleUsernameChange={({ target }) => dispatch(setUsername(target.value))}
          handlePasswordChange={({ target }) => dispatch(setPassword(target.value))}
          handleSubmit={handleLogin}
        />
        :
        <Router>
          <Routes>
            <Route path="/users" element={usersList()} />
            <Route path="/" element={blogList()} />
          </Routes>
        </Router>
      }
    </>
  )
}

export default App