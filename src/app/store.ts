import { configureStore } from '@reduxjs/toolkit'

import { apiSlice } from '@/features/api/api-slice'
import postsReducer from '@/features/posts/posts-slice'
import usersReducer from '@/features/users/users-slice'
import authReducer from '@/features/auth/auth-slice'
import notificationsReducer from '@/features/notifications/notifications-slice'

import { listenerMiddleware } from './listener-middleware'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    auth: authReducer,
    notifications: notificationsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(apiSlice.middleware)
  },
})

export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<AppStore['getState']>
