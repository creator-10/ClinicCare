import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState('All');
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/doctors/list`)
      .then((res) => {
        const docs = Array.isArray(res.data) ? res.data : [];
        setDoctors(docs);
        const specs = Array.from(
          new Set(docs.map((doc) => doc.specialization).filter(Boolean))
        );
        setSpecializations(specs);
      })
      .catch(() => setDoctors([]));
  }, []);

  const filteredDoctors =
    specialization === 'All'
      ? doctors
      : doctors.filter((doc) => doc.specialization === specialization);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">
          Approved Doctors
        </h2>
        <hr className="mb-4" />
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">
            Specialization
          </label>
          <select
            className="w-full border border-gray-300 rounded p-2 focus:outline-blue-400"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="All">All</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
        <ul>
          {Array.isArray(filteredDoctors) && filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
              <li
                key={doc._id}
                className="flex items-start gap-4 bg-gray-50 rounded-lg p-4 mb-4 shadow-sm"
              >
                <div className="mt-1">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-700">
                    <PersonIcon fontSize="large" />
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg text-blue-800">
                    {doc.userId?.username || doc.userId?.name || 'Unknown'}
                  </div>
                  <div className="text-gray-700 mt-1">
                    <div>
                      <b>Specialization:</b> {doc.specialization}
                    </div>
                    <div>
                      <b>Experience:</b> {doc.experience} years
                    </div>
                    <div>
                      <b>Fees:</b> ₹{doc.fees}
                    </div>
                    <div>
                      <b>Email:</b> {doc.email}
                    </div>
                    <div>
                      <b>Address:</b> {doc.address || <i>Not Provided</i>}
                    </div>
                    <div className="mt-2">
                      <b>Availability Slots:</b>{' '}
                      {doc.availabilitySlots && doc.availabilitySlots.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {doc.availabilitySlots.map((slot, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                            >
                              {slot}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span>Not Provided</span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No approved doctors.
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default DoctorList;