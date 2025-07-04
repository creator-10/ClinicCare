// src/components/Navbar.jsx
import React, { useEffect } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setAuth } from '../redux/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, profilePic } = useSelector((state) => state.auth);

  // Sync Redux state from localStorage on load
 useEffect(() => {
  const token = localStorage.getItem('token');
  const profile = localStorage.getItem('profilePic');
  if (token) {
    dispatch(setAuth({ token, profilePic: profile }));
  }
}, [dispatch]);

  // Logout handler
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('profilePic');
    navigate('/');
  };

  return (
    <div className="flex flex-wrap items-center justify-between py-3 mb-5 border-b border-b-gray-400 gap-y-4 px-4">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-2">
        <img
          src={assets.logo}
          alt="Logo"
          className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
        />
        <div className="flex flex-col leading-none">
          <h1 className="text-xl md:text-2xl font-bold m-0">Medico</h1>
          <p className="text-sm md:text-base text-gray-700 -mt-1 m-0">Heal. Thrive. Live.</p>
        </div>
      </div>

      {/* Center Nav */}
      <ul className="hidden md:flex gap-8 font-medium items-center">
        <NavLink to="/"><li className="py-1 hover:bg-blue-400 hover:text-white w-20 text-center rounded-full">HOME</li></NavLink>
        <NavLink to="/doctors"><li className="py-1 hover:bg-blue-400 hover:text-white w-40 text-center rounded-full">ALL DOCTORS</li></NavLink>
        <NavLink to="/about"><li className="py-1 hover:bg-blue-400 hover:text-white w-20 text-center rounded-full">ABOUT</li></NavLink>
        <NavLink to="/contact"><li className="py-1 hover:bg-blue-400 hover:text-white w-24 text-center rounded-full">CONTACT</li></NavLink>
      </ul>

      {/* Right Side */}
      <div className="flex items-center gap-4">
       {isLoggedIn ? (
  <div className="flex items-center gap-2 cursor-pointer group relative">
    <img
      className="w-11 h-11 rounded-full object-cover"
      src={profilePic || assets.profile_pic}
      alt="Profile"
    />
    <img
      className="w-4 h-4 m-2 -ml-1 mt-5"
      src={assets.dropdown_icon}
      alt="Dropdown"
    />
    <div className="absolute top-0 right-0 pt-14 z-20 hidden group-hover:block">
      <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 text-base font-medium text-gray-600">
        <p onClick={() => navigate('/profile')} className="hover:text-black cursor-pointer">My Profile</p>
        <p onClick={() => navigate('/appointment-booking')} className="hover:text-black cursor-pointer">My Appointments</p>
        <p onClick={() => navigate('/appointment-history')} className="hover:text-black cursor-pointer">Appointment History</p>
        <p onClick={handleLogout} className="hover:text-black cursor-pointer">Logout</p>
      </div>
    </div>
  </div>
) : (
  <button
    onClick={() => navigate('/login')}
    className="bg-primary text-white text-center font-semibold w-20 py-2 rounded-full text-sm"
  >
    Register
  </button>
)}

      
        {/* Mobile Menu Icon */}
        <i
          className="bi bi-list text-3xl md:hidden cursor-pointer"
          onClick={() => alert("Open mobile menu logic here")}
        ></i>
      </div>
    </div>
  );
};

export default Navbar;
