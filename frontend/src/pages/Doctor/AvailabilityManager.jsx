import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import SideBar from "../../components/SideBar";

const TIME_BLOCKS = ["9am to 12pm", "1pm to 4pm", "6pm to 9pm"];

const AvailabilityManager = () => {
  const { token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({ name: "", specialization: "" });
  const [slotsByDate, setSlotsByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load profile + availability
  useEffect(() => {
    const fetchProfileAndAvailability = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/doctor/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProfile({
          name: res.data.name,
          specialization: res.data.specialization,
        });

        const slotDates = res.data.availabilitySlots || [];
        const grouped = {};
       slotDates.forEach((isoSlot) => {
  const dateObj = new Date(isoSlot);
  const hours = dateObj.getHours(); // ✅ FIXED HERE
  let timeBlock = null;
  if (hours < 12) timeBlock = "9am to 12pm";
  else if (hours < 16) timeBlock = "1pm to 4pm";
  else if (hours < 21) timeBlock = "6pm to 9pm";
  if (timeBlock) {
    const dateKey = format(dateObj, "yyyy-MM-dd");
    if (!grouped[dateKey]) grouped[dateKey] = [];
    if (!grouped[dateKey].includes(timeBlock)) {
      grouped[dateKey].push(timeBlock);
    }
  }
});

        setSlotsByDate(grouped);
      } catch (err) {
        console.error("Failed to load profile or slots:", err);
      }
    };

    fetchProfileAndAvailability();
  }, [token]);

  const handleSelectTimeBlock = (block) => {
    if (!selectedDate) return;
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    setSlotsByDate((prev) => {
      const existing = prev[dateKey] || [];
      if (existing.includes(block)) return prev;
      return { ...prev, [dateKey]: [...existing, block] };
    });
  };

  const handleRemoveTimeBlock = (dateKey, block) => {
    setSlotsByDate((prev) => {
      const updated = prev[dateKey].filter((t) => t !== block);
      if (updated.length === 0) {
        const { [dateKey]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [dateKey]: updated };
    });
  };

  const handleSubmit = async () => {
    try {
      const slotArray = Object.entries(slotsByDate).flatMap(
        ([date, blocks]) => {
          return blocks.map((block) => {
            let hour = 9;
            if (block === "1pm to 4pm") hour = 13;
            else if (block === "6pm to 9pm") hour = 18;
            const slotDate = new Date(
              `${date}T${hour.toString().padStart(2, "0")}:00:00`
            );
            return slotDate.toISOString();
          });
        }
      );

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/doctor/set-availability`,
        { availabilitySlots: slotArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Availability saved successfully!");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save availability");
      setMessage("");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <SideBar />
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto bg-white/90 p-8 shadow-2xl rounded-2xl border border-blue-500 mt-8">
          <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-2 drop-shadow">
            Availability Manager
          </h2>
          <p className="text-blue-800 text-center mb-6">
            {profile.name} -{" "}
            <span className="italic">{profile.specialization}</span>
          </p>

          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <DatePicker
  selected={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  dateFormat="yyyy-MM-dd"
  placeholderText="Select a Date"
  minDate={new Date()} 
  maxDate={new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)} // Today + 7 days
  className="border border-blue-400 px-4 py-2 rounded bg-blue-50 text-blue-700 shadow"
/>


            {selectedDate && (
              <div className="flex gap-2 flex-wrap">
                {TIME_BLOCKS.map((block) => (
                  <button
                    key={block}
                    onClick={() => handleSelectTimeBlock(block)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                  >
                    {block}
                  </button>
                ))}
              </div>
            )}
          </div>

          {Object.keys(slotsByDate).length > 0 && (
            <div className="space-y-4">
              {Object.entries(slotsByDate).map(([date, blocks]) => (
                <div key={date}>
                  <p className="text-lg font-semibold text-blue-800 mb-1">
                    {date}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {blocks.map((block) => (
                      <span
                        key={block}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-blue-200"
                      >
                        {block}
                        <button
                          onClick={() => handleRemoveTimeBlock(date, block)}
                          className="ml-2 text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="mt-8 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow hover:from-blue-700 hover:to-blue-600 transition"
          >
            Save Availability
          </button>

          {message && <p className="text-green-600 mt-3">{message}</p>}
          {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManager;
