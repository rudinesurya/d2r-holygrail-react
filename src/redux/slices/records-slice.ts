import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecordDto } from '../../dto/records/record.dto';

interface RecordsState {
    recentRecords: RecordDto[];
    loading: boolean;
    error?: string;
}

const initialState: RecordsState = {
    recentRecords: [],
    loading: false,
    error: undefined,
};

const recordsSlice = createSlice({
    name: 'records',
    initialState,
    reducers: {
        fetchRecordsRequest(state) {
            state.loading = true;
            state.error = undefined;
        },
        fetchRecordsSuccess(state, action: PayloadAction<{ recentRecords: RecordDto[] }>) {
            state.recentRecords = action.payload.recentRecords;
            state.loading = false;
        },
        fetchRecordsFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },
    },
});

export const {
    fetchRecordsRequest,
    fetchRecordsSuccess,
    fetchRecordsFailure,
} = recordsSlice.actions;
export default recordsSlice.reducer;