import { configureStore } from '@reduxjs/toolkit'

import blogsService from './services/blogs'

import notificationReducer from './reducers/notificationReducer'
import blogReducer, { setBlogs } from './reducers/blogReducer'
import loginReducer from './reducers/loginReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    login: loginReducer
  }
})

blogsService.getAll().then(blogs =>
  store.dispatch(setBlogs(blogs))
)

export default store