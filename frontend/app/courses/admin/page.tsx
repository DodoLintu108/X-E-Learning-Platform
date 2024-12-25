"use client";

import React, { useState } from "react";
import axios from "axios";
// BackupManager Component
const BackupManager = () => {
  const handleCreateBackup = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://localhost:3000/backup/create",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Backup created successfully");
    } catch (error) {
      console.error("Error creating backup:", error);
      alert("Failed to create backup");
    }
  };

  const handleDownloadBackup = async (type: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://localhost:3000/backup/download/${type}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // Important for file downloads
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}_backup.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading backup:", error);
      alert("Failed to download backup");
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Backup Management</h3>
      <button
        onClick={handleCreateBackup}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px",
          margin: "10px",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Create Backup
      </button>
      <button
        onClick={() => handleDownloadBackup("users")}
        style={{
          backgroundColor: "green",
          color: "white",
          padding: "10px",
          margin: "10px",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Download User Backup
      </button>
      <button
        onClick={() => handleDownloadBackup("courses")}
        style={{
          backgroundColor: "orange",
          color: "white",
          padding: "10px",
          margin: "10px",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Download Course Backup
      </button>
    </div>
  );
};
// Main AdminDashboard Component
const AdminDashboard = () => {
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [allTeachers, setAllTeachers] = useState<any[]>([]);

  const [error, setError] = useState("");

  const fetchData = async (
    endpoint: string,
    setData: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token is missing. Please log in.");
      setError("Access token is missing. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", response.data);
      setData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error("Unauthorized access. Redirecting to login...");
        setError("Unauthorized access. Please log in again.");
        window.location.href = "/login";
      } else {
        console.error(`Error fetching ${endpoint}:`, error);
        setError(`Error fetching ${endpoint}: ${error}`);
      }
    }
  };

  const handleDelete = async (endpoint: string, id: string | undefined) => {
    if (!id) {
      console.error("ID is missing for deletion.");
      setError("ID is missing for deletion.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token is missing. Please log in.");
      setError("Access token is missing. Please log in.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/${endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`${endpoint.slice(0, -1)} deleted successfully.`);

      if (endpoint === "courses") fetchData("courses/all", setAllCourses);
      if (endpoint === "students") fetchData("users/students", setAllStudents);
      if (endpoint === "teachers") fetchData("users/teachers", setAllTeachers);

      setError("");
    } catch (error) {
      console.error(`Error deleting ${endpoint.slice(0, -1)}:`, error);
      setError(`Error deleting ${endpoint.slice(0, -1)}.`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      {error && <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>}

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => fetchData("courses/all", setAllCourses)} style={{ marginRight: "10px" }}>
          Get All Courses
        </button>
        <button onClick={() => fetchData("users/teachers", setAllTeachers)} style={{ marginRight: "10px" }}>
          Get All Teachers
        </button>
        <button onClick={() => fetchData("users/students", setAllStudents)}>
          Get All Students
        </button>
      </div>

      {/* Courses Section */}
      <div>
        <h2>All Courses</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {allCourses.length > 0 ? (
            allCourses.map((course) => (
              <div
                key={course.courseId}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "10px",
                  minWidth: "200px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <button
                  style={{ background: "red", color: "white", border: "none", padding: "5px 10px" }}
                  onClick={() => handleDelete("courses", course.courseId)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No courses available</p>
          )}
        </div>
      </div>

      {/* Teachers Section */}
      <div>
        <h2>All Teachers</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {allTeachers.length > 0 ? (
            allTeachers.map((teacher) => (
              <div
                key={teacher.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "10px",
                  minWidth: "200px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3>{teacher.name}</h3>
                <p>{teacher.email}</p>
                <button
                  style={{ background: "red", color: "white", border: "none", padding: "5px 10px" }}
                  onClick={() => handleDelete("teachers", teacher.id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No teachers available</p>
          )}
        </div>
      </div>

      {/* Students Section */}
      <div>
        <h2>All Students</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {allStudents.length > 0 ? (
            allStudents.map((student) => (
              <div
                key={student.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "10px",
                  minWidth: "200px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3>{student.name}</h3>
                <p>{student.email}</p>
                <button
                  style={{ background: "red", color: "white", border: "none", padding: "5px 10px" }}
                  onClick={() => handleDelete("students", student.id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No students available</p>
          )}
        </div>
        
      </div>
            {/* Backup Section */}
      <BackupManager />
    </div>
  );
};

export default AdminDashboard;
