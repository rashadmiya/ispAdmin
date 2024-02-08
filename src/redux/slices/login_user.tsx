import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {},
}

export const loginUser = createSlice({
    name: "logged in user",
    initialState,
    reducers:{
        addUser:(state,action) =>{
            state.value = (action.payload)
        },
        removeUser:(state, action) => {
            state.value = {}
        }
    }
})

export const {addUser,removeUser}= loginUser.actions;
export default loginUser.reducer;