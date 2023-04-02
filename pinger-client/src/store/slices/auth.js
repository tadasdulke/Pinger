import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    userName: null,
    userId: null,
    profilePictureId: null,
  },
  reducers: {
    authenticate: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setProfilePictureId: (state, action) => {
      state.profilePictureId = action.payload;
    },
  },
});

export default authSlice.reducer;

export const {
  authenticate, logout, setUserName, setUserId, setProfilePictureId,
} = authSlice.actions;
