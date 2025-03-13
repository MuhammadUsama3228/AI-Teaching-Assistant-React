import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    CSRF_TOKEN: "",
};

const CSRF_reducer = createSlice({
    name: "csrf",
    initialState,
    reducers: {
        setCsrfToken: (state, action) => {
            state.CSRF_TOKEN = action.payload;
        },
        clearCsrfToken: (state) => {
            state.CSRF_TOKEN = "";
        }
    },
});

export const { setCsrfToken , clearCsrfToken} = CSRF_reducer.actions;
export default CSRF_reducer.reducer;
