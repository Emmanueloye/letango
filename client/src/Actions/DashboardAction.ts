import { createSlice } from '@reduxjs/toolkit';

interface InitialStateType {
  isSidebarOpen: boolean;
}

// Initial state
const initialState: InitialStateType = {
  isSidebarOpen: false,
};

// dashbaord slice
const dashboardSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // the function toggles sidebar and top nav state
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    // Close the sidebar on mobile view.
    closeSidebar(state) {
      state.isSidebarOpen = false;
    },
  },
});

export const dashboardActions = dashboardSlice.actions;

export default dashboardSlice.reducer;
