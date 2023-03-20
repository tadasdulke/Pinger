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
    }
})

export default channelsSlice.reducer;

export const { addChannel } = channelsSlice.actions;