import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails(state, action) {
      state.user = action.payload; // Set user details
    },
    clearUserDetails(state) {
      state.user = null; // Clear user details on signout
    },
    setLoading(state, action) {
      state.isLoading = action.payload; // Set loading state
    },
    setError(state, action) {
      state.error = action.payload; // Set error state
    },
    clearError(state) {
      state.error = null; // Clear error state
    },
  },
});

// Export actions
export const {
  setUserDetails,
  clearUserDetails,
  setLoading,
  setError,
  clearError,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
