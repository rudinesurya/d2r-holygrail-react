import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecordDto } from '../../dto/records/record.dto';
import { CreateRecordDto } from '../../dto/records/create-record-payload.dto';

interface RecordsState {
    fetchRecentRecords: {
        recentRecords: RecordDto[];
        loading: boolean;
        error?: string;
    },
    createRecord: {
        record?: RecordDto;
        loading: boolean;
        error?: string;
    }
}

const initialState: RecordsState = {
    fetchRecentRecords: {
        recentRecords: [],
        loading: false,
        error: undefined,
    },
    createRecord: {
        record: undefined,
        loading: false,
        error: undefined,
    }
};

const recordsSlice = createSlice({
    name: 'records',
    initialState,
    reducers: {
        fetchRecordsRequest(state) {
            state.fetchRecentRecords.loading = true;
            state.fetchRecentRecords.error = undefined;
        },
        fetchRecordsSuccess(state, action: PayloadAction<{ recentRecords: RecordDto[] }>) {
            state.fetchRecentRecords.recentRecords = action.payload.recentRecords;
            state.fetchRecentRecords.loading = false;
        },
        fetchRecordsFailure(state, action: PayloadAction<{ error: string }>) {
            state.fetchRecentRecords.loading = false;
            state.fetchRecentRecords.error = action.payload.error;
        },

        createRecordRequest(state, action: PayloadAction<CreateRecordDto>){
            state.createRecord.loading = true;
            state.createRecord.error = undefined;
        },
        createRecordSuccess(state) {
            state.createRecord.loading = false;
        },
        createRecordFailure(state, action: PayloadAction<{ error: string }>) {
            state.createRecord.loading = false;
            state.createRecord.error = action.payload.error;
        },
    },
});

export const {
    fetchRecordsRequest,
    fetchRecordsSuccess,
    fetchRecordsFailure,
    createRecordRequest,
    createRecordSuccess,
    createRecordFailure,
} = recordsSlice.actions;
export default recordsSlice.reducer;