import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { assets } from '../../assets/assets';

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (patientId) => {
const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/${patientId}`);

    if (!res.ok) throw new Error('Failed to fetch profile');
    return await res.json();
  }
);

const initialState = {
  // Initialize from localStorage or fallback to default asset
  profilePic: localStorage.getItem('profilePic') || assets.profile_pic,
  userProfile: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
reducers: {
  setProfilePic: (state, action) => {
    state.profilePic = action.payload || assets.profile_pic;
    localStorage.setItem('profilePic', state.profilePic);
  },
  resetProfilePic: (state) => {
    state.profilePic = assets.profile_pic;
    localStorage.removeItem('profilePic');
  },
  clearUserProfile: (state) => {
    state.userProfile = null;
    state.profilePic = assets.profile_pic;
    localStorage.removeItem('profilePic');
  },
},

  extraReducers: (builder) => {
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.userProfile = action.payload;
      if (action.payload.image) {
        state.profilePic = action.payload.image;
        localStorage.setItem('profilePic', action.payload.image);
      }
      else {
        // No image from backend - fallback default (for safety)
        state.profilePic = assets.profile_pic;
        localStorage.setItem('profilePic', assets.profile_pic);
      }
    });
  },
});

export const { setProfilePic, resetProfilePic,clearUserProfile } = profileSlice.actions;
export default profileSlice.reducer;
