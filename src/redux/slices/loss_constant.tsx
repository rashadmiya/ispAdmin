import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
}

export const lossConstant = createSlice({
    name: "loss constant",
    initialState,
    reducers:{
        addLossConstant:(state,action) =>{
            state.value = (action.payload)
        },
        removeLossConstant:(state, action) => {
            state.value = []
        }
    }
})

export const {addLossConstant,removeLossConstant}= lossConstant.actions;
export default lossConstant.reducer;