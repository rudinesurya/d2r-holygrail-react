import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ItemCountDto } from '../../dto/item-counts/item-counts.dto';

interface ItemCountsState {
    itemCounts: ItemCountDto[];
    loading: boolean;
    error?: string;
}

const initialState: ItemCountsState = {
    itemCounts: [],
    loading: false,
    error: undefined,
};

const recordsSlice = createSlice({
    name: 'item-counts',
    initialState,
    reducers: {
        fetchItemCountsRequest(state) {
            state.loading = true;
            state.error = undefined;
        },
        fetchItemCountsSuccess(state, action: PayloadAction<{ itemCounts: ItemCountDto[] }>) {
            state.itemCounts = action.payload.itemCounts;
            state.loading = false;
        },
        fetchItemCountsFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },
    },
});

export const {
    fetchItemCountsRequest,
    fetchItemCountsSuccess,
    fetchItemCountsFailure,
} = recordsSlice.actions;
export default recordsSlice.reducer;