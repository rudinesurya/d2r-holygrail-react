import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConfigState {
    authBaseUri: string;
    recordsBaseUri: string;
    graphqlBaseUri: string;
    error?: string;
}

const initialState: ConfigState = {
    authBaseUri: '',
    recordsBaseUri: '',
    graphqlBaseUri: '',
};

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        fetchConfigRequest(state) {
            state.error = undefined;
        },
        fetchConfigSuccess(state, action: PayloadAction<{ authBaseUri: string; recordsBaseUri: string; graphqlBaseUri: string; }>) {
            state.authBaseUri = action.payload.authBaseUri;
            state.recordsBaseUri = action.payload.recordsBaseUri;
            state.graphqlBaseUri = action.payload.graphqlBaseUri;
            state.error = undefined;
        },
        fetchConfigFailure(state, action: PayloadAction<{ error: string }>) {
            state.error = action.payload.error;
        },
    },
});

export const {
    fetchConfigRequest,
    fetchConfigSuccess,
    fetchConfigFailure,
} = configSlice.actions;

export default configSlice.reducer;