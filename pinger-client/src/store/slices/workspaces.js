import { createSlice } from '@reduxjs/toolkit';

const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState: {
    currentWorkspaceId: null,
  },
  reducers: {
    restore: (state) => {
      state.currentWorkspaceId = null;
    },
    changeCurrentWorkspaceId: (state, action) => {
      state.currentWorkspaceId = action.payload;
    },
  },
});

export default workspaceSlice.reducer;

export const { changeCurrentWorkspaceId, restore } = workspaceSlice.actions;
