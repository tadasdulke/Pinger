import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [],
    reducers: {
    addNotification: (state, action) => {
        const {notification, type} = action.payload;

        const currentNotifications = state;
        currentNotifications.push({
            id: uuidv4(),
            notification,
            type: type || "success"
        })
        return currentNotifications;
    },
    removeNotification: (state, action) => {
        const id = action.payload;
        const filteredNotifications = state.filter(({id: notificationId}) => notificationId !== id);
        return filteredNotifications;
    },
    restore: () => {
        return [];
    }
  },
});

export default notificationsSlice.reducer;

export const { addNotification, removeNotification, restore } = notificationsSlice.actions;
