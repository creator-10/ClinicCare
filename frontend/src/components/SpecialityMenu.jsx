import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

// Redirect to the doctor list page of the particular speciality
const SpecialityMenu = () => {
  return (
    <div className="relative bg-primary ml-10 mr-10 rounded-lg overflow-hidden">
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-cyan-blue-gradient animate-cyanBlueBg bg-[length:300%_300%] opacity-60 backdrop-blur-sm z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 py-16 text-white" id="speciality">
        <h1 className="text-3xl font-medium">Find by Speciality</h1>
        <p className="sm:w-1/3 text-center text-sm">
          Browse top-rated doctors and schedule your appointment without the hassle.
          Trusted care is just a few clicks away—quick, simple, and secure.
        </p>

        <div className="flex flex-wrap sm:justify-center gap-4 pt-5 w-full">
          {specialityData.map((item, index) => (
            <Link
              onClick={() => scrollTo(0, 0)}
              key={index}
              to={`/doctors/${item.speciality}`}
              state={{ image: item.image }}
              className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500 hover:shadow-md hover:bg-gray-100 hover:text-gray-900 rounded-lg p-3 bg-white bg-opacity-20 backdrop-blur-md"
            >
              <img className="w-16 sm:w-24 mb-2" src={item.image} alt={item.speciality} />
              <p>{item.speciality}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialityMenu;
