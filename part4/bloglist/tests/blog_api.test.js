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

test('Unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')

  const idProperty = response.body.every(note => note.hasOwnProperty('id'))

  console.log('idProperty', idProperty)

  assert.strictEqual(idProperty, true)
})

// test('a valid note can be added ', async () => {
//   const newNote = {
//     content: 'async/await simplifies making async calls',
//     important: true,
//   }

//   await api
//     .post('/api/notes')
//     .send(newNote)
//     .expect(201)
//     .expect('Content-Type', /application\/json/)


//   const notesAtEnd = await helper.notesInDb()
//   assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)


//   const contents = notesAtEnd.map(n => n.content)
//   assert(contents.includes('async/await simplifies making async calls'))
// })

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