import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Scheduleappointment = () => {
  const navigate = useNavigate();

  const handleBookNowClick = () => {
    // Optional login logic (uncomment to enable auth-based routing):
    // const token = localStorage.getItem('token');
    // if (token) {
    //   navigate('/appointment-booking');
    // } else {
    //   localStorage.setItem('redirectAfterLogin', '/appointment-booking');
    //   navigate('/login');
    // }

    // For now, just navigate directly:
    navigate('/appointment-booking');
  };

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium text-center">Schedule Your Appointment Here</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Your health, your schedule. Book effortlessly with Medico.
      </p>

      <div className="bg-primary rounded-lg px-6 md:px-10 lg:px-20 py-10 w-full flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          <div className="text-white flex-1 mb-6 md:mb-0 md:pr-10">
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
              Book Your Appointment <br /> with Top Doctors Today
            </h2>
            <p className="mt-4 text-lg font-light">
              Click the "Book Now" to secure your appointment.
            </p>
          </div>

          <div className="flex-1 flex justify-center">
            <img
              src={assets.appointment}
              alt="Appointment"
              className="w-[700px] h-auto object-cover rounded-3xl"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleBookNowClick}
            className="bg-white text-blue-800 px-12 py-3 rounded-full hover:bg-white transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scheduleappointment;
