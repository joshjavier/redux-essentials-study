import { configureStore } from '@reduxjs/toolkit'
import postsReducer from '@/features/posts/posts-slice'
import usersReducer from '@/features/users/users-slice'
import authReducer from '@/features/auth/auth-slice'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    auth: authReducer,
  },
})

export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<AppStore['getState']>
