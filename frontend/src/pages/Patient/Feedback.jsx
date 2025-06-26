import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [services, setService] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setNameError(true);
      return;
    }

    setNameError(false);

    console.log("Submitted:", { name, services, suggestion });
  };

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg w-full max-w-md">
        
        {/* Name Field */}
        <div className="w-full">
          <p>Full Name*</p>
          <input
            className={`border rounded w-full p-2 mt-1 ${nameError ? "border-red-500" : "border-zinc-300"}`}
            type="text"
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(false);
            }}
            value={name}
            required
          />
          {nameError && <p className="text-red-600 text-xs mt-1">Full Name is required</p>}
        </div>

        {/* Services Feedback Textarea */}
        <div className="w-full">
          <p>Share your thoughts on our services</p>
          <textarea
            className="border rounded w-full p-2 mt-1 min-h-[80px]"
            value={services}
            onChange={(e) => setService(e.target.value)}
          />
        </div>

        {/* Suggestion Textarea */}
        <div className="w-full">
          <p>Any feedback to improve our service?</p>
          <textarea
            className="border rounded w-full p-2 mt-1 min-h-[80px]"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 mt-4 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default Feedback;
