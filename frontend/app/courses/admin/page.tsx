"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ManageCourses from "../../components/ManageCourses";

const AdminCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
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
      setAllTeachers(response.data);
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

  const handleDelete = async (entity: string, courseId: string | number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token is missing. Please log in.");
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`ID: ${courseId} has been deleted successfully.`);
      // Refresh the data after deletion
      if (entity === "courses") getAllCourses();
      if (entity === "users/teachers") getAllTeachers();
      if (entity === "users/all") getAllUsers();
    } catch (error) {
      console.log(courseId);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error("Unauthorized access. Redirecting to login...");
        window.location.href = "/login";
      } else {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Admin Dashboard</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={getAllCourses}>
          Get All Courses
        </button>
        <button style={styles.button} onClick={getAllTeachers}>
          Get All Teachers
        </button>
        <button style={styles.button} onClick={getAllUsers}>
          Get All Users
        </button>
      </div>
      <div>
        <h2 style={styles.subheading}>All Courses</h2>
        <CardLayout data={allCourses} entity="courses" onDelete={handleDelete} />
        <h2 style={styles.subheading}>All Teachers</h2>
        <CardLayout
          data={allTeachers}
          entity="users/teachers"
          onDelete={handleDelete}
        />
        <h2 style={styles.subheading}>All Users</h2>
        <CardLayout data={allUsers} entity="users/all" onDelete={handleDelete} />
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
          <div key={item._id} style={styles.card}>
            <h3 style={styles.cardTitle}>{item.title || item.name}</h3>
            <p style={styles.cardDescription}>
              {item.description || item.email}
            </p>
            <button
              onClick={() => onDelete(entity, item._id)}
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

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    padding: "20px",
  },
  heading: {
    fontSize: "2rem",
    color: "#333",
    textAlign: "center" as const,
    marginBottom: "20px",
  },
  subheading: {
    fontSize: "1.5rem",
    color: "#444",
    textAlign: "center" as const,
    marginBottom: "15px",
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
  deleteButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "red",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap" as const,
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
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  cardDescription: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "15px",
  },
  noData: {
    textAlign: "center" as const,
    color: "#777",
    fontSize: "1rem",
  },
};



export default AdminCourses;
