import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../redux/doctorSlice";
import PatientSidebar from "../../components/PatientSideBar";
import { assets } from "../../assets/assets";
import { fetchUserProfile } from "../../redux/slices/profileSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Appointment_booking = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { list: doctors } = useSelector((state) => state.doctors);
  const profile = useSelector((state) => state.profile.userProfile);

  const sidebarRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    if (user?.patientId) dispatch(fetchUserProfile(user.patientId));
  }, [user?.patientId, dispatch]);

  const [formData, setFormData] = useState({
    patientId: "",
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    specialist: "",
    clinic: "",
    doctorName: "",
    reason: "",
    slot: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      patientId: user?.patientId || "",
      fullName: user?.username || "",
      email: user?.email || "",
      gender: user?.gender || "",
      phone: profile?.phone || "",
      dob: profile?.dob?.split("T")[0] || "",
    }));
  }, [user, profile]);

  const [bookingDate, setBookingDate] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [doctorAvailability, setDoctorAvailability] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  const getISTNow = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 5.5 * 60 * 60 * 1000);
  };

  const today = getISTNow().toISOString().split("T")[0];
  const istHour = getISTNow().getHours();

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    const m = now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) years--;
    return years;
  };

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (mainRef.current && sidebarRef.current) {
      sidebarRef.current.style.height = `${mainRef.current.offsetHeight}px`;
    }
  });

  const filteredClinics = [
    ...new Set(
      doctors
        .filter(
          (doc) =>
            doc.specialization.toLowerCase() ===
            formData.specialist.toLowerCase()
        )
        .map((doc) => doc.userId?.address?.line1 || "Unknown Clinic")
    ),
  ];

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.specialization.toLowerCase() === formData.specialist.toLowerCase() &&
      (doc.userId?.address?.line1 || "") === formData.clinic
  );

  useEffect(() => {
    if (!formData.doctorName) return;
    const sel = filteredDoctors.find(
      (doc) =>
        (doc.userId?.username || doc.userId?.name) === formData.doctorName
    );
    if (sel?._id && sel._id !== selectedDoctorId) {
      setSelectedDoctorId(sel._id);
    }
  }, [formData.doctorName, filteredDoctors]);

  useEffect(() => {
    if (!selectedDoctorId) {
      setDoctorAvailability([]);
      setAvailableDates([]);
      return;
    }

    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/doctor/${selectedDoctorId}/availability`
    )
      .then((res) => res.json())
      .then((data) => {
        const dates = Array.from(
          new Set(
            data.availability.map((s) =>
              new Date(s).toISOString().split("T")[0]
            )
          )
        ).filter((date) => date >= today);
        setDoctorAvailability(data.availability || []);
        setAvailableDates(dates);
      })
      .catch(() => {
        setDoctorAvailability([]);
        setAvailableDates([]);
      });
  }, [selectedDoctorId]);

  const getAvailableSlots = () => {
    if (!bookingDate || !doctorAvailability.length) return [];

    const ranges = [
      { label: "9am - 12pm", start: 9, end: 12 },
      { label: "1pm - 4pm", start: 13, end: 16 },
      { label: "6pm - 9pm", start: 18, end: 21 },
    ];

    const slotsForDate = doctorAvailability
      .map((slot) => new Date(slot))
      .filter((slotDate) => slotDate.toISOString().split("T")[0] === bookingDate);

    const slotHours = slotsForDate.map((d) => d.getHours());

    let activeRanges = ranges.filter((range) =>
      slotHours.some((h) => h >= range.start && h < range.end)
    );

    if (bookingDate === today) {
      activeRanges = activeRanges.filter((range) => range.end > istHour);
    }

    return activeRanges.map((r) => r.label);
  };

  const availableSlots = getAvailableSlots();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: digits }));
      }
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "specialist" ? { clinic: "", doctorName: "" } : {}),
      ...(name === "clinic" ? { doctorName: "" } : {}),
    }));
  };

  const handleSlotSelect = (slot) =>
    setFormData((prev) => ({ ...prev, slot }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.dob) {
      toast.error("Please update your profile before booking an appointment.");
      return;
    }
    const age = calculateAge(formData.dob);
    if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }
    const appointmentId = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const payload = { ...formData, bookingDate, age, appointmentId };
    const requiredFields = [
      "patientId",
      "fullName",
      "email",
      "phone",
      "dob",
      "gender",
      "specialist",
      "clinic",
      "doctorName",
      "slot",
      "bookingDate",
      "age",
      "appointmentId",
    ];
    for (const field of requiredFields) {
      if (!payload[field]) {
        toast.error(`Missing required field: ${field}`);
        return;
      }
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/appointment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(`Appointment booked! ID: ${payload.appointmentId}`);
        setTimeout(() => {
          navigate("/my_appointment");
        }, 2000);
      } else {
        toast.error(data.message || "Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-[250px] bg-white border-r shadow-md" ref={sidebarRef}>
        <PatientSidebar />
      </div>

      <main
        ref={mainRef}
        className="flex-1 relative flex items-center justify-center p-6"
        style={{
          backgroundImage: `url(${assets.backImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 z-0" />
        <form
          onSubmit={handleSubmit}
          className="relative z-10 flex flex-col gap-4 p-8 w-full max-w-md bg-white bg-opacity-95 rounded-xl shadow-2xl text-sm text-zinc-800"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center text-green-700">
            Book Your Appointment
          </h2>

          {["patientId", "fullName", "email", "gender"].map((name) => (
            <div key={name}>
              <p>{name.replace(/([A-Z])/g, " $1")}</p>
              <input
                type="text"
                value={formData[name]}
                readOnly
                className="border bg-gray-100 rounded w-full p-2 mt-1 cursor-not-allowed"
              />
            </div>
          ))}

          <div>
            <p>Mobile Number*</p>
            <input
              type="tel"
              name="phone"
              readOnly
              value={formData.phone}
              onChange={handleChange}
              required
              className="border bg-gray-100 rounded w-full p-2 mt-1 cursor-not-allowed"
            />
          </div>

          <div>
            <p>Date of Birth*</p>
            <input
              type="date"
              name="dob"
              readOnly
              value={formData.dob}
              onChange={handleChange}
              max={today}
              required
              className="border bg-gray-100 rounded w-full p-2 mt-1 cursor-not-allowed"
            />
            {formData.dob && (
              <p className="text-green-600">Age: {calculateAge(formData.dob)}</p>
            )}
          </div>

          <div>
            <p>Specialist*</p>
            <select
              name="specialist"
              value={formData.specialist}
              onChange={handleChange}
              required
              className="border rounded w-full p-2 mt-1"
            >
              <option value="">-- Select Specialist --</option>
              {[
                "General Physician",
                "Pediatrics",
                "Cardiology",
                "Orthopedics",
                "Radiology",
                "Dermatology",
              ].map((sp) => (
                <option key={sp}>{sp}</option>
              ))}
            </select>
          </div>

          {formData.specialist && (
            <div>
              <p>Clinic*</p>
              <select
                name="clinic"
                value={formData.clinic}
                onChange={handleChange}
                required
                className="border rounded w-full p-2 mt-1"
              >
                <option value="">-- Select Clinic --</option>
                {filteredClinics.map((c, i) => (
                  <option key={i}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {formData.specialist && formData.clinic && (
            <div>
              <p>Doctor*</p>
              <select
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                required
                className="border rounded w-full p-2 mt-1"
              >
                <option value="">-- Select Doctor --</option>
                {filteredDoctors.map((doc) => (
                  <option key={doc._id}>
                    {doc.userId?.username || doc.userId?.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <p>Reason for Appointment</p>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="border rounded w-full p-2 mt-1 min-h-[80px]"
            />
          </div>

          {availableDates.length > 0 && (
            <div>
              <p>Booking Date*</p>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => {
                  setBookingDate(e.target.value);
                  setFormData((prev) => ({ ...prev, slot: "" }));
                }}
                required
                list="available-dates"
                className="border rounded w-full p-2 mt-1"
              />
              <datalist id="available-dates">
                {availableDates.map((date) => (
                  <option key={date} value={date} />
                ))}
              </datalist>
            </div>
          )}

          {bookingDate && availableSlots.length > 0 && (
            <div className="w-full mt-3">
              <p>Select a Time Slot:</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleSlotSelect(slot)}
                    className={`px-4 py-2 border rounded-full ${
                      formData.slot === slot
                        ? "bg-blue-600 text-white"
                        : "bg-white text-black border-blue-300"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="bg-green-600 text-white w-full py-2 mt-6 rounded hover:bg-green-700"
          >
            Submit Appointment
          </button>
        </form>
      </main>
    </div>
  );
};

export default Appointment_booking;
