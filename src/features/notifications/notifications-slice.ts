import { createAction, createEntityAdapter, createSelector, createSlice, isAnyOf } from "@reduxjs/toolkit"
import { AppThunk, RootState } from "@/app/store"
import { apiSlice } from "../api/api-slice"
import { forceGenerateNotifications } from "@/api/server"

export interface ServerNotification {
  id: string
  date: string
  message: string
  user: string
}

export interface NotificationMetadata {
  id: string
  read: boolean
  isNew: boolean
}

const metadataAdapter = createEntityAdapter<NotificationMetadata>()

const notificationsReceived = createAction<ServerNotification[]>('notifications/notificationsReceived')

export const apiSliceWithNotifications = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query<ServerNotification[], void>({
      query: () => '/notifications',
      async onCacheEntryAdded(arg, lifecycleApi) {
        const ws = new WebSocket('ws://localhost')
        try {
          await lifecycleApi.cacheDataLoaded

          const listener = (event: MessageEvent<string>) => {
            const message: { type: 'notifications', payload: ServerNotification[] } = JSON.parse(event.data)
            switch (message.type) {
              case 'notifications': {
                lifecycleApi.updateCachedData(draft => {
                  draft.push(...message.payload)
                  draft.sort((a, b) => b.date.localeCompare(a.date))
                })

                lifecycleApi.dispatch(notificationsReceived(message.payload))
              }
              default:
                break;
            }
          }

          ws.addEventListener('message', listener)
        } catch {}

        await lifecycleApi.cacheEntryRemoved
        ws.close()
      },
    }),
  }),
})

export const { useGetNotificationsQuery } = apiSliceWithNotifications

const matchNotificationsReceived = isAnyOf(
  notificationsReceived,
  apiSliceWithNotifications.endpoints.getNotifications.matchFulfilled,
)

export const fetchNotificationsWebsocket =
  (): AppThunk => (dispatch, getState) => {
    const allNotifications = selectNotificationsData(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification?.date ?? ''
    forceGenerateNotifications(latestTimestamp)
  }

const emptyNotifications: ServerNotification[] = []

export const selectNotificationsResult = apiSliceWithNotifications.endpoints.getNotifications.select()

const selectNotificationsData = createSelector(
  selectNotificationsResult,
  notificationsResult => notificationsResult.data ?? emptyNotifications
)

const initialState = metadataAdapter.getInitialState()

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      Object.values(state.entities).forEach(metadata => {
        metadata.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      matchNotificationsReceived,
      (state, action) => {
        const notificationsMetadata: NotificationMetadata[] =
          action.payload.map(notification => ({
            id: notification.id,
            read: false,
            isNew: true,
          }));

        Object.values(state.entities).forEach(metadata => {
          metadata.isNew = !metadata.read
        });

        metadataAdapter.upsertMany(state, notificationsMetadata)
      },
    )
  },
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const {
  selectAll: selectAllNotificationsMetadata,
  selectEntities: selectMetadataEntities,
} = metadataAdapter.getSelectors((state: RootState) => state.notifications)

export const selectUnreadNotificationsCount = (state: RootState) => {
  const allMetadata = selectAllNotificationsMetadata(state)
  const unreadNotifications = allMetadata.filter(metadata => !metadata.read)
  return unreadNotifications.length
}
