import { configureStore } from '@reduxjs/toolkit'
import LOCAL_STORAGE_ITEMS from '@Common/config/localStorageItems'
import authReducer from './slices/auth'
import workspaceReducer from './slices/workspaces'
import chatReducer from './slices/chat'
import contactedUsersReducer from './slices/contactedUsers'
import channelsReducer from './slices/channels'

const store = configureStore({
    reducer: {
        auth: authReducer,
        workspace: workspaceReducer,
        chat: chatReducer,
        contactedUsers: contactedUsersReducer,
        channels: channelsReducer
    },
    preloadedState: {
        auth: {
            [LOCAL_STORAGE_ITEMS.IS_AUTHENTICATED]: localStorage.getItem(LOCAL_STORAGE_ITEMS.IS_AUTHENTICATED),
            [LOCAL_STORAGE_ITEMS.USER_ID]: localStorage.getItem(LOCAL_STORAGE_ITEMS.USER_ID),
            [LOCAL_STORAGE_ITEMS.USER_NAME]: localStorage.getItem(LOCAL_STORAGE_ITEMS.USER_NAME)
        },
        workspace: {
            [LOCAL_STORAGE_ITEMS.WORKSPACE_ID]: +localStorage.getItem(LOCAL_STORAGE_ITEMS.WORKSPACE_ID)
        },
    }
})

export default store; 