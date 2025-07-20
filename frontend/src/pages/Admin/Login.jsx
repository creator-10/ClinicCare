import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import registrationBg from "../../assets/registration.jpg";
import Navbar from "../../components/Navbar";

const SPECIALIZATIONS = [
  "Dermatology",
  "Radiology",
  "Orthopedics",
  "Paediatrics",
  "General Physician",
  "Cardiology",
];

const Login = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [stateType, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleType, setRoleType] = useState("patient");
  const [username, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [experience, setExperience] = useState("");
  const [gender, setGender] = useState("");

  const [showPatientIdModal, setShowPatientIdModal] = useState(false);
  const [newPatientId, setNewPatientId] = useState("");

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [patientIdInput, setPatientIdInput] = useState("");
  const [patientIdError, setPatientIdError] = useState("");
  const [patientIdVerified, setPatientIdVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let res, data;

      if (stateType === "Sign Up") {
        if (!username.trim() || !email.trim() || !password.trim() || !gender.trim() || (roleType === "doctor" && (!specialization.trim() || !experience.trim() || !clinicAddress.trim()))) {
          toast.error("Please fill all required fields");
          return;
        }

        const normalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();

       if (roleType === "doctor") {
  const doctorData = {
    username: username.trim(),
    email: email.trim(),
    password: password.trim(),
    gender: normalizedGender,
    specialization: specialization.trim(),
    experience: experience.trim(),
    address: {
      line1: clinicAddress.trim(),
      line2: ""
    }
  };

  res = await axios.post(backendUrl + "/api/doctor/register", doctorData);
} else {
          const inputData = {
            username: username.trim(),
            email: email.trim(),
            password: password.trim(),
            gender: normalizedGender,
            address: { line1: clinicAddress.trim(), line2: "" },
          };
          res = await axios.post(backendUrl + "/api/user/register", inputData);
        }

        data = res.data;

        if (data.success) {
          if (roleType === "patient") {
            if (!data.patientId) throw new Error("`patientId` missing in response");
            setNewPatientId(data.patientId);
            setShowPatientIdModal(true);
          } else {
            toast.success("Registration successful! Awaiting admin approval.");
            setState("Login");
          }
        } else {
          toast.error(data.message || "Registration failed");
        }
      } else {
        res = await axios.post(backendUrl + "/api/user/login", { email, password });
        data = res.data;
        if (data.success) {
          const userObj = {
            patientId: data.patientId || "",
            username: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            gender: data.gender || "",
            dob: data.dob || "",
            profilePic: data.profilePic || "",
            address: data.address || {},
          };
          dispatch(login({ token: data.token, role: data.role, user: userObj }));
        } else {
          toast.error(data.message || "Login failed");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleVerifyEmail = async () => {
    setForgotEmailError("");
    try {
      const res = await axios.post(`${backendUrl}/api/forgotp/verify-email`, {
        email: forgotEmail.trim(),
      });

      if (res.data.success) {
        setEmailVerified(true);
      } else {
        setForgotEmailError(res.data.message || "Email not found.");
      }
    } catch (err) {
      setForgotEmailError(err.response?.data?.message || "Error verifying email.");
    }
  };

  const handleVerifyPatientId = async () => {
    setPatientIdError("");
    try {
      const res = await axios.post(`${backendUrl}/api/forgotp/verify-patient-id`, {
        email: forgotEmail.trim(),
        patientId: patientIdInput.trim(),
      });

      if (res.data.success) {
        setPatientIdVerified(true);
      } else {
        setPatientIdError(res.data.message || "Invalid Patient ID or mismatch.");
      }
    } catch (err) {
      setPatientIdError(err.response?.data?.message || "Verification failed.");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/api/forgotp/reset-password`, {
        email: forgotEmail.trim(),
        patientId: patientIdInput.trim(),
        newPassword,
      });

      if (res.data.success) {
        toast.success("Password reset successful!");
        setShowForgotPassword(false);
        setEmailVerified(false);
        setPatientIdVerified(false);
        setForgotEmail("");
        setPatientIdInput("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.data.message || "Password reset failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password.");
    }
  };

  useEffect(() => {
    if (!token) return;
    if (role === "admin") navigate("/admin");
    else if (role === "doctor") navigate("/doctor");
    else navigate("/patient/home");
  }, [token, role]);

  return (
    <>
      <Navbar />
      <div
        style={{ backgroundImage: `url(${registrationBg})` }}
        className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      >
        <div className="bg-white bg-opacity-90 flex flex-col md:flex-row rounded-xl shadow-lg max-w-4xl w-full overflow-hidden">
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600 w-1/2 p-11">
            <h2 className="text-2xl font-bold text-white mb-2 text-center drop-shadow">
              Welcome to Medicohub
            </h2>
            <p className="text-blue-100 text-center text-base">
              Your one-stop solution for healthcare appointments and patient management.
            </p>
            <img
              src="https://www.mindinventory.com/blog/wp-content/uploads/2023/02/healthcare-trends.png"
              alt="Healthcare Trends"
              className="h-full w-full rounded-l-xl"
            />
          </div>

          <form onSubmit={onSubmitHandler} className="w-full md:w-1/2 p-8">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-semibold">
                {stateType === "Sign Up" ? "Create Account" : "Login"}
              </h2>
              <p>Please {stateType === "Sign Up" ? "sign up" : "login"} to continue</p>
            </div>

            {stateType === "Sign Up" && (
              <>
                <div className="mb-3">
                  <label className="font-medium">Register As</label>
                  <div className="flex gap-2">
                    {["patient", "doctor"].map((rt) => (
                      <button
                        key={rt}
                        type="button"
                        className={`flex-1 py-2 rounded ${
                          roleType === rt ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                        onClick={() => setRoleType(rt)}
                      >
                        {rt.charAt(0).toUpperCase() + rt.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded w-full p-2 mb-3"
                  required
                />
              </>
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded w-full p-2 mb-3"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded w-full p-2 mb-3"
              required
            />

            {stateType === "Sign Up" && (
              <>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="border rounded w-full p-2 mb-3"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>

                {roleType === "doctor" && (
                  <>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="border rounded w-full p-2 mb-3"
                      required
                    >
                      <option value="">Select Specialization</option>
                      {SPECIALIZATIONS.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Years of Experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="border rounded w-full p-2 mb-3"
                      required
                      min="0"
                      max="100"
                    />
                    <p className="text-blue-700">Clinic Address</p>
                    <input
                      type="text"
                      placeholder="Clinic address"
                      value={clinicAddress}
                      onChange={(e) => setClinicAddress(e.target.value)}
                      className="border rounded w-full p-2 mb-3"
                      required
                    />
                    {/* profilePhoto input removed */}
                  </>
                )}
              </>
            )}

            {stateType === "Login" && (
              <p
                className="text-right text-sm text-blue-600 cursor-pointer mb-2"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot password?
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {stateType === "Sign Up" ? "Register" : "Login"}
            </button>

            <p className="text-sm text-center mt-4">
              {stateType === "Sign Up" ? "Already have an account?" : "Don't have an account?"}{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setState(stateType === "Sign Up" ? "Login" : "Sign Up")}
              >
                {stateType === "Sign Up" ? "Login" : "Sign Up"}
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* Registration Modal */}
      {showPatientIdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-80 text-center space-y-4">
            <h3 className="text-lg font-semibold">Registration Successful</h3>
            <p>Your Patient ID is:</p>
            <p className="text-2xl font-bold text-blue-600">{newPatientId}</p>
            <p className="text-sm">Please save this for future login & password recovery.</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setShowPatientIdModal(false);
                setState("Login");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">Forgot Password (Patient)</h2>

            {!emailVerified ? (
              <>
                <p>Email</p>
                <input
                  className="border w-full rounded p-2 mt-1 mb-2"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                {forgotEmailError && <p className="text-red-600 text-sm">{forgotEmailError}</p>}
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded mt-3"
                  onClick={handleVerifyEmail}
                >
                  Verify Email
                </button>
              </>
            ) : !patientIdVerified ? (
              <>
                <p>Enter 4-digit Patient ID</p>
                <input
                  className="border w-full rounded p-2 mt-1 mb-2"
                  type="text"
                  maxLength="4"
                  value={patientIdInput}
                  onChange={(e) => setPatientIdInput(e.target.value)}
                />
                {patientIdError && <p className="text-red-600 text-sm">{patientIdError}</p>}
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded mt-3"
                  onClick={handleVerifyPatientId}
                >
                  Verify Patient ID
                </button>
              </>
            ) : (
              <>
                <p>New Password</p>
                <input
                  className="border w-full rounded p-2 mt-1 mb-2"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p>Confirm Password</p>
                <input
                  className="border w-full rounded p-2 mt-1 mb-2"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  className="w-full bg-green-600 text-white py-2 rounded mt-3"
                  onClick={handleResetPassword}
                >
                  Reset Password
                </button>
              </>
            )}

            <button
              className="w-full mt-4 text-center text-red-600 hover:underline"
              onClick={() => {
                setShowForgotPassword(false);
                // Reset modal states
                setEmailVerified(false);
                setPatientIdVerified(false);
                setForgotEmail("");
                setPatientIdInput("");
                setNewPassword("");
                setConfirmPassword("");
                setForgotEmailError("");
                setPatientIdError("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
