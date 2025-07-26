import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useSelector } from 'react-redux';

const Alldoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/doctors/list`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const docs = Array.isArray(response.data) ? response.data : [];
        setDoctors(docs);
      } catch (err) {
        if (err.response?.status === 401) {
          console.warn('Unauthenticated access to doctor list');
        } else {
          console.error('Error fetching doctors list:', {
            status: err.response?.status,
            message: err.response?.data?.message || err.message,
            error: err,
          });
        }
      }
    };

    fetchDoctors();
  }, [token]);

  const getFirstLetter = (name = '') => {
    const parts = name.split('.');
    if (parts.length > 1 && parts[0].toLowerCase().includes('dr')) {
      return parts[1].trim().charAt(0).toUpperCase();
    }
    return name.trim().charAt(0).toUpperCase() || '?';
  };

  return (
    <div className="flex min-h-screen">
      <main
        className="flex-1 relative p-6"
        style={{
          backgroundImage: `url(${assets.alldoctors})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="relative flex items-center justify-between mb-10 px-4">
            {token && (
              <Link to="/" className="z-10">
                <img
                  src={assets.Home}
                  alt="Home"
                  className="w-[60px] h-[60px] cursor-pointer hover:scale-110 transition-transform"
                />
              </Link>
            )}
            <h2 className="absolute left-1/2 transform -translate-x-1/2 text-5l font-black text-white uppercase z-0">
              Our Doctors
            </h2>
            {token && (
              <Link to="/appointment-booking" className="z-10">
                <img
                  src={assets.booknow}
                  alt="Book Now"
                  className="w-[55px] h-[55px] cursor-pointer hover:scale-110 transition-transform"
                />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.length === 0 ? (
              <div className="col-span-full text-center text-white text-lg">
                No doctors found.
              </div>
            ) : (
              doctors.map(doc => {
                const username = doc.userId?.username || 'Unknown';
                const firstLetter = getFirstLetter(username);
                return (
                  <div
                    key={doc._id}
                    className="bg-white max-w-[350px] mx-auto rounded-xl shadow-md p-4 flex flex-col items-center"
                  >
                    <div className="w-[100px] h-[100px] rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold mb-3">
                      {firstLetter}
                    </div>
                    <div className="text-lg font-semibold text-blue-900 mb-1 text-center">
                      {username}
                    </div>
                    <div className="text-gray-700 mb-1 text-center text-sm">
                      <b>Specialization:</b> {doc.specialization || 'N/A'}
                    </div>
                    <div className="text-gray-700 mb-1 text-center text-sm">
                      <b>Experience:</b> {doc.experience} years
                    </div>
                    <div className="text-gray-700 mb-1 text-center text-sm">
                      <b>Email:</b> {doc.userId?.email || 'N/A'}
                    </div>
                    <div className="mt-2">
                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border text-xs font-semibold">
                        Approved
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Alldoctor;
