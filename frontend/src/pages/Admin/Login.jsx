import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../redux/slices/authSlice.js";
import { toast } from "react-toastify";

const SPECIALIZATIONS = [
  "Dermatology",
  "Radiology",
  "Orthopedics",
  "Peadiatrics",
  "General Physician",
  "Cardiology"
];

const Login = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleType, setRoleType] = useState("patient");
  const [username, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (state === "Sign Up") {
        if (roleType === "doctor") {
          if (
            !username.trim() ||
            !email.trim() ||
            !password.trim() ||
            !specialization.trim() ||
            !experience.trim()
          ) {
            toast.error("Please fill all required doctor fields");
            return;
          }
          const inputData = {
            username: username.trim(),
            email: email.trim(),
            password: password.trim(),
            specialization: specialization.trim(),
            experience: experience.trim(),
          };
          try {
            const response = await axios.post(
              backendUrl + "/api/doctor/register",
              inputData
            );
            data = response.data;
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Doctor registration failed"
            );
            return;
          }
        } else {
          if (!username.trim() || !email.trim() || !password.trim()) {
            toast.error("Please fill all required fields");
            return;
          }
          const inputData = {
            username: username.trim(),
            email: email.trim(),
            password: password.trim(),
          };
          try {
            const response = await axios.post(
              backendUrl + "/api/user/register",
              inputData
            );
            data = response.data;
          } catch (err) {
            toast.error(
              err.response?.data?.message || "User registration failed"
            );
            return;
          }
        }

        if (data?.success) {
          toast.success("Registration successful! Awaiting admin approval.");
          setState("Login");
        } else {
          toast.error(data?.message || "Registration failed");
        }
      } else {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/login",
            { email, password }
          );
          if (data.success) {
            dispatch(setToken({ token: data.token, role: data.role }));
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || error.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!token) return;
    else {
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "doctor") navigate("/doctor/dashboard");
      else navigate("/patient/home");
    }
  }, [token, role]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-2-[340px] sm:min-w-96  border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "sign up" : "Login"} to book appointment
        </p>
        {state === "Sign Up" && (
          <div className="w-full mb-3">
            <p className="mb-1 font-medium">Register As</p>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 py-2 rounded-md border ${
                  roleType === "patient"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-black"
                }`}
                onClick={() => setRoleType("patient")}
              >
                Patient
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-md border ${
                  roleType === "doctor"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-black"
                }`}
                onClick={() => setRoleType("doctor")}
              >
                Doctor
              </button>
            </div>
          </div>
        )}
        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={username}
              required
            />
          </div>
        )}
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        {state === "Sign Up" && roleType === "doctor" && (
          <>
            <div className="w-full">
              <p>Specialization</p>
              <select
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
              >
                <option value="">Select specialization</option>
                {SPECIALIZATIONS.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <p>Experience (years)</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="text"
                placeholder="e.g. 5"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                required
              />
            </div>
          </>
        )}
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create an new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-primary underline cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;