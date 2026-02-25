import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hijriAdjustment: -1, // Default -1 for India/Subcontinent as requested
  calculationMethod: 1, // 1 is University of Islamic Sciences, Karachi (Subcontinent)
  location: null, // { latitude, longitude, city, country }
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setHijriAdjustment: (state, action) => {
      state.hijriAdjustment = action.payload;
    },
    setCalculationMethod: (state, action) => {
      state.calculationMethod = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
  }
})

export const {
  setHijriAdjustment,
  setCalculationMethod,
  setLocation,
} = settingsSlice.actions;

export default settingsSlice.reducer;
