import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import dayjs from "dayjs";

export const fetchAppointments = createAsyncThunk(
  "appointmentHistory/fetchAppointments",
  async (patientId) => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/appointment/patient/${patientId}`
    );
    return res.data.data;
  }
);

const appointmentHistorySlice = createSlice({
  name: "appointmentHistory",
  initialState: {
    past: [],
    future: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        const now = dayjs();
        const past = [];
        const future = [];

        action.payload.forEach((a) => {
          const day = dayjs(a.bookingDate).startOf("day");
          const dateTime = a.slot
            ? dayjs(`${day.format("YYYY-MM-DD")} ${a.slot.split("-")[0].trim()}`, "YYYY-MM-DD hh:mm A")
            : day;

          if (day.isBefore(now, "day") || dateTime.isBefore(now)) {
            past.push(a);
          } else {
            future.push(a);
          }
        });

        state.past = past;
        state.future = future;
        state.status = "succeeded";
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default appointmentHistorySlice.reducer;
