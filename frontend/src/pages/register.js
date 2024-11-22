import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:3000/auth/register', { name, email, password, role });
      alert('Registration successful!');
    } catch (error) {
      alert('Registration failed: ' + error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
      </select>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}