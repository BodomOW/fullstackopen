import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    })

    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        <label htmlFor='title'>title: </label>
        <input
          id='title'
          name='title'
          value={newBlog.title}
          onChange={event => setNewBlog({ ...newBlog, title: event.target.value })}
        />
      </div>
      <div>
        <label htmlFor='author'>author: </label>
        <input
          id='author'
          name='author'
          value={newBlog.author}
          onChange={event => setNewBlog({ ...newBlog, author: event.target.value })}
        />
      </div>
      <div>
        <label htmlFor='url'>url: </label>
        <input
          id='url'
          name='url'
          value={newBlog.url}
          onChange={event => setNewBlog({ ...newBlog, url: event.target.value })}
        />
      </div>
      <button type="submit">save</button>
    </form>
  )
}

export default BlogForm