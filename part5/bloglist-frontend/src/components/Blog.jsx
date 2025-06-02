import { useState } from 'react'

const Blog = ({ blog, updateLike, remove, user }) => {
  const [showInfo, setShowInfo] = useState(false)

  const showWhenVisible = { display: showInfo ? '' : 'none' }

  const showRemoveBtn = { display: user === blog.user.name ? '' : 'none' }

  const btnText = showInfo ? 'hide' : 'show'

  const addLike = (event) => {
    event.preventDefault()
    updateLike(blog.id, {
      ...blog,
      user: { ...blog.user },
      likes: blog.likes + 1
    })
  }

  return (
    <div className='blog'>
      <p>{blog.title} by {blog.author} <button onClick={() => setShowInfo(!showInfo)}>{btnText}</button></p>
      <div style={showWhenVisible} className='blog-content'>
        <p>{blog.url}</p>
        <p>{blog.likes} <button onClick={addLike} className='btn-like'>like</button></p>
        <p>{blog.user.name}</p>
        <button className='remove' style={showRemoveBtn} onClick={() => remove(blog.id, blog.title, blog.author)}>remove</button>
      </div>
    </div>
  )
}

export default Blog