import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  message: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    isAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
    setMessage(state, action) {
      state.message = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
