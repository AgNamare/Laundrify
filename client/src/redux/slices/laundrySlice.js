import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  history: [],
};

const laundrySlice = createSlice({
  name: 'laundry',
  initialState,
  reducers: {
    addLaundryOrder: (state, action) => {
      const { laundryName, services } = action.payload;
      const steps = [
        { name: 'Washing', completed: false },
        { name: 'Cleaning', completed: false },
        { name: 'Drying', completed: false },
        { name: 'Deliver', completed: false }
      ];

      const newOrder = {
        laundryName,
        date: new Date().toLocaleString(),
        steps: steps.map(step => ({
          ...step,
          completed: services.includes(step.name.toLowerCase())
        })),
        status: 'Ongoing'
      };

      state.history.unshift(newOrder);
    },
    updateOrderStatus: (state, action) => {
      const { orderIndex, stepName, completed } = action.payload;
      const order = state.history[orderIndex];
      
      if (order) {
        const step = order.steps.find(s => s.name.toLowerCase() === stepName.toLowerCase());
        if (step) {
          step.completed = completed;
        }

        // Check if all steps are completed
        const allCompleted = order.steps.every(step => step.completed);
        order.status = allCompleted ? 'Completed' : 'Ongoing';
      }
    }
  }
});

export const { addLaundryOrder, updateOrderStatus } = laundrySlice.actions;
export default laundrySlice.reducer; 