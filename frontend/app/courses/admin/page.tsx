"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showCourses, setShowCourses] = useState(false);
  const [showTeachers, setShowTeachers] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Check if access token and role exist in local storage
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      alert("Access token or role is missing. Redirecting to home...");
      router.push("/"); // Redirect to home page
    }
  }, [router]);

  const toggleData = async (
    entity: string,
    setData: React.Dispatch<React.SetStateAction<any[]>>,
    toggle: boolean,
    setToggle: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!toggle) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Access token is missing. Please log in.");
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3000/${entity}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (error) {
        handleAuthError(error);
      }
    } else {
      setData([]); // Clear the data to hide
    }
    setToggle(!toggle);
  };

  const handleAuthError = (error: any) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error("Unauthorized access. Redirecting to login...");
      router.push("/"); // Redirect to home page
    } else {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (entity: string, id: string | number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token is missing. Please log in.");
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/${entity}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`${entity.slice(0, -1).toUpperCase()} with ID: ${id} deleted successfully.`);
      // Refresh the respective data
      if (entity === "courses/all") toggleData("courses/all", setAllCourses, false, setShowCourses);
      if (entity === "users/teachers") toggleData("users/teachers", setAllTeachers, false, setShowTeachers);
      if (entity === "users/students") toggleData("users/students", setAllStudents, false, setShowStudents);
      if (entity === "users/all") toggleData("users/all", setAllUsers, false, setShowUsers);
    } catch (error) {
      handleAuthError(error);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Admin Dashboard</h1>
      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => toggleData("courses/all", setAllCourses, showCourses, setShowCourses)}
        >
          {showCourses ? "Hide Courses" : "Get All Courses"}
        </button>
        <button
          style={styles.button}
          onClick={() => toggleData("users/teachers", setAllTeachers, showTeachers, setShowTeachers)}
        >
          {showTeachers ? "Hide Teachers" : "Get All Teachers"}
        </button>
        <button
          style={styles.button}
          onClick={() => toggleData("users/students", setAllStudents, showStudents, setShowStudents)}
        >
          {showStudents ? "Hide Students" : "Get All Students"}
        </button>
        <button
          style={styles.button}
          onClick={() => toggleData("users/all", setAllUsers, showUsers, setShowUsers)}
        >
          {showUsers ? "Hide Users" : "Get All Users"}
        </button>
      </div>
      <div>
        {showCourses && (
          <div>
            <h2 style={styles.subheading}>All Courses</h2>
            <CardLayout data={allCourses} entity="courses/all" onDelete={handleDelete} />
          </div>
        )}
        {showTeachers && (
          <div>
            <h2 style={styles.subheading}>All Teachers</h2>
            <CardLayout data={allTeachers} entity="users/teachers" onDelete={handleDelete} />
          </div>
        )}
        {showStudents && (
          <div>
            <h2 style={styles.subheading}>All Students</h2>
            <CardLayout data={allStudents} entity="users/students" onDelete={handleDelete} />
          </div>
        )}
        {showUsers && (
          <div>
            <h2 style={styles.subheading}>All Users</h2>
            <CardLayout data={allUsers} entity="users/all" onDelete={handleDelete} />
          </div>
        )}
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
              {item.description || item.email || item.role}
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

export default AdminDashboard;


