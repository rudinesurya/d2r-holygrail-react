import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LedgeDto } from '../../dto/stash/ledge.dto';

interface StashState {
    stash: LedgeDto[];
    loading: boolean;
    error?: string;
}

const initialState: StashState = {
    stash: [],
    loading: false,
    error: undefined,
};

const stashSlice = createSlice({
    name: 'stash',
    initialState,
    reducers: {
        fetchStashRequest(state) {
            state.loading = true;
            state.error = undefined;
        },
        fetchStashSuccess(state, action: PayloadAction<{ stash: LedgeDto[] }>) {
            state.stash = action.payload.stash;
            state.loading = false;
        },
        fetchStashFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },
    },
});

export const {
    fetchStashRequest,
    fetchStashSuccess,
    fetchStashFailure,
} = stashSlice.actions;
export default stashSlice.reducer;