"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../globals.css";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lottie from "lottie-react";
import profile from "../../public/profile.json";
import { Separator } from "@/components/ui/separator";
import courseAn from "../../public/course.json";

interface UserData {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  userId: string;
  createdAt: string;
  __v: number;
  learningPreference?: string;
  subjectsOfInterest?: string[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficultyLevel: string;
  courseImage?: string;
  enrolled: boolean;
  teacherName: string;
  isEnded: boolean;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | "">("");
  const [role, setRole] = useState<string | "">("");
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [learningPreference, setLearningPreference] = useState(localStorage.getItem('learningPreference') || '');
  const [subjectsOfInterest, setSubjectsOfInterest] = useState<string[]>(
    JSON.parse(localStorage.getItem('subjectsOfInterest') || '[]')
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userIDd = localStorage.getItem("userID");
    const role = localStorage.getItem("userRole");
    setRole(role || "");
    setAccessToken(token);
    setUserID(userIDd || "");
  }, []);

  useEffect(() => {
    if (accessToken && userID) {
      getUserData(userID);
      getTeacherCourses(userID);
    }
    fetchCourses();
  }, [accessToken, userID]);

  const handleLearningPreferenceChange = (preference: string) => {
    setLearningPreference(preference);
    localStorage.setItem('learningPreference', preference);
  };

  const handleSubjectChange = (subject: string) => {
    const updatedSubjects = subjectsOfInterest.includes(subject)
      ? subjectsOfInterest.filter(s => s !== subject)
      : [...subjectsOfInterest, subject];
    setSubjectsOfInterest(updatedSubjects);
    localStorage.setItem('subjectsOfInterest', JSON.stringify(updatedSubjects));
  };

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

  const getTeacherCourses = async (userId: string | null) => {
    try {
      console.log("access token", accessToken);
      const response = await axios.get(
        `http://localhost:3000/courses/student/${userId}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAllCourses(response.data.assigned);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        toast.error(
          "Error creating course!",
          error.response?.data || error.message
        );
        if (statusCode === 401) {
          toast.error("Session expired. Redirecting to Login...");
          return;
        }
      } else {
        console.error("Error:", error);
        toast.error("Error getting course!");
      }
    }
  };

  const fetchCourses = async () => {
    const token = localStorage.getItem("accessToken");
    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:3000/courses/student",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { assigned, available } = response.data;
      setEnrolledCourses(assigned);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses.");
    } finally {
      setLoading(false);
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
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(userData.createdAt).toLocaleString()}
                </p>

                {/* Learning Preferences Section */}
                <div style={{ marginTop: "20px" }}>
                  <p><strong>Learning Preference:</strong></p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleLearningPreferenceChange('pdf')}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: learningPreference === 'pdf' ? '#007bff' : '#e9ecef',
                        color: learningPreference === 'pdf' ? 'white' : 'black',
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}>
                      PDF
                    </button>
                    <button
                      onClick={() => handleLearningPreferenceChange('video')}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: learningPreference === 'video' ? '#007bff' : '#e9ecef',
                        color: learningPreference === 'video' ? 'white' : 'black',
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}>
                      Video
                    </button>
                  </div>
                </div>

                {/* Subjects of Interest Section */}
                <div style={{ marginTop: "20px" }}>
                  <p><strong>Subjects of Interest:</strong></p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {["Mathematics", "Machine Learning", "Physics", "Chemistry"].map((subject) => (
                      <button
                        key={subject}
                        onClick={() => handleSubjectChange(subject)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: subjectsOfInterest.includes(subject) ? '#007bff' : '#e9ecef',
                          color: subjectsOfInterest.includes(subject) ? 'white' : 'black',
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}>
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>
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
              <div> </div>
            </>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>
      <Separator />

      {role == "student" && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: "space-around",
            padding: "16px",
          }}>
          <div>
            <h2 className="font-bold text-2xl">Explore All Your Courses</h2>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "start",
              justifyContent: "flex-start",
              flexWrap: "nowrap",
              gap: "16px",
              overflowX: "scroll",
              padding: "16px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}>
            {enrolledCourses &&
              enrolledCourses.map((course: any) => {
                return (
                  <div
                    key={course._id}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      height: "250px",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "9px",
                      borderRadius: "4px",
                      border: "1px solid #7F8081",
                      boxShadow: "1px 4px 6px rgba(0, 0, 0, 0.5)",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      width: "400px",
                      flexShrink: 0,
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }>
                    <div style={{ marginRight: "10px" }}>
                      <Lottie className="h-44" animationData={courseAn} />
                    </div>
                    <div
                      onClick={() =>
                        (window.location.href = `/courses/specificCourse/?courseId=${course._id}&accessToken=${accessToken}`)
                      }
                      style={{
                        flex: "1",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "5px",
                        paddingLeft: "10px",
                        maxWidth: "500px",
                        cursor: "pointer",
                        transition: "transform 0.2s",
                      }}>
                      <h3
                        style={{
                          margin: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                        Title: {course.title}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          whiteSpace: "normal",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "400px",
                        }}>
                        Description: {course.description}
                      </p>

                      <p style={{ margin: 0 }}>Category: {course.category}</p>
                      <p style={{ margin: 0 }}>
                        Level: {course.difficultyLevel}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
