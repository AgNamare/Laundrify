import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderDetails(state, action) {
      state.order = action.payload; // Store order details before checkout
    },
    clearOrderDetails(state) {
      state.order = null; // Clear order after submission or cancellation
    },
  },
});

// Export actions
export const { setOrderDetails, clearOrderDetails } = orderSlice.actions;

// Export reducer
export default orderSlice.reducer;
