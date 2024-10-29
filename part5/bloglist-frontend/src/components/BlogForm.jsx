import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    })

    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <form onSubmit={addBlog} id='blogForm'>
      <div>
        <label htmlFor='inputTitle'>title: </label>
        <input
          data-testid='title'
          id='inputTitle'
          name='title'
          value={newBlog.title}
          onChange={event => setNewBlog({ ...newBlog, title: event.target.value })}
        />
      </div>
      <div>
        <label htmlFor='inputAuthor'>author: </label>
        <input
          data-testid='author'
          id='inputAuthor'
          name='author'
          value={newBlog.author}
          onChange={event => setNewBlog({ ...newBlog, author: event.target.value })}
        />
      </div>
      <div>
        <label htmlFor='inputURL'>url: </label>
        <input
          data-testid='url'
          id='inputURL'
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