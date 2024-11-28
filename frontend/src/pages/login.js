import React, { useState } from "react";
import axios from "axios";
import "../app/globals.css";
import Navbar from "../components/Navbar";
import Link from "next/link";
import Lottie from "lottie-react";
import LoginAnimation from "../../public/Login.json";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import default styles

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });
      toast.success("Login successful!");
      console.log("Token:", response.data.accessToken);
    } catch (error) {
      // + error.response.data.message
      toast.error("Login Faailed!");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FBFBFB",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <ToastContainer /> 
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "50px",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          textAlign: "center",
          padding:"9px",

        }}
      >
        <div style={{ marginRight: "20px" }}>
          <Lottie className="h-64" animationData={LoginAnimation} />
        </div>

        <div
          style={{
            padding: "60px",
            borderRadius: "8px",
            backgroundColor: "white",
            boxShadow: "1px 4px 6px rgba(0, 0, 0, 0.5)",
            width: "450px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "600",
              transition: "color 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#1A5BB8")}
            onMouseLeave={(e) => (e.target.style.color = "black")} // Revert color on hover out
          >
            Welcome Back ...!
          </h1>
          <p>Enjoy your learning experience and continue where you left off.</p>
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
          <button
            onClick={handleLogin}
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
            Login
          </button>
          <p>
            Don't have an account? ...
            <Link
              href="/register"
              style={{ color: "#024CAA", textDecoration: "none" }}
            >
              Start a new journey
            </Link>
          </p>{" "}
        </div>
      </div>
    </div>
  );
}