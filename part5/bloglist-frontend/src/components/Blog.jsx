import { useState } from 'react'

const Blog = ({ blog, updateLike, remove, user }) => {
  const [showInfo, setShowInfo] = useState(false)

  const showWhenVisible = { display: showInfo ? '' : 'none' }

  const showRemoveBtn = { display: user === blog.user.name ? '' : 'none' }

  const userName = blog.user.name

  const btnText = showInfo ? 'hide' : 'show'

  const addLike = (event) => {
    event.preventDefault()
    updateLike(blog.id, {
      ...blog,
      likes: blog.likes + 1
    })
  }

  return (
    <div className='blog'>
      <p>{blog.title} by {blog.author} <button onClick={() => setShowInfo(!showInfo)}>{btnText}</button></p>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>{blog.likes} <button onClick={addLike}>like</button></p>
        <p>{userName}</p>
        <button className='remove' style={showRemoveBtn} onClick={() => remove(blog.id, blog.title, blog.author)}>remove</button>
      </div>
    </div>
  )
}

export default Blog