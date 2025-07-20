import React from 'react';


import { assets } from '../../assets/assets';

const About = () => {
  

  return (
    <div className="flex min-h-screen">
     
      <div className="flex-1 p-6 ml-0 md:ml-0">
        <div className="text-center text-2xl pt-10 text-gray-500">
          <p>
            ABOUT<span className="text-gray-700 font-medium"> US</span>
          </p>
        </div>

        <div className="my-10 flex flex-col md:flex-row gap-12">
          <img className="w-full md:max-w-[360px]" src={assets.about} alt="About us" />
          <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
            <p>Medico is a modern healthcare platform designed to simplify the way patients connect with trusted medical professionals. Medico makes healthcare more accessible, transparent, and patient-focused.</p>
            <b className="text-gray-800">Our Mission</b>
            <p>What sets Medico apart is its extensive coverage of medical specialities and its commitment to user convenience. Patients can explore a wide range of departments like cardiology, dermatology, pediatrics, orthopedics, and more — each curated with verified doctors and real-time availability. Whether you're booking a routine checkup or a specialist appointment, Medico's intuitive platform offers personalized results and trusted options tailored to your health needs. It's not just a booking tool — it's a complete care connector.</p>
          </div>
        </div>

        <div className="text-xl my-4">
          <p>WHY <span className="text-gray-700 font-semibold">CHOOSE US</span></p>
        </div>
        <div className="flex flex-col md:flex-row mb-20">
          {["Effectiveness", "Accessibility", "Health aide"].map((title, i) => (
            <div key={title} className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
              <b>{title}</b>
              <p>
                {title === "Effectiveness" && "Medico streamlines the healthcare journey with fast, reliable appointment booking. Trusted by patients and doctors alike, it delivers care when and where it’s needed."}
                {title === "Accessibility" && "Medico makes quality healthcare accessible to everyone, anytime, anywhere. From your phone to your doorstep, care is just a tap away."}
                {title === "Health aide" && "Medico’s dedicated health aides are here to assist you every step of the way. From routine checkups to ongoing care, we ensure comfort and compassion."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
