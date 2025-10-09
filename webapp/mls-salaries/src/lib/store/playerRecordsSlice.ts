import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase/server'
import { RootState } from './store';

export interface PlayerRecord {
    id: string;
    playerid: string;
    firstname: string;
    lastname: string;
    club: string;
    position: string;
    basesalary: number;
    guaranteedcomp: number;
    recordyear: string;
    recordseason: string;
    
}

interface PlayerRecordsState {
    data: PlayerRecord[];
    loading: boolean;
    error: string | null;
}

const initialState: PlayerRecordsState = {
    data: [],
    loading: false,
    error: null
}

export const fetchPlayerRecords = createAsyncThunk('playerRecords/fetchPlayerRecords', async () => {
    const { data, error } = await supabase.from('playerrecords').select('*')
    if (error) throw new Error(error.message)
    return data as PlayerRecord[]
})

const playerRecordsSlice = createSlice({
    name: 'playerRecords',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlayerRecords.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPlayerRecords.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchPlayerRecords.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch player records!'
            })
    }
})
export const makeSelectPlayerRecordsByPlayerId = (playerId: string) =>
  createSelector(
    (state: RootState) => state.playerRecords.data,
    (records) => records.filter((record) => record.playerid === playerId)
)

export const makeSelectPlayerRecordsByYear = (year: string, season: string) =>
  createSelector(
    (state: RootState) => state.playerRecords.data,
    (records) => records.filter((record) => record.recordyear === year && record.recordseason === season)
)

export const makeSelectPlayerRecordsByClub = (clubID: string) =>
  createSelector(
    (state: RootState) => state.playerRecords.data,
    (records) => records.filter((record) => record.club === clubID)
)
  
export default playerRecordsSlice.reducer