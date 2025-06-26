import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import VisitForm from './visitRecord';

const menuItems = [
  { text: 'Visit Record', path: '/doctor/visit-record' },
  // Add more items here if needed
];

const DoctorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <span className="text-xl font-bold text-blue-600">Doctor Panel</span>
        </div>
        <nav className="flex-1 py-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.text}>
                <button
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors rounded-r-full text-gray-700 font-medium"
                >
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6">
        <Routes>
          <Route
            path="visit-record"
            element={
              <VisitForm
                patientId="dummyPatientId"
                appointmentId="dummyAppointmentId"
                patientName="John Doe"
              />
            }
          />
          {/* Add more Route components for other sidebar items if needed */}
          <Route
            index
            element={
              <h2 className="text-2xl font-semibold text-blue-700">
                Welcome to the Doctor Dashboard
              </h2>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default DoctorDashboard;