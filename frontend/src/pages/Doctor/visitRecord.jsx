import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VisitForm = () => {
  const [appointmentId, setAppointmentId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [doctor, setDoctor] = useState('');
  const [medications, setMedications] = useState([{ name: '', dosage: '', duration: '' }]);
  const [loading, setLoading] = useState(false);
  const [recentVisits, setRecentVisits] = useState([]);

  // Fetch recent visits on mount and after submit
  const fetchRecentVisits = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/visit/recent`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
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
      await axios.post(
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      alert('Visit record submitted!');
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
    } catch (err) {
      alert('Failed to submit visit record');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-blue-100">
      <h2 className="text-4xl font-extrabold mb-8 text-blue-700 text-center tracking-tight">Patient Visit Record</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block font-medium text-gray-700">
            <span className="mb-1 block">Appointment ID</span>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              required
            />
          </label>
          <label className="block font-medium text-gray-700">
            <span className="mb-1 block">Patient ID</span>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            />
          </label>
          <label className="block font-medium text-gray-700 md:col-span-2">
            <span className="mb-1 block">Patient Name</span>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <label className="block font-medium text-gray-700">
            <span className="mb-1 block">Date of Visit</span>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
          <label className="block font-medium text-gray-700">
            <span className="mb-1 block">Age</span>
            <input
              type="number"
              min="0"
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </label>
          <label className="block font-medium text-gray-700">
            <span className="mb-1 block">Gender</span>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block font-medium text-gray-700">
            <span className="mb-1 block">Symptoms / Chief Complaints</span>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
          </label>
          <label className="block font-medium text-gray-700">
            <span className="mb-1 block">Diagnosis</span>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              rows={3}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
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
                className="flex-1 border border-gray-300 rounded-lg p-2"
                placeholder="Medicine Name"
                value={med.name}
                onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                required
              />
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg p-2"
                placeholder="Dosage"
                value={med.dosage}
                onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                required
              />
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg p-2"
                placeholder="Duration"
                value={med.duration}
                onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
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

        <label className="block font-medium text-gray-700">
          <span className="mb-1 block">Advice / Notes</span>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            rows={2}
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
          />
        </label>

        <label className="block font-medium text-gray-700">
          <span className="mb-1 block">Doctor's Name / Signature</span>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition font-bold text-lg shadow-md"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Visit Record'}
        </button>
      </form>

      {/* Recent Visits Table */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-4 text-blue-700">Recent Visit Records</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
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
                recentVisits.map((visit) => (
                  <tr key={visit.id || visit._id} className="hover:bg-blue-50">
                    <td className="py-2 px-3 border-b">{visit.date}</td>
                    <td className="py-2 px-3 border-b">{visit.appointmentId}</td>
                    <td className="py-2 px-3 border-b">{visit.patientName}</td>
                    <td className="py-2 px-3 border-b">{visit.diagnosis}</td>
                    <td className="py-2 px-3 border-b">{visit.doctor}</td>
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
  );
};

export default VisitForm;