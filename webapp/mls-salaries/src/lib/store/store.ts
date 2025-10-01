import { configureStore } from '@reduxjs/toolkit'
import playersReducer from './playersSlice'
import clubsReducer from './clubsSlice'
import recordsReducer from './recordsSlice'

export const store = () => {
    return configureStore({
        reducer: {
            players: playersReducer,
            clubs: clubsReducer,
            records: recordsReducer
        }
    })
}

export type AppStore = ReturnType<typeof store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']