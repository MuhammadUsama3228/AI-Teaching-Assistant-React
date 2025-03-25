import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,  // Stores user information
  token: null, // Stores authentication token
  isAuthenticated: false, // Tracks authentication status
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

// Export actions
export const { loginSuccess, logoutSuccess } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
