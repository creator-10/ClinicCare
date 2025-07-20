import React from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/Header';
import PatientSidebar from '../../components/PatientSideBar';

const Patient_webpage = () => {
  const { patientId } = useSelector((state) => state.auth);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar: visible only if patient is logged in */}
      {patientId && (
        <div className="w-64 hidden md:block border-r shadow-sm">
          <PatientSidebar /> 
        </div>
      )}

      {/* Main content */}
      <div className="flex-1">
        <Header />
        {/* Add any other main homepage content below if needed */}
      </div>
    </div>
  );
};

export default Patient_webpage;
