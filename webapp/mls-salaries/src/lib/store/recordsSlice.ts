import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase/server'
import { RootState } from './store';

export interface Record {
    recordid: string;
    playerid: string;
    club: string;
    position: string;
    basesalary: number;
    guaranteedcomp: number;
    recordyear: string;
    
}

interface RecordsState {
    data: Record[];
    loading: boolean;
    error: string | null;
}

const initialState: RecordsState = {
    data: [],
    loading: false,
    error: null
}

export const fetchRecords = createAsyncThunk('records/fetchRecords', async () => {
    const { data, error } = await supabase.from('records').select('*')
    if (error) throw new Error(error.message)
    return data as Record[]
})

const recordsSlice = createSlice({
    name: 'records',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecords.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchRecords.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchRecords.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch players!'
            })
    }
})
export const makeSelectRecordsByPlayerId = (playerId: string) =>
  createSelector(
    (state: RootState) => state.records.data,
    (records) => records.filter((record) => record.playerid === playerId)
  )
  
export default recordsSlice.reducer