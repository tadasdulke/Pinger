import { createSlice } from '@reduxjs/toolkit';

const contactedUsersSlice = createSlice({
  name: 'contactedUsers',
  initialState: {
    users: [],
  },
  reducers: {
    restore: (state) => {
      state.users = [];
    },
    addContactedUser: (state, action) => {
      const userAlreadyExists = state.users.some((u) => u.id === action.payload.id);

      if (userAlreadyExists) {
        return state;
      }

      const modifiedUser = {
        ...action.payload,
        highlighted: false,
      };
      state.users = [...state.users, modifiedUser];
    },
    highlightUser: (state, action) => {
      const updatedUsers = state.users.map((user) => {
        if (user.id === action.payload) {
          return {
            ...user,
            highlighted: true,
          };
        }

        return user;
      });

      state.users = updatedUsers;
    },
    removeUserHighlight: (state, action) => {
      const updatedUsers = state.users.map((user) => {
        if (user.id === action.payload) {
          return {
            ...user,
            highlighted: false,
          };
        }

        return user;
      });

      state.users = updatedUsers;
    },
  },
});

export default contactedUsersSlice.reducer;

export const { addContactedUser, highlightUser, removeUserHighlight, restore } = contactedUsersSlice.actions;
