import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const errorsSlice = createSlice({
  name: 'errors',
  initialState: {
    errors: [],
  },
    reducers: {
    addError: (state, action) => {
        const message = action.payload;
        const currentErrors = state.errors;
        currentErrors.push({
            id: uuidv4(),
            message
        })
        state.errors =  currentErrors;
    },
    removeError: (state, action) => {
        const id = action.payload;
        const filteredErrors = state.errors.filter(({id: errorId}) => errorId !== id);
        state.errors = filteredErrors;
    },
    restore: (state) => {
        state.errors = [];
    }
  },
});

export default errorsSlice.reducer;

export const { addError, removeError, restore } = errorsSlice.actions;
