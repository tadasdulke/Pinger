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
    }
})

export default authSlice.reducer;

export const { authenticate } = authSlice.actions;