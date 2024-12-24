"use client";

import React, { useState } from "react";
import axios from "axios";
import "../globals.css";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Select role");

  const handleRegister = async () => {
    console.log("clicked");
    const name = fName + " " + lName; // Added a space between first and last name
    console.log(name);
    try {
      await axios.post("http://localhost:3000/auth/register", {
        name,
        email,
        password,
        role,
      });
      toast.success("Registration successful!");
      window.location.href = "/Login";
    } catch (error) {
      let errorMessage = "Registration Failed!";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
        }}
      >
        <h1
          style={{
            color: "#7F8081",
            fontSize: "20px",
          }}
        >
          Join our community and unlock a world of knowledge
        </h1>
        <h2
          style={{
            color: "#7F8081",
            fontSize: "20px",
          }}
        >
          Create your account to start learning, growing, and achieving your
          goals today!
        </h2>
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
            <option value="Select role" disabled>
              Select role
            </option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
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
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}


