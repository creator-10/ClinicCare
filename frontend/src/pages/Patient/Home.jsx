import React from 'react';
import { useSelector } from 'react-redux';
import PatientSidebar from '../../components/PatientSidebar';
import SpecialityMenu from '../../components/SpecialityMenu';
import Scheduleappointment from '../../components/Scheduleappointment';

const Home = () => {
  const { patientId } = useSelector((state) => state.auth);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Left side */}
      {patientId && (
        <div className="hidden md:block w-64">
          <PatientSidebar />
        </div>
      )}

      {/* Main content - Right side */}
      <div className="flex-1 p-4 md:p-
        {/* On mobile, show sidebar in overlay inside PatientSidebar component */}
        <div className="md:hidden">
          <PatientSidebar />
        </div>

        <SpecialityMenu />
        <Scheduleappointment />
      </div>
    </div>
  );
};

export default Home;
