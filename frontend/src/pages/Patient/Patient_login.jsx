import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [state, setState] = useState("Sign-up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(null);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dobError, setDobError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [tempCredentials, setTempCredentials] = useState({ email: "", password: "" });

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
  const generatePatientId = () => Math.floor(1000 + Math.random() * 9000);

  useEffect(() => {
    if (state === "Login" && tempCredentials.email && tempCredentials.password) {
      setEmail(tempCredentials.email);
      setPassword(tempCredentials.password);
    }
  }, [state, tempCredentials]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    let hasError = false;

    if (state === "Sign-up") {
      if (!passwordRegex.test(password)) {
        setPasswordError(true);
        setPasswordHelperText("Password must be at least 8 characters, include a number and a symbol");
        hasError = true;
      } else {
        setPasswordError(false);
        setPasswordHelperText("");
      }

      if (!name.trim()) {
        setNameError(true);
        hasError = true;
      } else setNameError(false);

      if (!phone || phone.length !== 10) {
        setPhoneError(true);
        hasError = true;
      } else setPhoneError(false);

      if (!dob) {
        setDobError(true);
        hasError = true;
      } else setDobError(false);

      if (hasError) return;

      try {
        const patientId = generatePatientId();
        const response = await fetch("http://localhost:4000/api/user/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            phone,
            gender,
            dob: dob.toISOString(),
            patientId,
          }),
        });

        const data = await response.json();

        if (data.success) {
          alert(`Account created successfully! Your Patient ID is ${data.patientId}`);
          setTempCredentials({ email, password });  // Save credentials
          setState("Login"); // Switch to login view
        } else {
          alert(data.message || "Something went wrong");
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to server");
      }
    } else if (state === "Login") {
      try {
        const response = await fetch("http://localhost:4000/api/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (data.success) {
          const { name, email, phone, gender, dob, profilePic, patientId } = data.user;

          dispatch(login({
            name,
            email,
            phone,
            gender,
            dob,
            patientId,
            profilePic: profilePic || ""
          }));

          alert(`Welcome back, ${name}`);
          navigate('/');
        } else {
          alert(data.message || "Invalid credentials");
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to server");
      }
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg w-full max-w-md">
        <p className="text-2xl font-semibold">
          {state === "Sign-up" ? "Create Account" : "Login"}
        </p>
        <p>Please {state === "Sign-up" ? "sign up" : "login"} now to schedule your appointment</p>

        {state === "Sign-up" && (
          <>
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

            <div className="w-full">
              <p>Mobile number*</p>
              <input
                className={`border rounded w-full p-2 mt-1 ${phoneError ? "border-red-500" : "border-zinc-300"}`}
                type="tel"
                maxLength={10}
                pattern="[0-9]{10}"
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    setPhone(value);
                    if (phoneError) setPhoneError(false);
                  }
                }}
                value={phone}
                required
              />
              {phoneError && <p className="text-red-600 text-xs mt-1">Valid 10-digit mobile number is required</p>}
            </div>

            <div className="w-full">
              <p>Gender*</p>
              <div className="flex gap-4 mt-1 mb-3">
                <label className="flex items-center gap-1">
                  <input type="radio" name="gender" value="Male" checked={gender === "Male"} onChange={(e) => setGender(e.target.value)} required />
                  Male
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="gender" value="Female" checked={gender === "Female"} onChange={(e) => setGender(e.target.value)} />
                  Female
                </label>
              </div>
            </div>

            <div className="w-full">
              <p className="mb-1">Date of Birth*</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select date"
                  value={dob}
                  onChange={(newValue) => {
                    setDob(newValue);
                    if (dobError) setDobError(!newValue);
                  }}
                  disableFuture
                  openTo="year"
                  views={["year", "month", "day"]}
                  minDate={new Date("1900-01-01")}
                  enableAccessibleFieldDOMStructure={false}
                  slots={{ textField: TextField }}
                  slotProps={{
                    textField: {
                      error: dobError,
                      helperText: dobError ? "Date of Birth is required" : "",
                      fullWidth: true,
                      size: "small",
                      className: "mt-1",
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          </>
        )}

        <div className="w-full">
          <p>Email-Id*</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="w-full">
          <p>Password*</p>
          <TextField
            className="w-full mt-1"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(false);
            }}
            error={passwordError}
            helperText={passwordError ? passwordHelperText : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white w-full py-2 mt-4 rounded hover:bg-blue-700 transition">
          {state === "Sign-up" ? "Create Account" : "Login"}
        </button>

        {state === "Sign-up" ? (
          <p className="mt-2">
            Already have an account?
            <span onClick={() => { setState("Login"); setDobError(false); setNameError(false); setPhoneError(false); }} className="text-blue-600 underline cursor-pointer ml-1">
              Login here
            </span>
          </p>
        ) : (
          <p className="mt-2">
            Don’t have an account?
            <span onClick={() => { setState("Sign-up"); setDobError(false); setNameError(false); setPhoneError(false); }} className="text-blue-600 underline cursor-pointer ml-1">
              Create Account
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
