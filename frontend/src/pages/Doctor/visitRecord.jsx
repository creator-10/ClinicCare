import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../components/SideBar';
import { toast, ToastContainer } from 'react-toastify';           
import 'react-toastify/dist/ReactToastify.css';                   

const VisitForm = () => {
  const [appointmentId, setAppointmentId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [doctor, setDoctor] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [medications, setMedications] = useState([{ name: '', dosage: '', duration: '' }]);
  const [loading, setLoading] = useState(false);
  const [recentVisits, setRecentVisits] = useState([]);
  const [doctorEmailToName, setDoctorEmailToName] = useState({});
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Fetch appointments for this doctor
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setAppointments(res.data.data || []);
      })
      .catch(() => setAppointments([]));
  }, [token]);

  // When appointmentId changes, auto-fill patient fields
  useEffect(() => {
    if (!appointmentId) {
      setPatientId('');
      setPatientName('');
      setDate('');
      setAge('');
      setGender('');
      return;
    }
    const appt = appointments.find(a => String(a.appointmentId) === String(appointmentId));
    if (appt) {
      setPatientId(appt.patientId || '');
      setPatientName(appt.fullName || '');
      setDate(appt.bookingDate ? appt.bookingDate.split('T')[0] : '');
      setAge(appt.age ? String(appt.age) : '');
      setGender(appt.gender || '');
    }
  }, [appointmentId, appointments]);

  // Fetch approved doctors for dropdown and build email-to-name map
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/doctors/list`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const docs = Array.isArray(res.data) ? res.data : [];
        setDoctors(docs);
        const map = {};
        docs.forEach(doc => {
          map[doc.email] = (doc.userId?.username || doc.userId?.name || doc.email) +
            (doc.specialization ? ` (${doc.specialization})` : '');
        });
        setDoctorEmailToName(map);
      })
      .catch(() => {
        setDoctors([]);
        setDoctorEmailToName({});
      });
  }, [token]);

  // Fetch recent visits on mount and after submit
  const fetchRecentVisits = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/visit/recent`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setRecentVisits(res.data.data || []);
    } catch (err) {
      setRecentVisits([]);
    }
  };

  useEffect(() => {
    fetchRecentVisits();
  }, []);

  const handleMedicationChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', duration: '' }]);
  };

  const removeMedication = (index) => {
    const updated = medications.filter((_, i) => i !== index);
    setMedications(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/visit`,
        {
          appointmentId,
          patientId,
          patientName,
          date,
          age,
          gender,
          symptoms,
          diagnosis,
          medications,
          advice,
          doctor,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      
      toast.success(`Medical prescription sent to the patient ID: ${patientId} (Name: ${patientName}) `);

      setAppointmentId('');
      setPatientId('');
      setPatientName('');
      setDate('');
      setAge('');
      setGender('');
      setSymptoms('');
      setDiagnosis('');
      setAdvice('');
      setDoctor('');
      setMedications([{ name: '', dosage: '', duration: '' }]);
      fetchRecentVisits();

      const visitId = res.data?.data?._id;
      if (visitId) {
        navigate(`/doctor/visit-record`);
      }
    } catch (err) {
      alert('Failed to submit visit record');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          <div className="max-w-3xl mx-auto bg-white/90 p-8 shadow-2xl rounded-2xl mt-10 border border-blue-500">
            <h2 className="text-3xl font-extrabold text-sky-600 mb-1 text-center drop-shadow">
              Patient Visit Record
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Appointment ID Dropdown */}
                <label className="block font-medium text-blue-700">
                  <span className="mb-1 block">Appointment ID</span>
                  <select
                    className="w-full border border-blue-300 rounded-lg p-2 mt-1 bg-blue-50 text-blue-900 focus:outline-blue-400"
                    value={appointmentId}
                    onChange={e => setAppointmentId(e.target.value)}
                    required
                  >
                    <option value="">Select Appointment</option>
                    {appointments.map(appt => (
                      <option key={appt.appointmentId} value={appt.appointmentId}>
                        {appt.appointmentId} - {appt.fullName} ({appt.bookingDate ? appt.bookingDate.split('T')[0] : ''})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block font-medium text-blue-700">
                  <span className="mb-1 block">Patient ID</span>
                  <input
                    type="text"
                    className="w-full border border-blue-300 rounded-lg p-2 mt-1 bg-blue-50 text-blue-900 focus:outline-blue-400"
                    value={patientId}
                    readOnly
                    required
                  />
                </label>
                <label className="block font-medium text-blue-700 md:col-span-2">
                  <span className="mb-1 block">Patient Name</span>
                  <input
                    type="text"
                    className="w-full border border-blue-300 rounded-lg p-2 mt-1 bg-blue-50 text-blue-900 focus:outline-blue-400"
                    value={patientName}
                    readOnly
                    required
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="block font-medium text-blue-700">
                  <span className="mb-1 block">Date of Visit</span>
                  <input
                    type="date"
                    className="w-full border border-blue-300 rounded-lg p-2 mt-1 bg-blue-50 text-blue-900 focus:outline-blue-400"
                    value={date}
                    readOnly
                    required
                  />
                </label>
                <label className="block font-medium text-blue-700">
                  <span className="mb-1 block">Age</span>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-blue-300 rounded-lg p-2 mt-1 bg-blue-50 text-blue-900 focus:outline-blue-400"
                    value={age}
                    readOnly
                    required
                  />
                </label>
                <label className="block font-medium text-blue-700">
                  <span className="mb-1 block">Gender</span>
                  <input
                    className="w-full border border-blue-300 rounded-lg p-2 mt-1 bg-blue-50 text-blue-900 focus:outline-blue-400"
                    value={gender}
                    readOnly
                    required
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block font-medium text-blue-700">
                  <span className="mb-1 block">Symptoms / Chief Complaints</span>
                  <textarea
                    className="w-full border border-blue-300 rounded-lg p-2 mt-1 bg-blue-50 text-blue-900 focus:outline-blue-400"
                    rows={3}
                    value={symptoms}
                    onChange={e => setSymptoms(e.target.value)}
                    required
                  />
                </label>
                <label className="block font-medium text-blue-700">
                  <span className="mb-1 block">Diagnosis</span>
                  <textarea
                    className="w-full border border-blue-300 rounded-lg p-2 mt-1 bg-blue-50 text-blue-900 focus:outline-blue-400"
                    rows={3}
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div>
                <div className="font-semibold text-lg text-blue-700 mb-2">Medications / Prescriptions</div>
                {medications.map((med, index) => (
                  <div className="flex flex-col md:flex-row gap-2 mb-2 items-center" key={index}>
                    <input
                      type="text"
                      className="flex-1 border border-blue-300 rounded-lg p-2 bg-blue-50 text-blue-900 focus:outline-blue-400"
                      placeholder="Medicine Name"
                      value={med.name}
                      onChange={e => handleMedicationChange(index, 'name', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="flex-1 border border-blue-300 rounded-lg p-2 bg-blue-50 text-blue-900 focus:outline-blue-400"
                      placeholder="Dosage"
                      value={med.dosage}
                      onChange={e => handleMedicationChange(index, 'dosage', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="flex-1 border border-blue-300 rounded-lg p-2 bg-blue-50 text-blue-900 focus:outline-blue-400"
                      placeholder="Duration"
                      value={med.duration}
                      onChange={e => handleMedicationChange(index, 'duration', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className={`ml-2 px-2 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition ${medications.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => removeMedication(index)}
                      disabled={medications.length === 1}
                      title="Remove"
                    >
                      &#10005;
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-2 mb-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-semibold"
                  onClick={addMedication}
                >
                  + Add Medication
                </button>
              </div>

              <label className="block font-medium text-blue-700">
                <span className="mb-1 block">Advice / Notes</span>
                <textarea
                  className="w-full border border-blue-300 rounded-lg p-2 mt-1 bg-blue-50 text-blue-900 focus:outline-blue-400"
                  rows={2}
                  value={advice}
                  onChange={e => setAdvice(e.target.value)}
                />
              </label>

              {/* Doctor Dropdown */}
              <label className="block font-medium text-blue-700">
                <span className="mb-1 block">Doctor</span>
                <select
                  className="w-full border border-blue-300 rounded-lg p-2 mt-1 bg-blue-50 text-blue-900 focus:outline-blue-400"
                  value={doctor}
                  onChange={e => setDoctor(e.target.value)}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc.email}>
                      {(doc.userId?.username || doc.userId?.name || doc.email)}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow hover:from-blue-700 hover:to-blue-600 transition text-lg"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Visit Record'}
              </button>
            </form>

            {/* Recent Visits Table */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-4 text-blue-700">Recent Visit Records</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-blue-200 rounded-lg shadow">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="py-2 px-3 border-b text-left">Date</th>
                      <th className="py-2 px-3 border-b text-left">Appointment ID</th>
                      <th className="py-2 px-3 border-b text-left">Patient Name</th>
                      <th className="py-2 px-3 border-b text-left">Diagnosis</th>
                      <th className="py-2 px-3 border-b text-left">Doctor</th>
                      <th className="py-2 px-3 border-b text-left">Medications</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentVisits.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-gray-500">
                          No recent visit records.
                        </td>
                      </tr>
                    ) : (
                      recentVisits.map(visit => (
                        <tr key={visit._id} className="hover:bg-blue-50">
                          <td className="py-2 px-3 border-b">{visit.date}</td>
                          <td className="py-2 px-3 border-b">{visit.appointmentId}</td>
                          <td className="py-2 px-3 border-b">{visit.patientName}</td>
                          <td className="py-2 px-3 border-b">{visit.diagnosis}</td>
                          <td className="py-2 px-3 border-b">
                            {doctorEmailToName[visit.doctor] || visit.doctor}
                          </td>
                          <td className="py-2 px-3 border-b">
                            {visit.medications && visit.medications.length > 0
                              ? visit.medications.map((m, idx) => (
                                  <div key={idx}>
                                    <span className="font-semibold">{m.name}</span> ({m.dosage}, {m.duration})
                                  </div>
                                ))
                              : <span className="text-gray-400">-</span>
                            }
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toastify container */}
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar closeOnClick pauseOnHover draggable />
    </div>
  );
};

export default VisitForm;
