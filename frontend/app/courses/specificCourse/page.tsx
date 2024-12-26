"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useParams } from "next/navigation";

const CourseDetailsPage = () => {
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const courseId = params.courseId;
  console.log(params);
  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const fetchCourseDetails = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(
        `http://localhost:3000/courses/${courseId}/details`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourseDetails(response.data);
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading course details...</p>;
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>{courseDetails.title}</h1>
        <p>{courseDetails.description}</p>
        <p>Category: {courseDetails.category}</p>
        <p>Difficulty: {courseDetails.difficultyLevel}</p>
        <p>Created By: {courseDetails.teacherName}</p>
        <h2>Lectures</h2>
        <ul>
          {courseDetails.lectures.map((lecture: any, index: number) => (
            <li key={index}>
              <h3>{lecture.title}</h3>
              <p>Type: {lecture.type}</p>
              <p>Content: {lecture.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
