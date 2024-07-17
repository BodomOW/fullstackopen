const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "TEST - 4.8 Blog List Tests, step 1",
    author: "NOMA",
    url: "https://test.com",
    likes: 123
  },
  {
    title: "TEST 2 - 4.8 Blog List Tests, step 1",
    author: "NOMA 2",
    url: "https://test-2.com",
    likes: 222
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}