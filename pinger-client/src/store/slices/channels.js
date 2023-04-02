import { createSlice } from '@reduxjs/toolkit';

const channelsSlice = createSlice({
  name: 'channels',
  initialState: [],
  reducers: {

    restore: () => {
      return [];
    },
    addChannel: (state, action) => {
      const { id, name } = action.payload;

      const modifiedChannel = {
        id,
        name,
        highlighted: false,
      };

      return [...state, modifiedChannel];
    },
    removeChannel: (state, action) => {
      const { id } = action.payload;

      return state.filter(({id: channelId}) => channelId !== id);
    },
    modifyChannelName: (state, action) => {
      const { id, name } = action.payload;
      return state.map((channel) => {
        if (channel.id === id) {
          return {
            ...channel,
            name
          };
        }

        return channel;
      });

    },
    highlightChannel: (state, action) => {
      const channelId = action.payload;

      return state.map((channel) => {
        if (channel.id === channelId) {
          return {
            ...channel,
            highlighted: true,
          };
        }

        return channel;
      });
    },
    removeChannelHighlight: (state, action) => {
      const channelId = action.payload;

      return state.map((channel) => {
        if (channel.id === channelId) {
          return {
            ...channel,
            highlighted: false,
          };
        }

        return channel;
      });
    },
  },
});

export default channelsSlice.reducer;

export const { addChannel, highlightChannel, removeChannelHighlight, modifyChannelName, restore, removeChannel } = channelsSlice.actions;
