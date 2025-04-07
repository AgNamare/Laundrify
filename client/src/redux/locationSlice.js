// locationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name: "location",
  initialState: {
    coords: null,
    address: null,
  },
  reducers: {
    setUserLocation: (state, action) => {
      state.coords = action.payload.coords;
      state.address = action.payload.address;
    },
  },
});

export const { setUserLocation } = locationSlice.actions;
export default locationSlice.reducer;
