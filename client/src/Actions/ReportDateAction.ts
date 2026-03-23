import { createSlice } from '@reduxjs/toolkit';

const now = new Date();

// Start of the month: Year, Month, Day 1
const startDate = new Date(now.getFullYear(), now.getMonth(), 1);

// End of the month: Year, Next Month, Day 0 (Day 0 of next month is the last day of this month)
const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

// Format to YYYY-MM-DD for your API
export const format = (date: Date) =>
  date.toLocaleDateString('en-CA').split('T')[0];

const initialState = {
  startDate: format(startDate),
  endDate: format(endDate),
};

const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setDates(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
});

export const dateActions = dateSlice.actions;
export default dateSlice.reducer;
