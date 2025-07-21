import React from 'react';
import { useSelector } from 'react-redux';
import PatientSidebar from '../../components/PatientSidebar';
import SpecialityMenu from '../../components/SpecialityMenu';
import Scheduleappointment from '../../components/Scheduleappointment';

const Home = () => {
  const { patientId } = useSelector((state) => state.auth);

  return (
    <div className="flex min-h-screen">
      {/* Show sidebar only if patient is logged in */}
      {/* {patientId && (
        <div className="w-64 hidden md:block border-r">
          <PatientSidebar />
        </div>
      )} */}

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <SpecialityMenu />
        <Scheduleappointment />
      </div>
    </div>
  );
};

export default Home;
