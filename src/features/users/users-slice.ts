import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'
import { createAppAsyncThunk } from '@/app/with-types'
import { client } from '@/api/client'

interface User {
  id: string
  name: string
}

export const fetchUsers = createAppAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get<User[]>('/fakeApi/users')
  return response.data
})

const initialState: User[] = []

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload
    })
  },
})

export default usersSlice.reducer

export const selectAllUsers = (state: RootState) => state.users
export const selectUserById = (state: RootState, userId: string | null) =>
  state.users.find(user => user.id === userId)
