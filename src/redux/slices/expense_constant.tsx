import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
}

export const expenseConstant = createSlice({
    name: "Expense constant",
    initialState,
    reducers:{
        addExpenseConstant:(state,action) =>{
            state.value = (action.payload)
        },
        removeExpenseConstant:(state, action) => {
            state.value = []
        }
    }
})

export const {addExpenseConstant,removeExpenseConstant}= expenseConstant.actions;
export default expenseConstant.reducer;