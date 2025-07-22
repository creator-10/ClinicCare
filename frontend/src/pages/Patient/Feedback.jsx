import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import axios from 'axios';
import { assets } from "../../assets/assets"; // ✅ Correct image import

const Feedback = () => {
  const { patientId } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [services, setService] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const validateEmail = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!name.trim()) { setNameError(true); hasError = true; } else setNameError(false);
    if (!email.trim() || !validateEmail(email)) { setEmailError(true); hasError = true; } else setEmailError(false);
    if (hasError) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/feedback`,
        { name, email, services, suggestion }
      );
      if (res.data?.success) {
        setSuccessMsg("Thank you for your feedback!");
        setName(""); setEmail(""); setService(""); setSuggestion("");
      } else {
        setErrorMsg(res.data?.message || "Something went wrong.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Could not submit feedback.");
    }
  };

  return (
    <div
      className="flex min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${assets.feedback1})` }} 
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

      {/* {patientId && (
        <div className="w-64 hidden md:block border-r relative z-10">
          <PatientSidebar />
        </div>
      )} */}
<h2 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-black text-white uppercase z-0">
              Feedback
            </h2>
      <div className="flex-1 p-6 flex items-center justify-center relative z-10">
        <form
          className="flex flex-col gap-3 p-8 bg-white/90 backdrop-blur-md border rounded-xl text-zinc-700 text-sm shadow-2xl w-full max-w-md"
          onSubmit={onSubmitHandler}
        >
          {successMsg && (
            <div className="w-full text-green-700 bg-green-100 border border-green-200 rounded p-2 text-center mb-2">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="w-full text-red-700 bg-red-100 border border-red-200 rounded p-2 text-center mb-2">
              {errorMsg}
            </div>
          )}

          {/* Full Name */}
          <div className="w-full">
            <p>Full Name*</p>
            <input
              className={`border rounded w-full p-2 mt-1 ${nameError ? "border-red-500" : "border-zinc-300"}`}
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); if (nameError) setNameError(false); }}
              required
            />
            {nameError && <p className="text-red-600 text-xs mt-1">Full Name is required</p>}
          </div>

          {/* Email */}
          <div className="w-full">
            <p>Email Address*</p>
            <input
              className={`border rounded w-full p-2 mt-1 ${emailError ? "border-red-500" : "border-zinc-300"}`}
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(false); }}
              required
            />
            {emailError && <p className="text-red-600 text-xs mt-1">Please enter a valid email address</p>}
          </div>

          {/* Services Feedback */}
          <div className="w-full">
            <p>Share your thoughts on our services</p>
            <textarea
              className="border rounded w-full p-2 mt-1 min-h-[80px]"
              value={services}
              onChange={(e) => setService(e.target.value)}
            />
          </div>

          {/* Suggestions */}
          <div className="w-full">
            <p>Any feedback to improve our service?</p>
            <textarea
              className="border rounded w-full p-2 mt-1 min-h-[80px]"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button className="bg-blue-600 text-white w-full py-2 mt-4 rounded hover:bg-blue-700 transition">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
