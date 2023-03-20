import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
      chatType: null,
      occupierInfo: {},
      isAtButton: false,
    },
    reducers: {
      changeChatOccupierInfo: (state, action) => {
        state.occupierInfo = action.payload
      },
      updateIsAtButton: (state, action) => {
        state.isAtButton = action.payload
      },
      updateChatType: (state, action) => {
        switch (action.payload) {
          case 'DIRECT_MESSAGE':
            state.chatType = 'DIRECT_MESSAGE';
            break;
          case 'CHANNEL_CHAT':
            state.chatType = 'CHANNEL_CHAT'
            break;
        }
      },
    }
})

export default chatSlice.reducer;

export const { changeChatOccupierInfo, updateIsAtButton, updateChatType } = chatSlice.actions;