import { configureStore } from '@reduxjs/toolkit'
import playersReducer from './playersSlice'
import clubsReducer from './clubsSlice'
import recordsReducer from './recordsSlice'
import playerRecordsReducer from './playerRecordsSlice'

export const store = configureStore({
    reducer: {
        players: playersReducer,
        clubs: clubsReducer,
        records: recordsReducer,
        playerRecords: playerRecordsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch