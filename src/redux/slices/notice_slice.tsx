import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
}

export const noticeSlice = createSlice({
    name: "Notices",
    initialState,
    reducers: {
        addNotice: (state, action) => {
            state.value = (action.payload)
        },
        removeNotice: (state, action) => {
            state.value = []
        }
    }
})

export const { addNotice, removeNotice } = noticeSlice.actions;
export default noticeSlice.reducer;