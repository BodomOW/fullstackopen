import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  return (
    <div className='blog'>
      <p><Link to={`/blogs/${blog.id}`}>{blog.title}</Link> by {blog.author}</p>
    </div>
  )
}

export default Blog