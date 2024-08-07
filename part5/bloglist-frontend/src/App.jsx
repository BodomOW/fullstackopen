import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
      console.log('Wrong credentials')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistappUser')
    setUser(null)
  }

  const handleTitleChange = (event) => {
    setNewBlog({ ...newBlog, title: event.target.value })
  }
  const handleAuthorChange = (event) => {
    setNewBlog({ ...newBlog, author: event.target.value })
  }
  const handleURLChange = (event) => {
    setNewBlog({ ...newBlog, url: event.target.value })
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog({ title: '', author: '', url: '' })
      })
  }

  const loginForm = () => (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label htmlFor='title'>title: </label>
        <input
          id='title'
          name='title'
          value={newBlog.title}
          onChange={handleTitleChange}
        />
      </div>
      <div>
        <label htmlFor='author'>author: </label>
        <input
          id='author'
          name='author'
          value={newBlog.author}
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        <label htmlFor='url'>url: </label>
        <input
          id='url'
          name='url'
          value={newBlog.url}
          onChange={handleURLChange}
        />
      </div>
      <button type="submit">save</button>
    </form>
  )

  const blogList = () => (
    <>
      <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
      <h2>Create new</h2>
      {blogForm()}
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
  )


  return (
    <>
      {user === null
        ? loginForm()
        : blogList()
      }
    </>
  )
}

export default App