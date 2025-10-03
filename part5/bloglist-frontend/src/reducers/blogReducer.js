import { createSlice, current } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    vote(state, action) {
      const currentState = current(state)
      const id = action.payload.id
      const blogToVote = currentState.find(n => n.id === id)
      const votedBlog = {
        ...blogToVote,
        votes: blogToVote.votes + 1
      }
      return currentState.map(blog =>
        blog.id !== id ? blog : votedBlog
      )
    }
  }
})

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogsService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const { setBlogs, appendBlog, vote } = blogSlice.actions
export default blogSlice.reducer