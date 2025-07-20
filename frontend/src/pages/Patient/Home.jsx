import React from 'react';

import SpecialityMenu from '../../components/SpecialityMenu';
import Scheduleappointment from '../../components/Scheduleappointment';

const Home = () => {
 

  return (
    <div className="flex min-h-screen">
     

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <SpecialityMenu />
        <Scheduleappointment />
      </div>
    </div>
  );
};

export default Home;
