"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../globals.css";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lottie from "lottie-react";
import profile from "../../public/profile.json";

interface UserData {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  userId: string;
  createdAt: string;
  __v: number;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle for edit mode
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | "">("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userIDd = localStorage.getItem("userID");
    setAccessToken(token);
    setUserID(userIDd || "");
  }, []);

  useEffect(() => {
    if (accessToken && userID) {
      getUserData(userID);
    }
  }, [accessToken, userID]);

  const getUserData = async (userID: string) => {
    try {
      const response = await axios.get<UserData>(
        `http://localhost:3000/users/user/${userID}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUserData(response.data);
    } catch (error) {
      toast.error("Error fetching user data!");
    }
  };

  const handleSave = async () => {
    try {
      if (!userData) return;

      const updatedData = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };

      await axios.put(
        `http://localhost:3000/users/user/${userID}`,
        updatedData,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("User data updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Error updating user data!");
    }
  };

  const handleChange = (field: keyof UserData, value: string) => {
    if (!userData) return;
    setUserData({ ...userData, [field]: value });
  };

  return (
    <div
      style={{
        backgroundColor: "#FBFBFB",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}>
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
          padding: "9px",
        }}>
        <div style={{ marginRight: "20px" }}>
          <Lottie className="h-64" animationData={profile} />
        </div>
        <div
          style={{
            padding: "60px",
            borderRadius: "8px",
            backgroundColor: "white",
            boxShadow: "1px 4px 6px rgba(0, 0, 0, 0.5)",
            width: "450px",
            textAlign: "center",
          }}>
          {userData ? (
            <>
              <h1>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginBottom: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                ) : (
                  `Welcome Back, ${userData.name}!`
                )}
              </h1>
              <div style={{ textAlign: "left", marginTop: "20px" }}>
                <p>
                  <strong>Name:</strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginBottom: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    userData.name
                  )}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {isEditing ? (
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginBottom: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    userData.email
                  )}
                </p>
                <p>
                  <strong>Role:</strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.role}
                      onChange={(e) => handleChange("role", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginBottom: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    userData.role
                  )}
                </p>{" "}
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(userData.createdAt).toLocaleString()}
                </p>
              </div>
              <div style={{ marginTop: "20px" }}>
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      style={{
                        padding: "10px 20px",
                        marginRight: "10px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}>
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}>
                    Edit
                  </button>
                )}
              </div>
            </>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>
    </div>
  );
}
