import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const initialState = {
  isLoggedIn: !!localStorage.getItem('token'),
  name: '',
  email: '',
  phone: '',
  gender: '',
  dob: '',
  patientId: '',
  profilePic: '',
  address: {},
  token: localStorage.getItem('token') || '',
  role: localStorage.getItem('role') || '',
  user: getInitialUser(), // <-- add this
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
  const {
    token,
    role,
    user = {},
  } = action.payload;

  const {
    username,
    email,
    phone,
    gender,
    dob,
    patientId, // <-- use patientId
    profilePic,
    address,
  } = user;

  state.isLoggedIn = true;
  state.name = username || '';
  state.email = email || '';
  state.phone = phone || '';
  state.gender = gender || '';
  state.dob = dob || '';
  state.patientId = patientId || '';
  state.profilePic = profilePic || '';
  state.address = address || {};
  state.token = token || '';
  state.role = role || '';
  state.user = user || {};

  localStorage.setItem('token', token || '');
  localStorage.setItem('role', role || '');
  localStorage.setItem('user', JSON.stringify(user || {}));
},

   logout: (state) => {
  Object.assign(state, {
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
    role: '',
    user: {},
  });
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('profilePic');
  localStorage.removeItem('user');

  // Dispatch to profileSlice
  // 🚨 You cannot call dispatch directly here, so handle it in your logout button with a thunk or inside component
},


    setToken: (state, action) => {
      const { token = '', role = '' } = action.payload || {};
      state.token = token;
      state.role = role;
      state.isLoggedIn = !!token;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
    },

    setAuth: (state, action) => {
      const { token, profilePic, user } = action.payload;
      state.token = token || '';
      state.profilePic = profilePic || '';
      state.isLoggedIn = !!token;
      if (user) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      }
    },

    clearToken: (state) => {
      state.token = '';
      state.role = '';
      state.isLoggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
});

export const { login, logout, setToken, setAuth, clearToken } = authSlice.actions;
export default authSlice.reducer;