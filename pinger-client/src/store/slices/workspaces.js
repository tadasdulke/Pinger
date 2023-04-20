import { createSlice } from '@reduxjs/toolkit';

const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState: {
    currentWorkspaceId: null,
    name: '',
    isOwner: null,
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
    }
  },
});

export default workspaceSlice.reducer;

export const { changeCurrentWorkspaceId, restore, changeIsOwner, changeName } = workspaceSlice.actions;
