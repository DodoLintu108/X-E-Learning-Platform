"use client";

import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/app/components/Navbar";
import "../../globals.css";

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
    <div className="mt-10 flex flex-row gap-2">
      <button onClick={handleCreateBackup} className="button blue">
        Create Backup
      </button>
      <button
        onClick={() => handleDownloadBackup("users")}
        className="button green">
        Download User Backup
      </button>
      <button
        onClick={() => handleDownloadBackup("courses")}
        className="button orange">
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
  const [userLogs, setUserLogs] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [newCourseData, setNewCourseData] = useState({
    title: "",
    description: "",
    category: "",
    difficultyLevel: ""
  });

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
      await axios.delete(`http://localhost:3000/users/${endpoint}/${id}`, {
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

  const fetchLogs = async (userId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://localhost:3000/users/user/${userId}/access-logs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserLogs(response.data.logs);
      setSelectedUserId(userId);
      toast.success("Logs fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch access logs");
    }
  };

  const resetFailedLogins = async (userId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:3000/users/user/${userId}/reset-failed-logins`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Failed login attempts reset");
    } catch (error) {
      toast.error("Failed to reset login attempts");
    }
  };

  const handleCreateCourse = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.post("http://localhost:3000/courses/create", newCourseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course created successfully");
      fetchData("courses/all", setAllCourses);
      setNewCourseData({
        title: "",
        description: "",
        category: "",
        difficultyLevel: ""
      });
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course");
    }
  };

  const handleEndCourse = async (courseId: string) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.put(
        `http://localhost:3000/courses/${courseId}/end`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Course ended successfully");
      fetchData("courses/all", setAllCourses);
    } catch (error) {
      console.error("Error ending course:", error);
      toast.error("Failed to end course");
    }
  };

  const handleAssignCourse = async (courseId: string, userId: string) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.post(
        `http://localhost:3000/courses/${courseId}/assign/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Course assigned successfully");
      fetchData("courses/all", setAllCourses);
    } catch (error) {
      console.error("Error assigning course:", error);
      toast.error("Failed to assign course");
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <h1 className="text-center mb-5">Admin Dashboard</h1>

      {error && <div className="text-red-500 mb-5">{error}</div>}

      {/* Course Creation Form */}
      <div className="mb-5 p-4 border rounded">
        <h2 className="mb-3">Create New Course</h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Course Title"
            value={newCourseData.title}
            onChange={(e) =>
              setNewCourseData({ ...newCourseData, title: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newCourseData.description}
            onChange={(e) =>
              setNewCourseData({ ...newCourseData, description: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={newCourseData.category}
            onChange={(e) =>
              setNewCourseData({ ...newCourseData, category: e.target.value })
            }
            className="p-2 border rounded"
          />
          <select
            value={newCourseData.difficultyLevel}
            onChange={(e) =>
              setNewCourseData({
                ...newCourseData,
                difficultyLevel: e.target.value,
              })
            }
            className="p-2 border rounded"
          >
            <option value="">Select Difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <button onClick={handleCreateCourse} className="button blue">
            Create Course
          </button>
        </div>
      </div>

      {/* Data Fetch Buttons */}
      <div className="mb-5 text-center flex flex-row gap-2">
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
      <div className="mb-5">
        <h2>All Courses</h2>
        <div className="flex flex-wrap gap-5">
          {allCourses.length > 0 ? (
            allCourses.map((course) => (
              <div key={course._id} className="card">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleDelete("courses", course._id)}
                    className="button red"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEndCourse(course._id)}
                    className="button orange"
                  >
                    End Course
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No courses available</p>
          )}
        </div>
      </div>

      {/* Teachers Section */}
      <div className="mb-5">
        <h2>All Teachers</h2>
        <div className="flex flex-wrap gap-5">
          {allTeachers.length > 0 ? (
            allTeachers.map((teacher) => (
              <div key={teacher._id} className="card">
                <h3>{teacher.name}</h3>
                <p>{teacher.email}</p>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete("teachers", teacher._id)}
                  className="button red"
                >
                  Delete
                </button>

                {/* View Logs Button */}
                <button
                  onClick={() => fetchLogs(teacher._id)}
                  className="button blue"
                >
                  View Logs
                </button>

                {/* Reset Failed Logins Button */}
                <button
                  onClick={() => resetFailedLogins(teacher._id)}
                  className="button orange"
                >
                  Reset Failed Logins
                </button>
              </div>
            ))
          ) : (
            <p>No teachers available</p>
          )}
        </div>
      </div>

      {/* Students Section */}
      <div className="mb-5">
        <h2>All Students</h2>
        <div className="flex flex-wrap gap-5">
          {allStudents.length > 0 ? (
            allStudents.map((student) => (
              <div key={student._id} className="card">
                <h3>{student.name}</h3>
                <p>{student.email}</p>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete("students", student._id)}
                  className="button red"
                >
                  Delete
                </button>

                {/* View Logs Button */}
                <button
                  onClick={() => fetchLogs(student._id)}
                  className="button blue"
                >
                  View Logs
                </button>

                {/* Reset Failed Logins Button */}
                <button
                  onClick={() => resetFailedLogins(student._id)}
                  className="button orange"
                >
                  Reset Failed Logins
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