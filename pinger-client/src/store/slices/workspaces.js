import { createSlice } from '@reduxjs/toolkit'

const workspaceSlice = createSlice({
    name: 'workspaces',
    initialState: {
      currentWorkspaceId: null
    },
    reducers: {
      changeCurrentWorkspaceId: (state, action) => {
        state.currentWorkspaceId = action.payload
      },
    }
})

export default workspaceSlice.reducer;

export const { changeCurrentWorkspaceId } = workspaceSlice.actions;