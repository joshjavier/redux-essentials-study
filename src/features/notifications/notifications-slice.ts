import { createSlice } from "@reduxjs/toolkit"
import { client } from "@/api/client"
import { RootState } from "@/app/store"
import { createAppAsyncThunk } from "@/app/with-types"

export interface ServerNotification {
  id: string
  date: string
  message: string
  user: string
}

export interface ClientNotification extends ServerNotification {
  read: boolean
  isNew: boolean
}

export const fetchNotifications = createAppAsyncThunk(
  'notifications/fetchNotifications',
  async (_unused, thunkApi) => {
    const allNotifications = selectAllNotifications(thunkApi.getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get<ServerNotification[]>(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.data
  },
)

const initialState: ClientNotification[] = []

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      state.forEach(notification => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      const notificationsWithMetadata: ClientNotification[] =
        action.payload.map(notification => ({
          ...notification,
          read: false,
          isNew: true,
        }));

      state.forEach(notification => {
        notification.isNew = !notification.read
      });
      state.push(...notificationsWithMetadata)
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const selectAllNotifications = (state: RootState) => state.notifications
export const selectUnreadNotificationsCount = (state: RootState) => {
  const allNotifications = selectAllNotifications(state)
  const unreadNotifications = allNotifications.filter(
    notification => !notification.read
  )
  return unreadNotifications.length
}