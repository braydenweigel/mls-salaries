import { configureStore } from '@reduxjs/toolkit'
import playersReducer from './playersSlice'
import clubsReducer from './clubsSlice'
import recordsReducer from './recordsSlice'

export const store = configureStore({
    reducer: {
        players: playersReducer,
        clubs: clubsReducer,
        records: recordsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch