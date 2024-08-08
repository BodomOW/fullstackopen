import { useState } from 'react'

const Blog = ({ blog, updateLike }) => {
  const [showInfo, setShowInfo] = useState(false)

  const showWhenVisible = { display: showInfo ? '' : 'none' }

  const btnText = showInfo ? 'hide' : 'show'

  const addLike = (event) => {
    event.preventDefault()
    console.log('Blog without changes', blog)
    updateLike(blog.id, {
      user: blog.user.id || blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    })
  }

  return (
    <div className='blog'>
      <p>{blog.title} <button onClick={() => setShowInfo(!showInfo)}>{btnText}</button></p>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>{blog.likes} <button onClick={addLike}>like</button></p>
        <p>{blog.author}</p>
      </div>
    </div>
  )
}

export default Blog