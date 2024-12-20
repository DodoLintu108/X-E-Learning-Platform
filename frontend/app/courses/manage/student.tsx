"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ManageCourses from "../../components/ManageCourses";

const StudentCourses = () => {
  const [studentCourses, setStudentCourses] = useState([]);

  useEffect(() => {
    getStudentCourses();
  }, []);

  const getStudentCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/courses/student");
      setStudentCourses(response.data);
    } catch (error) {
      console.error("Error fetching student courses:", error);
    }
  };

  return (
    <ManageCourses
      title="Student Courses"
      allCourses={studentCourses}
      fetchCourses={getStudentCourses}
      showCreate={false}
      showEdit={false}
      showDelete={false}
      allowEnroll={true} // Additional prop for enrolling
    />
  );
};

export default StudentCourses;
