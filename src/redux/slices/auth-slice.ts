import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    login: {
        loading: boolean;
        token?: string | null;
        error?: string;
    };
    register: {
        loading: boolean;
        error?: string;
    };
    fetchUser: {
        loading: boolean;
        email?: string | null;
        userId?: string | null;
        error?: string;
    };
}

const initialState: AuthState = {
    login: {
        loading: false,
        token: null,
        error: undefined,
    },
    register: {
        loading: false,
        error: undefined,
    },
    fetchUser: {
        loading: false,
        email: null,
        userId: null,
        error: undefined,
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Login actions
        loginRequest(state) {
            state.login.loading = true;
            state.login.error = undefined;
        },
        loginSuccess(state, action: PayloadAction<{ token: string }>) {
            state.login.loading = false;
            state.login.token = action.payload.token;
        },
        loginFailure(state, action: PayloadAction<{ error: string }>) {
            state.login.loading = false;
            state.login.error = action.payload.error;
        },

        // Register actions
        registerRequest(state) {
            state.register.loading = true;
            state.register.error = undefined;
        },
        registerSuccess(state) {
            state.register.loading = false;
        },
        registerFailure(state, action: PayloadAction<{ error: string }>) {
            state.register.loading = false;
            state.register.error = action.payload.error;
        },

        // Fetch user actions
        fetchUserRequest(state) {
            state.fetchUser.loading = true;
            state.fetchUser.error = undefined;
        },
        fetchUserSuccess(state, action: PayloadAction<{ email: string; userId: string }>) {
            state.fetchUser.loading = false;
            state.fetchUser.email = action.payload.email;
            state.fetchUser.userId = action.payload.userId;
        },
        fetchUserFailure(state, action: PayloadAction<{ error: string }>) {
            state.fetchUser.loading = false;
            state.fetchUser.error = action.payload.error;
        },

        // Logout action
        logoutRequest() {
        },
        logout(state) {
            state.fetchUser.email = null;
            state.fetchUser.userId = null;
            state.login.error = undefined;
            state.register.error = undefined;
            state.fetchUser.error = undefined;
        },
    },
});

export const {
    loginRequest,
    loginSuccess,
    loginFailure,
    registerRequest,
    registerSuccess,
    registerFailure,
    fetchUserRequest,
    fetchUserSuccess,
    fetchUserFailure,
    logoutRequest,
    logout,
} = authSlice.actions;

export default authSlice.reducer;