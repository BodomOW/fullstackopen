import { useEffect, useRef } from 'react'
import { Routes, Route, useMatch, Link } from 'react-router-dom'

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

  const handleDelete = (id, title, author) => {
    const text = `Delete ${title} by ${author} ?`
    if (confirm(text) === true) {
      blogService
        .remove(id)
        .then(dispatch(setBlogs(blogs.filter(blog => blog.id !== id))))
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel='Create new' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const blogList = () => (
    <>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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
            Object.entries(
              blogs.reduce((acc, blog) => {
                const { name, id } = blog.user
                if (!acc[name]) {
                  acc[name] = { count: 0, userId: id }
                }
                acc[name].count++
                return acc
              }, {})
            ).map(([name, { count, userId }]) => (
              <tr key={name}>
                <td><Link to={`/users/${userId}`}>{name}</Link></td>
                <td>{count}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  )

  const UserBlogs = () => {
    const match = useMatch('/users/:id')

    const user = match
      ? (blogs.find(blog => blog.user.id === match.params.id))?.user
      : null

    const userId = user?.id
    const userBlogs = blogs.filter(b => b.user.id === userId)

    return (
      <div>
        <h2>{user?.name}</h2>
        <h3>Added blogs</h3>
        <ul>
          {userBlogs.map(b => <li key={b.id}>{b.title}</li>)}
        </ul>
      </div>
    )
  }

  const BlogView = ({ updateLike }) => {
    const match = useMatch('/blogs/:id')
    const blogId = match.params.id
    const blog = blogs.find(b => b.id === blogId)

    if (!blog) return null

    const addLike = (event) => {
      event.preventDefault()
      updateLike(blog.id, {
        ...blog,
        user: { ...blog.user },
        likes: blog.likes + 1
      })
    }

    return (
      <>
        <h2>{blog.title} by {blog.author}</h2>
        <a href={blog.url}>{blog.url}</a>
        <div>{blog.likes} likes <button onClick={addLike}>like</button></div>
        <div>added by {blog.user.name}</div>
        {login.user.name === blog.user.name &&
          <button onClick={() => handleDelete(blog.id, blog.title, blog.author)}>remove</button>
        }
      </>
    )
  }

  return (
    <>
      {login.user === null
        ? <LoginForm
          username={login.username}
          password={login.password}
          handleUsernameChange={({ target }) => dispatch(setUsername(target.value))}
          handlePasswordChange={({ target }) => dispatch(setPassword(target.value))}
          handleSubmit={handleLogin}
        />
        :
        <>
          <nav>
            <Link to="/">Blogs</Link>
            <Link to="/users">Users</Link>
            <p>{login.user.name} logged in <button onClick={handleLogout}>logout</button></p>
          </nav>
          <Header />
          <Routes>
            <Route path="/" element={blogList()} />
            <Route path="/blogs/:id" element={<BlogView updateLike={addLike} />} />
            <Route path="/users" element={usersList()} />
            <Route path="/users/:id" element={<UserBlogs />} />
          </Routes>
        </>
      }
    </>
  )
}

export default App