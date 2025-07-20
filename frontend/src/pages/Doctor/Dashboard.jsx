import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VisitForm from './visitRecord';
import AvailabilityManager from './AvailabilityManager';
import SideBar from '../../components/SideBar';

const bgUrl =
"https://i.pinimg.com/736x/da/e0/2f/dae02f1f49bdc368faa3333ca40eae7d.jpg";

const DoctorDashboard = () => {
return (
  <div
    className="flex min-h-screen bg-cover bg-center"
    style={{
      backgroundImage: `url('${bgUrl}')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <SideBar />
    <main className="flex-1 flex flex-col bg-white/80 p-0">
      <Routes>
        <Route path="visit-record" element={<VisitForm />} />
        <Route path="availability" element={<AvailabilityManager />} />
        <Route
          index
          element={
            <div className="flex flex-1 w-full h-full items-center justify-center">
              <div className="w-full max-w-3xl flex flex-col gap-6 px-6 py-10 md:py-16 md:px-12 bg-white/90 rounded-xl shadow-lg">
                <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 drop-shadow mb-2">
                  Welcome to the Doctor Dashboard
                </h2>
                <p className="text-base md:text-lg text-blue-800 mb-2">
                  Manage your appointments, update your availability, and keep track of your patient visits all in one place. Thank you for your dedication to patient care!
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-blue-700 font-medium">
                  <li className="flex flex-col items-center bg-blue-50 rounded-lg p-4 shadow hover:shadow-md transition">
                    <span className="inline-block w-4 h-4 bg-blue-400 rounded-full mb-2"></span>
                    <span className="text-center">View and record<br />patient visits</span>
                  </li>
                  <li className="flex flex-col items-center bg-blue-50 rounded-lg p-4 shadow hover:shadow-md transition">
                    <span className="inline-block w-4 h-4 bg-blue-400 rounded-full mb-2"></span>
                    <span className="text-center">Set your<br />availability slots</span>
                  </li>
                  <li className="flex flex-col items-center bg-blue-50 rounded-lg p-4 shadow hover:shadow-md transition">
                    <span className="inline-block w-4 h-4 bg-blue-400 rounded-full mb-2"></span>
                    <span className="text-center">See your<br />upcoming appointments</span>
                  </li>
                </ul>
              </div>
            </div>
          }
        />
      </Routes>
    </main>
  </div>
);
};

export default DoctorDashboard;