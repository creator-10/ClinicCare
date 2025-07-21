import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout as clearAuth } from '../redux/slices/authSlice';
import { assets } from '../assets/assets';

// MUI Icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const SidebarLink = ({ to, icon, title, className = '' }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 text-gray-700 rounded hover:bg-gray-100 ${
        isActive ? 'bg-gray-200 font-semibold' : ''
      } ${className}`
    }
    onClick={() => {
      if (window.innerWidth < 768) {
        document.body.classList.remove('sidebar-open');
      }
    }}
  >
    {icon && <img src={icon} alt={`${title} icon`} className="w-5 h-5" />}
    {title}
  </NavLink>
);

const PatientSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSpecialist, setShowSpecialist] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearAuth());
    localStorage.removeItem('token');
    localStorage.removeItem('profilePic');
    navigate('/');
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(prev => !prev);
    document.body.classList.toggle('sidebar-open');
  };

  // Clean up sidebar-open class on unmount
  useEffect(() => {
    return () => document.body.classList.remove('sidebar-open');
  }, []);

  const isFullHeightPage =
    location.pathname === '/appointment-booking' ||
    location.pathname === '/patient/home' ||
    location.pathname === '/about';

  const sidebarClass = `fixed md:static top-0 left-0 z-40 w-64 bg-white border-r shadow-md transition-transform transform duration-300 ease-in-out
    ${isFullHeightPage ? 'h-full' : 'min-h-screen'}
    ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    p-4 flex flex-col gap-4
  `;

  return (
    <>
      {/* Fixed Top Navbar on Mobile with Menu Icon */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <IconButton
          onClick={toggleMobileSidebar}
          size="large"
          aria-label="Open sidebar"
          className="bg-white shadow-md rounded"
        >
          <MenuIcon />
        </IconButton>
      </div>

      {/* Sidebar */}
      <div
        className={sidebarClass}
        style={{
          background: 'linear-gradient(180deg, #e0f7fa, #f1faff, #b3e5fc)',
        }}
      >
        <div className="flex justify-end md:hidden">
          <IconButton onClick={toggleMobileSidebar} aria-label="Close sidebar">
            <CloseIcon />
          </IconButton>
        </div>

        <SidebarLink to="/patient/home" icon={assets.Home} title="Home" />
        <SidebarLink to="/profile" icon={assets.profile} title="Profile" />
        <SidebarLink to="/doctors" icon={assets.doctorimage} title="Find Doctors" />

        <button
          onClick={() => setShowSpecialist(prev => !prev)}
          className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
        >
          <img src={assets.specialist} alt="Specialist icon" className="w-5 h-5" />
          Specialist
          <span className="ml-auto">{showSpecialist ? '▲' : '▼'}</span>
        </button>

        {showSpecialist && (
          <div className="ml-6 flex flex-col gap-2 text-sm">
            <SidebarLink to="/doctors/General%20physician" icon={assets.general_physicianicon} title="General Physician" />
            <SidebarLink to="/doctors/Dermatology" icon={assets.dermatology} title="Dermatology" />
            <SidebarLink to="/doctors/Radiology" icon={assets.Radiologys} title="Radiology" />
            <SidebarLink to="/doctors/Orthopedics" icon={assets.orthopedics} title="Orthopedics" />
            <SidebarLink to="/doctors/Pediatrics" icon={assets.pediatric} title="Pediatrician" />
            <SidebarLink to="/doctors/Cardiology" icon={assets.cardiologies} title="Cardiology" />
          </div>
        )}

        <SidebarLink to="/appointment-booking" icon={assets.Bookapt} title="Book Appointment" />
        <SidebarLink to="/my_appointment" icon={assets.myappointment} title="My Appointment" />
        <SidebarLink to="/appointment-history" icon={assets.appointment1} title="Appointment History" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 rounded"
        >
          <img src={assets.logout} alt="Logout icon" className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );
};

export default PatientSidebar;
