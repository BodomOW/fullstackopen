import { createSlice } from '@reduxjs/toolkit'

const loginSlice = createSlice({
  name: 'login',
  initialState: { user: null, username: '', password: '' },
  reducers: {
    setUser(state, action) {
      return { ...state, user: action.payload }
    },
    setUsername(state, action) {
      return { ...state, username: action.payload }
    },
    setPassword(state, action) {
      return { ...state, password: action.payload }
    },
    clearUser(state, action) {
      return { user: null, username: '', password: '' }
    }
  }
})

export const { setUser, setUsername, setPassword, clearUser } = loginSlice.actions
export default loginSlice.reducer