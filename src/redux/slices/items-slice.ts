import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ItemDto } from '../../dto/items/item.dto';

interface ItemsState {
    items: ItemDto[];
    loading: boolean;
    error?: string;
}

const initialState: ItemsState = {
    items: [],
    loading: false,
    error: undefined,
};

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        fetchItemsRequest(state) {
            state.loading = true;
            state.error = undefined;
        },
        fetchItemsSuccess(state, action: PayloadAction<{ items: ItemDto[] }>) {
            state.items = action.payload.items;
            state.loading = false;
        },
        fetchItemsFailure(state, action: PayloadAction<{ error: string }>) {
            state.loading = false;
            state.error = action.payload.error;
        },
    },
});

export const {
    fetchItemsRequest,
    fetchItemsSuccess,
    fetchItemsFailure,
} = itemsSlice.actions;
export default itemsSlice.reducer;