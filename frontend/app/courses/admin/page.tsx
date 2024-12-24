"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ManageCourses from "../../components/ManageCourses";

const AdminCourses = () => {
  const [allCourses, setAllCourses] = useState([]);

  
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
  

  return (
    <ManageCourses
      title="Admin Courses"
      allCourses={allCourses}
      fetchCourses={getAllCourses}
      showCreate={true}
      showEdit={true}
      showDelete={true}
    />
  );
};

export default AdminCourses;

