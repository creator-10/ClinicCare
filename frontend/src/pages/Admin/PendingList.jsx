import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';

function AdminPendingDoctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/doctors/pending`)
      .then(res => {
        setDoctors(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setDoctors([]));
  }, []);

  const approveDoctor = id => {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/doctors/${id}/approve`).then(() => {
      setDoctors(doctors.filter(doc => doc._id !== id));
    });
  };

  const rejectDoctor = id => {
    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/doctors/${id}`).then(() => {
      setDoctors(doctors.filter(doc => doc._id !== id));
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">
          Pending Doctors
        </h2>
        <hr className="mb-4" />
        <ul>
          {Array.isArray(doctors) && doctors.length > 0 ? doctors.map(doc => (
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
                  <div className="mt-2">
                    <b>Approved:</b> {doc.approved ? "Yes" : "No"}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-semibold"
                  onClick={() => approveDoctor(doc._id)}
                >
                  Approve
                </button>
                <button
                  className="px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200 transition text-sm font-semibold"
                  onClick={() => rejectDoctor(doc._id)}
                >
                  Reject
                </button>
              </div>
            </li>
          )) : (
            <div className="text-center text-gray-500 py-8">
              No pending doctors.
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
export default AdminPendingDoctors;