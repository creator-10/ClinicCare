import React, { useState } from 'react';
import axios from 'axios';

function AuthTest() {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient'); // default role for simplicity

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/register', {
         username, email, password, role
      });

      if(res.data.success){
        alert("Registered Successfully");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Registration Failed");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/login', {
        email, password
      });

      if(res.data.success){
        alert("Login Success. Token: " + res.data.token);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Login Failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>
      <input placeholder="Name" name= "username" value={username} onChange={e => setName(e.target.value)} /><br />
      <input placeholder="Email" name="email" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <input placeholder="Password" name="password"type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="Patient">Patient</option>
        <option value="Doctor">Doctor</option>
        <option value="Admin">Admin</option>
      </select><br />

      <button onClick={handleRegister}>Register</button>

      <h2>Login</h2>
      <input placeholder="Email"  name="email" value1={email} onChange={e => setEmail(e.target.value)} /><br />
      <input placeholder="Password" type="password" value1={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default AuthTest;
