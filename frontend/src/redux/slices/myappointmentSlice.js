// redux/slices/myappointmentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAppointmentsByPatient = createAsyncThunk(
  "appointments/fetchByPatient",
  async (patientId) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/appointment/patient/${patientId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch appointments");
    return data.data;
  }
);

const myappointmentSlice = createSlice({
  name: "myappointments",
  initialState: {
    upcoming: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentsByPatient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAppointmentsByPatient.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.upcoming = action.payload;
      })
      .addCase(fetchAppointmentsByPatient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default myappointmentSlice.reducer;
