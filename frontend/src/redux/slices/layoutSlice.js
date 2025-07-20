// redux/slices/layoutSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mainContentHeight: 0,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setMainContentHeight: (state, action) => {
      state.mainContentHeight = action.payload;
    },
  },
});

export const { setMainContentHeight } = layoutSlice.actions;
export default layoutSlice.reducer;
