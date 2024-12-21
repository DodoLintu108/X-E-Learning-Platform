"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ManageCourses from "../../components/ManageCourses"; // Import shared component

const AdminCourses = () => {
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    getAllCourses();
  }, []);

  const getAllCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/courses/admin");
      setAllCourses(response.data);
    } catch (error) {
      console.error("Error fetching admin courses:", error);
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
