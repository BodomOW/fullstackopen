import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'
import AlertMessage from './components/AlertMessage'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [sortDesc, setSortDesc] = useState(false)
  const [alertMessage, setAlertMessage] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBloglistappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setAlertMessage({
        text: 'wrong user or password',
        status: 'error'
      })
      setTimeout(() => {
        setAlertMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistappUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setAlertMessage({
          text: `new blog: ${blogObject.title} by ${blogObject.author} has been added`,
          status: 'success'
        })
        setTimeout(() => {
          setAlertMessage(null)
        }, 5000)
      })
  }

  const addLike = (id, blogObject) => {
    blogService
      .addLike(id, blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : { ...returnedBlog, user: blog.user }))
      })
  }

  const handleSort = () => {
    setSortDesc(!sortDesc)
    const sortedBlogs = sortDesc ? blogs.toSorted((a, b) => b.likes - a.likes) : blogs.toSorted((a, b) => a.likes - b.likes)
    setBlogs(sortedBlogs)
  }

  const handleDelete = (id, title, author) => {
    const text = `Delete ${title} by ${author} ?`
    if (confirm(text) == true) {
      blogService
        .remove(id)
        .then(setBlogs(blogs.filter(blog => blog.id !== id)))
    }
  }

  const Header = () => (
    <>
      {user === null
        ? <h2>log in to application</h2>
        : <h2>blogs</h2>
      }
      <AlertMessage message={alertMessage} />
    </>
  )


  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const blogList = () => (
    <>
      <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
      <h2>Create new</h2>
      {blogForm()}
      <button className='btn-sort' onClick={handleSort}>Sort by likes {sortDesc ? '↓' : '↑'}</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateLike={addLike} remove={handleDelete} user={user.name} />
      )}
    </>
  )


  return (
    <>
      <Header />
      {user === null
        ? <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleLogin={handleLogin}
        />
        : blogList()
      }
    </>
  )
}

export default App