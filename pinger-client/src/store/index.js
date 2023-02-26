import { configureStore } from '@reduxjs/toolkit'
import LOCAL_STORAGE_ITEMS from '@Common/config/localStorageItems'
import authReducer from './slices/auth'
import workspaceReducer from './slices/workspaces'

const store = configureStore({
    reducer: {
        auth: authReducer,
        workspace: workspaceReducer
    },
    preloadedState: {
        auth: {
            [LOCAL_STORAGE_ITEMS.TOKEN]: localStorage.getItem(LOCAL_STORAGE_ITEMS.TOKEN)
        }
    }
})

export default store; 