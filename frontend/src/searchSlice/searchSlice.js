/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchInfo: localStorage.getItem('searchInfo') ? JSON.parse(localStorage.getItem('searchInfo')) : null
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setsearchCredentials: (state, action) => {
      state.searchInfo = action.payload;
      localStorage.setItem("searchInfo", JSON.stringify(action.payload));
    },
    
  },

});

export const { setsearchCredentials} = searchSlice.actions;

export default searchSlice.reducer;