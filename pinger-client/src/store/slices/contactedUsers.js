import { createSlice } from '@reduxjs/toolkit'

const contactedUsersSlice = createSlice({
    name: 'contactedUsers',
    initialState: {
      users: [],
    },
    reducers: {
      addContactedUser: (state, action) => {
        const modifiedUser = {
          ...action.payload,
          highlighted: false
        }
        state.users = [...state.users, modifiedUser]
      },
      highlightUser: (state, action) => {
        const updatedUsers = state.users.map(user => {
          if(user.id === action.payload) {
            return {
              ...user,
              highlighted: true
            }
          }

          return user;
        })
        
        state.users = updatedUsers;
      },
      removeUserHighlight: (state, action) => {
        const updatedUsers = state.users.map(user => {
          if(user.id === action.payload) {
            return {
              ...user,
              highlighted: false
            }
          }

          return user;
        })
        
        state.users = updatedUsers;
      },
    }
})

export default contactedUsersSlice.reducer;

export const { addContactedUser, highlightUser, removeUserHighlight } = contactedUsersSlice.actions;