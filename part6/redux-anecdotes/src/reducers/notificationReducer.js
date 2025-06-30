import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return ''
    }
  }
})

export const setNotification = (message, timeInSeconds) => {
  return dispatch => {
    dispatch(showNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeInSeconds * 1000)
  }
}

export const { showNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer