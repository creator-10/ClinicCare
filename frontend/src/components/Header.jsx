import React from 'react';
import { assets } from '../assets/assets.js';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${assets.backgroundimage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
      }}
    >
      <div className="flex flex-col md:flex-row bg-primary rounded-lg px-6 md:px-10 lg:px-20 py-10 backdrop-blur-sm bg-opacity-80">
        {/* ----- Left side ------ */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center gap-4">
          <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight">
            Book Appointment <br /> with trusted healthcare professionals
          </p>
          <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
            <img src={assets.group_profiles} alt="Group profiles" className="w-28" />
            <p>
              Browse trusted doctors list, <br className="hidden sm:block" /> schedule your appointment in just a few clicks.
            </p>
          </div>
          <Link
            to="/login"
            className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:bg-gray-100 hover:text-blue-700 transition-all duration-300 shadow-md"
          >
            Book appointment now
            <img src={assets.arrow_icon} alt="Arrow icon" className="w-6 h-6" />
          </Link>
        </div>

        {/* ----- Right side image ------ */}
        <div className="w-full md:w-1/2 flex items-end justify-end">
          <img
            src={assets.header_img}
            alt="Doctor and patient consulting visual"
            className="w-full h-full object-cover rounded-lg mr-2 md:-mb-9"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
