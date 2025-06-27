import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    specialist: "",
    reason: "",
    slot: "",
  });

  const [age, setAge] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookingDate, setBookingDate] = useState("");

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      years--;
    }
    return years;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dob") {
      const calculatedAge = calculateAge(value);
      setAge(calculatedAge);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlotSelect = (slot) => {
    setFormData((prev) => ({ ...prev, slot }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment Data:", {
      ...formData,
      age: `${age} years`,
      bookingDate,
    });
  };

  const getToday = () => new Date().toISOString().split("T")[0];
  const getMaxDate = () => {
    const max = new Date();
    max.setDate(max.getDate() + 30);
    return max.toISOString().split("T")[0];
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-[90vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg w-full max-w-md">

        {/* Full Name */}
        <div className="w-full">
          <p>Full Name*</p>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="border border-zinc-300 rounded w-full p-2 mt-1"
          />
        </div>

        {/* Email */}
        <div className="w-full">
          <p>Email*</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-zinc-300 rounded w-full p-2 mt-1"
          />
        </div>

        {/* Phone Number */}
        <div className="w-full">
          <p>Phone Number*</p>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border border-zinc-300 rounded w-full p-2 mt-1"
          />
        </div>

        {/* Date of Birth */}
        <div className="w-full">
          <p>Date of Birth*</p>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            max={getToday()}
            className="border border-zinc-300 rounded w-full p-2 mt-1"
          />
          {age !== null && (
            <p className="text-green-600 text-sm mt-1">Age: {age} years old</p>
          )}
        </div>

        {/* Specialist Dropdown */}
        <div className="w-full">
          <p>Select Your Specialist*</p>
          <select
            name="specialist"
            value={formData.specialist}
            onChange={handleChange}
            required
            className="border border-zinc-300 rounded w-full p-2 mt-1"
          >
            <option value="">-- Select Specialist --</option>
            <option value="General Physician">General Physician</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Radiology">Radiology</option>
            <option value="Dermatology">Dermatology</option>
          </select>
        </div>

        {/* Reason */}
        <div className="w-full">
          <p>Mention your reason for the appointment</p>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="border border-zinc-300 rounded w-full p-2 mt-1 min-h-[80px]"
          />
        </div>

        {/* Show Available Doctors */}
        <button
          type="button"
          className="bg-blue-500 text-white w-full py-2 mt-4 rounded hover:bg-blue-600 transition"
          
        >
          Show Available Doctors
        </button>

        {/* Booking Date Picker (after clicking show doctors) */}
        
          <div className="w-full">
            <p>Select Booking Date*</p>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={getToday()}
              max={getMaxDate()}
              required
              className="border border-zinc-300 rounded w-full p-2 mt-1"
            />
          </div>
       

        {/* Time Slot (only when booking date is selected) */}
        {bookingDate && (
          <div className="w-full mt-3">
            <p>Select a Time Slot:</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["9am to 12pm", "1pm to 4pm", "6pm to 9pm"].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleSlotSelect(slot)}
                  className={`px-4 py-2 rounded-full border ${
                    formData.slot === slot
                      ? "bg-blue-600 text-white"
                      : "bg-white text-black border-blue-300"
                  } hover:bg-blue-500 hover:text-white transition`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 mt-6 rounded hover:bg-green-700 transition"
        >
          Submit Appointment
        </button>
      </div>
    </form>
  );
};

export default AppointmentBooking;
