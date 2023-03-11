import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
      occupierInfo: {},
    },
    reducers: {
      changeChatOccupierInfo: (state, action) => {
        state.occupierInfo = action.payload
      },
    }
})

export default chatSlice.reducer;

export const { changeChatOccupierInfo } = chatSlice.actions;