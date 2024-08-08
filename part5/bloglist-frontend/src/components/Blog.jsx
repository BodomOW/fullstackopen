import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showInfo, setShowInfo] = useState(false)

  const showWhenVisible = { display: showInfo ? '' : 'none' }

  const btnText = showInfo ? 'hide' : 'show'

  return (
    <div className='blog'>
      <p>{blog.title} <button onClick={() => setShowInfo(!showInfo)}>{btnText}</button></p>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>{blog.likes} <button>like</button></p>
        <p>{blog.author}</p>
      </div>
    </div>
  )
}

export default Blog