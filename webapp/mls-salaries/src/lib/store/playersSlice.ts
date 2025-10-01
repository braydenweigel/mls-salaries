import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase/server'

export interface Player {
    playerid: string;
    firstname: string;
    lastname: string;
}

interface PlayersState {
    data: Player[];
    loading: boolean;
    error: string | null;
}

const initialState: PlayersState = {
    data: [],
    loading: false,
    error: null
}

export const fetchPlayers = createAsyncThunk('players/fetchPlayers', async () => {
    const { data, error } = await supabase.from('players').select('*')
    if (error) throw new Error(error.message)
    return data as Player[]
})

const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlayers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPlayers.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchPlayers.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch players!'
            })
    }
})

export default playersSlice.reducer