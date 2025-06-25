import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';

const SPECIALIZATIONS = [
  "Dermatology",
  "Radiology",
  "Orthopedics",
  "Peadiatrics",
  "General Physician",
  "Cardiology"
];

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState('All');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/doctors/list`)
      .then((res) => {
        setDoctors(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setDoctors([]));
  }, []);

  const filteredDoctors =
    specialization === 'All'
      ? doctors
      : doctors.filter((doc) => doc.specialization === specialization);

  return (
    <div className="max-w-6xl mx-auto mt-12">
      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-blue-100">
        <h2 className="text-4xl font-extrabold text-blue-700 text-center mb-8 tracking-tight">
          Approved Doctors
        </h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="w-full md:w-80">
            <label className="block font-semibold text-gray-700 mb-2">
              Filter by Specialization
            </label>
            <select
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-blue-400 bg-gray-50 text-base"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >
              <option value="All">All</option>
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
          <table className="min-w-full bg-white divide-y divide-blue-100">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                <th className="py-4 px-6 text-left font-bold text-blue-700">#</th>
                <th className="py-4 px-6 text-left font-bold text-blue-700">Doctor</th>
                <th className="py-4 px-6 text-left font-bold text-blue-700">Specialization</th>
                <th className="py-4 px-6 text-left font-bold text-blue-700">Experience</th>
                <th className="py-4 px-6 text-left font-bold text-blue-700">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc, idx) => (
                  <tr
                    key={doc._id}
                    className="hover:bg-blue-50 transition group"
                  >
                    <td className="py-4 px-6 text-gray-700 font-medium">{idx + 1}</td>
                    <td className="py-4 px-6 flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-blue-100 text-blue-700 border border-blue-200 shadow-sm group-hover:scale-105 transition">
                        <PersonIcon fontSize="medium" />
                      </span>
                      <span className="font-semibold text-blue-900 text-lg">
                        {doc.userId?.username || doc.userId?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium">
                        {doc.specialization}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200 text-sm font-semibold">
                        {doc.experience} years
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2 py-1 rounded bg-gray-50 text-gray-700 border border-gray-200 text-sm">
                        {doc.email}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 text-lg font-semibold">
                    No approved doctors.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default DoctorList;