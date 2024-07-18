const { test, after, beforeEach } = require('node:test')
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

  // console.log('idProperty', idProperty)

  assert.strictEqual(idProperty, true)
})

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
  console.log(blogsAtEnd)
  const lastBlog = blogsAtEnd.length - 1

  assert.strictEqual(blogsAtEnd[lastBlog].likes, 0)
})

// test('note without content is not added', async () => {
//   const newNote = {
//     important: true
//   }

//   await api
//     .post('/api/notes')
//     .send(newNote)
//     .expect(400)


//   const notesAtEnd = await helper.notesInDb()


//   assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
// })

// test('a specific note can be viewed', async () => {
//   const notesAtStart = await helper.notesInDb()

//   const noteToView = notesAtStart[0]


//   const resultNote = await api
//     .get(`/api/notes/${noteToView.id}`)
//     .expect(200)
//     .expect('Content-Type', /application\/json/)

//   assert.deepStrictEqual(resultNote.body, noteToView)
// })

// test('a note can be deleted', async () => {
//   const notesAtStart = await helper.notesInDb()
//   const noteToDelete = notesAtStart[0]


//   await api
//     .delete(`/api/notes/${noteToDelete.id}`)
//     .expect(204)

//   const notesAtEnd = await helper.notesInDb()

//   const contents = notesAtEnd.map(r => r.content)
//   assert(!contents.includes(noteToDelete.content))

//   assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
// })

after(async () => {
  await mongoose.connection.close()
})