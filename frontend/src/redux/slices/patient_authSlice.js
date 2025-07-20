// here file name given patient_authSlice.js but in system src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  name: '',
  email: '',
  phone: '',
  gender: '',
  dob: '',
  patientId: '',
  profilePic: '',
  address: {},
  token: '', 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const {
        name,
        email,
        phone,
        gender,
        dob,
        patientId,
        profilePic,
        address,
        token,
      } = action.payload;

      state.isLoggedIn = true;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.gender = gender;
      state.dob = dob;
      state.patientId = patientId;
      state.profilePic = profilePic || '';
      state.address = address || {};
      state.token = token || '';
    },

    logout: () => initialState,

    setAuth: (state, action) => {
      const { token, profilePic } = action.payload;
      state.isLoggedIn = !!token;
      state.profilePic = profilePic || '';
      state.token = token || '';
    },
  },
});

export const { login, logout, setAuth } = authSlice.actions;
export default authSlice.reducer;
