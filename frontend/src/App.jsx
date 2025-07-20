// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Layouts
import MainLayout from "./components/MainLayout";
import Navbar from "./components/Navbar";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Patient Pages
import Home from "./pages/Patient/Home";
import Alldoctor from "./pages/Patient/Alldoctor";
import DoctorBySpeciality from "./pages/Patient/DoctorBySpeciality";
import AppointmentBooking from "./pages/Patient/Appointment_booking";
import AppointmentHistory from "./pages/Patient/Appointment_history";
import MyAppointment from "./pages/Patient/MyAppointment";
import Profile from "./pages/Patient/Profile";
import About from "./pages/Patient/About";
import Contact from "./pages/Patient/Contacts";
import Feedback from "./pages/Patient/Feedback";
import Patient_webpage from "./pages/Patient/Patient_webpage";

// Authentication
import Login from "./pages/Admin/Login";

// Doctor Pages
import DDashboard from "./pages/Doctor/Dashboard";
import VisitForm from "./pages/Doctor/visitRecord";
import AvailabilityManager from "./pages/Doctor/AvailabilityManager";

// Admin Pages
import AdminLayout from "./pages/Admin/AdminLayout";
import Reports from "./pages/Admin/Reports";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorList from "./pages/Admin/DoctorList";

function App() {
  const { token, role } = useSelector((state) => state.auth);
  const location = useLocation();

  const redirectToHome = () => {
    if (role === "admin") return "/admin";
    if (role === "doctor") return "/doctor";
    return "/patient/home";
  };

  return (
    <>
      {/* ToastContainer should be self-closing and outside main div */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="scroll-box">
        {location.pathname !== "/login" && <Navbar />}

       <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Patient_webpage />} />
          <Route
            path="/login"
            element={token ? <Navigate to={redirectToHome()} replace /> : <Login />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
           <Route path="/doctors" element={<Alldoctor />} />

          {/* Protected Patient Routes */}
          {token && role === "patient" && (
            <>
              {/* With MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/feedback" element={<Feedback />} />
               
                <Route path="/my_appointment" element={<MyAppointment />} />
                <Route path="/appointment-history" element={<AppointmentHistory />} />
              </Route>

              {/* Without MainLayout */}
              <Route path="/patient/home" element={<Home />} />
              <Route path="/doctors/:speciality" element={<DoctorBySpeciality />} />
              <Route path="/appointment-booking" element={<AppointmentBooking />} />
            </>
          )}

          {/* Protected Doctor Routes */}
          {token && role === "doctor" && (
            <>
              <Route path="/doctor" element={<DDashboard />} />
              <Route
                path="/doctor/visit-record"
                element={
                  <VisitForm
                    patientId="dummyPatientId"
                    appointmentId="dummyAppointmentId"
                    patientName="John Doe"
                  />
                }
              />
              <Route path="/doctor/availability" element={<AvailabilityManager />} />
            </>
          )}

          {/* Protected Admin Routes */}
          {token && role === "admin" && (
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="reports" element={<Reports />} />
              <Route path="add-doctor" index element={<AddDoctor />} />
              <Route path="doctors-list" element={<DoctorList />} />
            </Route>
          )}

          {/* Fallback */}
          <Route
            path="*"
            element={
              <p className="text-center mt-10 text-xl text-red-600">404 Page Not Found</p>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
