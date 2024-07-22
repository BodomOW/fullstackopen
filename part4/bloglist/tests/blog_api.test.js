const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  const idProperty = response.body.every(note => note.hasOwnProperty('id'))
  assert.strictEqual(idProperty, true)
})

describe('addition of a new blog post', () => {

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: "TEST 3 - 4.10: Blog List Tests, step 3",
      author: "NOMA 3",
      url: "https://test-3.com",
      likes: 333
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  })

  test('a blog without likes specified can be added ', async () => {
    const newBlog = {
      title: "TEST 4 - 4.11*: Blog List Tests, step 4",
      author: "NOMA 4",
      url: "https://test-4.com"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const lastBlog = blogsAtEnd.length - 1

    assert.strictEqual(blogsAtEnd[lastBlog].likes, 0)
  })

  test('blog without title or url is not added', async () => {
    const newBlog = {
      author: "NOMA 5",
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

})

describe('deletion of a blog post', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    // console.log('titles', titles)
    // console.log('blogToDelete', blogToDelete)
    assert(!titles.includes(blogToDelete.title))
  })
})

after(async () => {
  await mongoose.connection.close()
})