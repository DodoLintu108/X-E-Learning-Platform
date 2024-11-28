import React, { useState } from "react";
import axios from "axios";
import "../app/globals.css";
import Navbar from "../components/Navbar";
import Link from "next/link";
//import signUpImage from "../../public/signup.png";
export default function Register() {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleRegister = async () => {
    console.log("clicked");
    try {
      await axios.post("http://localhost:3000/auth/register", {
        fName,
        lName,
        email,
        password,
        role,
      });
      alert("Registration successful!");
    } catch (error) {
      alert("Registration failed: " + error.response.data.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
        }}
      >
        {/* <img
          src="/signup.png"
          alt="image"
          style={{
            width: "50%",
            height: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></img> */}
        <h1
          style={{
            color: "#7F8081",
            fontSize: "20px",
            fontFamily: "sans-serif",
          }}
        >
          "Join our community and unlock a world of knowledge—create your
          account to start learning, growing, and achieving your goals today!"
        </h1>
        <div
          style={{
            padding: "30px",
            borderRadius: "8px",
            backgroundColor: "white",
            boxShadow: "1px 4px 6px rgba(0, 0, 0, 0.5)",
            width: "450px",
            textAlign: "center",
            gap: "20px",
          }}
        >
          <h2
            style={{
              fontWeight: "500",
              fontSize: "20px",
              marginBottom: "29px",
            }}
          >
            Sign Up!
          </h2>
          <div style={{ display: "flex", flexDirection: "row", gap: "6px" }}>
            <input
              type="text"
              placeholder="First Name"
              onChange={(e) => setFName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <input
              type="text"
              placeholder="Last Name"
              onChange={(e) => setLName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <select
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <button
            onClick={handleRegister}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#7AB2D3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            SignUp
          </button>
        </div>
      </div>
    </div>
  );
}
