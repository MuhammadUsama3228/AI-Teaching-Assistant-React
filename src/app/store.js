import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../pages/profile/manage-profile/manage-profile.js'
import authReducer from '../pages/auth.js'
import csrfReducer from '../features/api/csrf_token.js'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { combineReducers } from '@reduxjs/toolkit'

// Define persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'user', 'csrf'],
}

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    csrf: csrfReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {      
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})

export const persistor = persistStore(store)
export default store;