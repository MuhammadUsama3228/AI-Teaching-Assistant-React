import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.accessToken = action.payload.access;
            state.refreshToken = action.payload.refresh;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logoutSuccess: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logoutSuccess, refreshSuccess } = authSlice.actions;

export default authSlice.reducer;
