import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
      isAuthenticated: false
    },
    reducers: {
      authenticate: (state) => {
        state.isAuthenticated = true
      },
      logout: (state) => {
        state.isAuthenticated = false
      },
    }
})

export default authSlice.reducer;

export const { authenticate, logout } = authSlice.actions;