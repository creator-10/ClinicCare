import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import { useSelector } from 'react-redux';

function AddDoctor() {
  const [doctors, setDoctors] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/doctors/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDoctors(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch doctors:", err.response?.data || err.message);
        setDoctors([]);
      });
  }, [token]);

  const approveDoctor = (id) => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/doctors/${id}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setDoctors((prev) => prev.filter((doc) => doc._id !== id));
      })
      .catch((err) => {
        console.error("Failed to approve doctor:", err.response?.data || err.message);
      });
  };

  const rejectDoctor = (id) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/doctors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setDoctors((prev) => prev.filter((doc) => doc._id !== id));
      })
      .catch((err) => {
        console.error("Failed to reject doctor:", err.response?.data || err.message);
      });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
        <h2 className="text-3xl font-extrabold text-blue-700 text-center mb-6">
          Pending Doctor Approvals
        </h2>
        <hr className="mb-6 border-blue-200" />
        <ul>
          {Array.isArray(doctors) && doctors.length > 0 ? (
            doctors.map((doc) => (
              <li
                key={doc._id}
                className="flex items-start gap-6 bg-blue-50/60 rounded-2xl p-6 mb-6 shadow-sm border border-blue-100"
              >
                <div className="mt-1">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-700 shadow-sm">
                    <PersonIcon fontSize="large" />
                  </span>
                </div>
                <div className="flex-1 text-blue-900">
                  <div className="font-bold text-xl mb-1">
                    {doc.userId?.username || doc.userId?.name || 'Unknown'}
                  </div>
                  <div className="space-y-1 text-sm leading-relaxed">
                    <div><span className="font-semibold">Specialization:</span> {doc.specialization}</div>
                    <div><span className="font-semibold">Experience:</span> {doc.experience} years</div>
                    <div><span className="font-semibold">Email:</span> {doc.userId?.email}</div>
                    <div><span className="font-semibold">Clinic Address:</span> {doc.userId?.address?.line1 || "N/A"}</div>
                    <div className="pt-1"><span className="font-semibold">Approved:</span> {doc.approved ? "Yes" : "No"}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => approveDoctor(doc._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectDoctor(doc._id)}
                    className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))
          ) : (
            <div className="text-center text-gray-400 py-10 text-lg font-medium">
              No pending doctors at the moment.
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default AddDoctor;
