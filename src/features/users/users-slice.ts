import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'
import { createAppAsyncThunk } from '@/app/with-types'
import { client } from '@/api/client'
import { selectCurrentUsername } from '../auth/auth-slice'

interface User {
  id: string
  name: string
  username: string
}

const usersAdapter = createEntityAdapter<User>()

export const fetchUsers = createAppAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get<User[]>('/fakeApi/users')
  return response.data
})

const initialState = usersAdapter.getInitialState()

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
  },
})

export default usersSlice.reducer

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
} = usersAdapter.getSelectors((state: RootState) => state.users)

export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  if (!currentUsername) {
    return
  }
  return selectUserById(state, currentUsername)
}
