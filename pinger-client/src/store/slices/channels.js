import { createSlice } from '@reduxjs/toolkit'

const channelsSlice = createSlice({
    name: 'channels',
    initialState: [],
    reducers: {
      addChannel: (state, action) => {
        const {id, name} = action.payload;

        const modifiedChannel = {
          id,
          name,
          highlighted: false
        }

        return [...state, modifiedChannel]
      },
      highlightChannel: (state, action) => {
        const channelId = action.payload;

        return state.map(channel => {
          if(channel.id === channelId) {
            return {
              ...channel,
              highlighted: true
            }
          }

          return channel;
        })
      },
      removeChannelHighlight: (state, action) => {
        const channelId = action.payload;

        return state.map(channel => {
          if(channel.id === channelId) {
            return {
              ...channel,
              highlighted: false
            }
          }

          return channel;
        })
      }
    }
})

export default channelsSlice.reducer;

export const { addChannel, highlightChannel, removeChannelHighlight } = channelsSlice.actions;