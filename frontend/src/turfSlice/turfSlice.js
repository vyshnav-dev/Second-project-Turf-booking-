/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  turfInfo: localStorage.getItem('turfInfo') ? JSON.parse(localStorage.getItem('turfInfo')) : null
}

const turfSlice = createSlice({
  name: "turf",
  initialState,
  reducers: {
    setturfCredentials: (state, action) => {
      state.turfInfo = action.payload;
      localStorage.setItem("turfInfo", JSON.stringify(action.payload));
    },
    
  },

});

export const { setturfCredentials} = turfSlice.actions;

export default turfSlice.reducer;