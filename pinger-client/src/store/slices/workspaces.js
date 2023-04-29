import { createSlice } from '@reduxjs/toolkit';

const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState: {
    currentWorkspaceId: null,
    name: '',
    isOwner: null,
    isPrivate: false,
  },
  reducers: {
    restore: (state) => {
      state.currentWorkspaceId = null;
    },
    changeCurrentWorkspaceId: (state, action) => {
      state.currentWorkspaceId = action.payload;
    },
    changeIsOwner: (state, action) => {
      state.isOwner = action.payload;
    },
    changeName: (state, action) => {
      state.name = action.payload;
    },
    changeIsPrivate: (state, action) => {
      state.isPrivate = action.payload;
    }
  },
});

export default workspaceSlice.reducer;

export const { changeCurrentWorkspaceId, restore, changeIsOwner, changeName, changeIsPrivate } = workspaceSlice.actions;
