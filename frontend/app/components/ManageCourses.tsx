"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ManageCourses from "../components/ManageCourses";

const AdminCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [allTeachers, setAllteachers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    getAllCourses();
  }, []);

  const getAllCourses = async () => {
    const token = localStorage.getItem("accessToken"); // Retrieve token from localStorage
    if (!token) {
      console.error("Access token is missing. Please log in.");
      return;
    }
    try {
      const response = await axios.get("http://localhost:3000/courses/all", {
        headers: { Authorization: `Bearer ${token}` }, // Include the token in the request header
      });
      setAllCourses(response.data); // Ensure response contains an array of courses
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error("Unauthorized access. Redirecting to login...");
        window.location.href = "/login"; // Redirect to login page if unauthorized
      } else {
        console.error("Error fetching admin courses:", error);
      }
    }
  };
  const getAllTeachers = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token is missing. Please log in.");
      return;
    }
    try {
      const response = await axios.get("http://localhost:3000/users/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllteachers(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error("Unauthorized access. Redirecting to login...");
        window.location.href = "/login"; // Redirect to login page if unauthorized
      } else {
        console.error("Error fetching teachers information :", error);
      }
    }
  };

  const getAllUsers = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token is missing. Please log in.");
      return;
    }
    try {
      const response = await axios.get("http://localhost:3000/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error("Unauthorized access. Redirecting to login...");
        window.location.href = "/login"; // Redirect to login page if unauthorized
      } else {
        console.error("Error fetching users information :", error);
      }
    }
  };

  const handleDelete = async (entity: unknown, id: string | number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token is missing. Please log in.");
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(` ID: ${id} has been deleted successfully.`);
      // Refresh the data after deletion
      if (entity === "courses") getAllCourses();
      if (entity === "users/teachers") getAllTeachers();
      if (entity === "users/all") getAllUsers();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error("Unauthorized access. Redirecting to login...");
        window.location.href = "/login";
      } else {
        console.error("Error:", error);
      }
    }
  };


  
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <button onClick={getAllCourses}>Get All Courses</button>
        <button onClick={getAllTeachers}>Get All Teachers</button>
        <button onClick={getAllUsers}>Get All Users</button>
      </div>
      <div>
        <h2>All Courses</h2>
        <CardLayout
          data={allCourses}
          entity="courses"
          onDelete={handleDelete}
        />
        <h2>All Teachers</h2>
        <CardLayout
          data={allTeachers}
          entity="users/teachers"
          onDelete={handleDelete}
        />
        <h2>All Users</h2>
        <CardLayout
          data={allUsers}
          entity="users/all"
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};
const CardLayout = ({
  data,
  entity,
  onDelete,
}: {
  data: any[];
  entity: string;
  onDelete: (entity: string, id: string | number) => void;
}) => {
  return (
    <div style={styles.cardContainer}>
      {data && data.length > 0 ? (
        data.map((item) => (
          <div key={item.id} style={styles.card}>
            {/* Render the card content */}
            <h3 style={styles.cardTitle}>{item.title || item.name}</h3>
            <p style={styles.cardDescription}>
              {item.description || item.email}
            </p>
            <button
              onClick={() => onDelete(entity, item.id)}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p style={styles.noData}>No data available</p>
      )}
    </div>
  );
};

// Styles Object
const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    padding: "20px",
  },
  heading: {
    fontSize: "2rem",
    color: "#333",
    textAlign: "center" as "center", // Explicitly specifying the valid value
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "30px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  subheading: {
    fontSize: "1.5rem",
    color: "#333",
    marginBottom: "15px",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap" as "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    padding: "15px",
    width: "250px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  cardTitle: {
    fontSize: "1.25rem",
    color: "#333",
    marginBottom: "10px",
  },
  cardDescription: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "15px",
  },
  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "red",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  noData: {
    textAlign: "center" as "center", // Explicitly specifying the valid value
    color: "#777",
    fontSize: "1rem",
  },
};
export default AdminCourses;
