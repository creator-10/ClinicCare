// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import doctorReducer from './doctorSlice';
import profileReducer from './slices/profileSlice';
import myappointmentReducer from "./slices/myappointmentSlice";
import appointmentHistoryReducer from "./slices/appointmentHistorySlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    
    doctors: doctorReducer,
    profile: profileReducer,
    myappointments: myappointmentReducer,
    appointmentHistory: appointmentHistoryReducer,
  },
});
