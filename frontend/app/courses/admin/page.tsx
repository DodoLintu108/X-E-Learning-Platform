"use client";

import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.success("Backup created successfully");
    } catch (error) {
      console.error("Error creating backup:", error);
      toast.error("Failed to create backup");
    }
  };

  const handleDownloadBackup = async (type: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://localhost:3000/backup/download/${type}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
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
      toast.error("Failed to download backup");
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Backup Management</h3>
      <button
        onClick={handleCreateBackup}
        className="button blue"
      >
        Create Backup
      </button>
      <button
        onClick={() => handleDownloadBackup("users")}
        className="button green"
      >
        Download User Backup
      </button>
      <button
        onClick={() => handleDownloadBackup("courses")}
        className="button orange"
      >
        Download Course Backup
      </button>
    </div>
  );
};

// AdminDashboard Component
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
      toast.error("Access token is missing. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      setError(`Error fetching ${endpoint}.`);
    }
  };

  const handleDelete = async (endpoint: string, id: string | undefined) => {
    const token = localStorage.getItem("accessToken");
    if (!id || !token) {
      toast.error("Failed to delete: Missing ID or token.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/${endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`${endpoint.slice(0, -1)} deleted successfully.`);
      if (endpoint === "courses") fetchData("courses/all", setAllCourses);
      if (endpoint === "students") fetchData("users/students", setAllStudents);
      if (endpoint === "teachers") fetchData("users/teachers", setAllTeachers);
    } catch (error) {
      console.error(`Error deleting ${endpoint.slice(0, -1)}:`, error);
      toast.error(`Failed to delete ${endpoint.slice(0, -1)}.`);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <ToastContainer />
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Admin Dashboard</h1>

      {error && <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>}

      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button
          onClick={() => fetchData("courses/all", setAllCourses)}
          className="button blue"
        >
          Get All Courses
        </button>
        <button
          onClick={() => fetchData("users/teachers", setAllTeachers)}
          className="button green"
        >
          Get All Teachers
        </button>
        <button
          onClick={() => fetchData("users/students", setAllStudents)}
          className="button orange"
        >
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
                key={course._id}
                className="card"
              >
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <button
                  onClick={() => handleDelete("courses", course._id)}
                  className="button red"
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
                key={teacher._id}
                className="card"
              >
                <h3>{teacher.name}</h3>
                <p>{teacher.email}</p>
                <button
                  onClick={() => handleDelete("teachers", teacher._id)}
                  className="button red"
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
                key={student._id}
                className="card"
              >
                <h3>{student.name}</h3>
                <p>{student.email}</p>
                <button
                  onClick={() => handleDelete("students", student._id)}
                  className="button red"
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

