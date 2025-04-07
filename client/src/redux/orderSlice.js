import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  order: {
    user: null,
    laundromat: null,
    services: [],
    totalPrice: 0,
    paymentMethod: '',
    delivery: {
      pickupLocation: {
        type: 'Point',
        coordinates: [],
      },
      deliveryLocation: {
        type: 'Point',
        coordinates: [],
      },
      deliveryStatus: 'Pending',
    },
    placedAt: new Date(),
  },
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderDetails(state, action) {
      state.order = { ...state.order, ...action.payload };
    },
  },
});

export const { setOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
