import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    user: null
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        updateUser: (state, action) => {
            state.user = action.payload.data
        },
        clearUser: (state) => {
            state.user = null
        }
    }
});

export const {setUser, clearUser, updateUser} = userSlice.actions;

export default userSlice.reducer;