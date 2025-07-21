import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../../assets/assets';
import PatientSidebar from '../../components/PatientSidebar';

const DoctorBySpeciality = () => {
  const { speciality } = useParams();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/doctors/list`)
      .then((res) => {
        const allDoctors = Array.isArray(res.data) ? res.data : res.data.data || [];
        const filtered = allDoctors.filter(
          (doc) =>
            (doc.specialization || '').trim().toLowerCase() ===
            (speciality || '').trim().toLowerCase()
        );
        setDoctors(filtered);
      })
      .catch(() => setDoctors([]));
  }, [speciality]);

  // Helper to extract first letter after "Dr."
  const getFirstLetter = (name = '') => {
    if (!name) return '?';
    const parts = name.split('.');
    if (parts.length > 1 && parts[0].toLowerCase().includes('dr')) {
      const afterDr = parts[1].trim();
      return afterDr.charAt(0).toUpperCase();
    }
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <PatientSidebar />

      {/* Main Content */}
      <main
        className="flex-1 relative p-6"
        style={{
          backgroundImage: `url(${assets.alldoctors})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="relative flex items-center justify-between mb-10 px-4">
            <Link to="/" className="z-10">
              <img
                src={assets.Home}
                alt="Home"
                className="w-[60px] h-[60px] object-contain cursor-pointer transform transition-transform duration-300 hover:scale-110"
              />
            </Link>

            <h2 className="absolute left-1/2 transform -translate-x-1/2 text-5l font-black text-white tracking-tight uppercase text-center z-0">
              {speciality} Specialists
            </h2>

            <Link to="/appointment-booking" className="z-10">
              <img
                src={assets.booknow}
                alt="Book Now"
                className="w-[55px] h-[55px] object-contain cursor-pointer transform transition-transform duration-300 hover:scale-110"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {doctors.length === 0 ? (
              <div className="col-span-full text-center text-white text-lg">
                No doctors found for <strong className="capitalize">{speciality}</strong>.
              </div>
            ) : (
              doctors.map((doc) => {
                const username = doc.userId?.username || doc.userId?.name || 'Unknown';
                const firstLetter = getFirstLetter(username);

                return (
                  <div
                    key={doc._id}
                    className="bg-white w-full max-w-[350px] mx-auto rounded-xl shadow-md border border-blue-100 p-4 flex flex-col items-center"
                  >
                    {/* Circle with First Letter */}
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
                      <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-semibold">
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

export default DoctorBySpeciality;
