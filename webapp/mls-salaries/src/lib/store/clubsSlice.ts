import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase/server'

export interface Club {
    clubid: string;
    clubname: string;
    yearfirst: string;
    yearfinal: string;
    colorprimary: string;
    colorsecondary: string;
    
}

interface ClubsState {
    data: Club[];
    loading: boolean;
    error: string | null;
}

const initialState: ClubsState = {
    data: [],
    loading: false,
    error: null
}

export const fetchClubs = createAsyncThunk('clubs/fetchClubs', async () => {
    const { data, error } = await supabase.from('clubs').select('*')
    if (error) throw new Error(error.message)
    return data as Club[]
})

const clubsSlice = createSlice({
    name: 'clubs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClubs.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchClubs.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchClubs.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch clubs!'
            })
    }
})

export default clubsSlice.reducer