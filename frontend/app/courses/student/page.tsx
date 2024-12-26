"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link"; // Import Link from Next.js
import "react-toastify/dist/ReactToastify.css";
import "../../globals.css";
import courseAn from "../../../public/course.json";
import Lottie from "lottie-react";
interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficultyLevel: string;
  courseImage?: string;
  enrolled: boolean; // Used to differentiate between enrolled and available
  teacherName: string; // Assuming teacherName is returned in the course object
  isEnded: boolean; // Indicates whether the course has ended
}

const StudentPage = () => {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]); // To store filtered results
  const [searchQuery, setSearchQuery] = useState(""); // To handle search input
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    // Filter availableCourses based on the search query
    if (searchQuery.trim() === "") {
      setFilteredCourses(availableCourses);
    } else {
      const filtered = availableCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) //||
        //course.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, availableCourses]);

  const fetchCourses = async () => {
    const token = localStorage.getItem("accessToken"); // Assuming JWT token is stored in localStorage
    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:3000/courses/student",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { assigned, available } = response.data;
      setEnrolledCourses(assigned);
      setAvailableCourses(available);
      setFilteredCourses(available); // Set initially filtered courses
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    const token = localStorage.getItem("accessToken");

    try {
      await axios.post(
        `http://localhost:3000/courses/${courseId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Successfully enrolled in the course!");
      fetchCourses(); // Refresh the course list after enrollment
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Failed to enroll in the course.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Loading courses...</p>
        <div className="spinner" />
      </div>
    );
  }

  if (!enrolledCourses.length && !availableCourses.length && !loading) {
    return (
      <p>No courses available or you are not enrolled in any courses yet.</p>
    );
  }

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div style={{ padding: "20px" }}>
        <h1 style={{ marginBottom: "20px" }}>Welcome, Student</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search courses by name or teacher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginBottom: "20px",
          }}
        />

        <h2>Your Enrolled Courses</h2>
        {enrolledCourses.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {enrolledCourses.map((course) => (
              <div
                key={course._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  maxWidth: "300px",
                }}>
                <div style={{ marginRight: "10px" }}>
                  <Lottie className="h-44" animationData={courseAn} />
                </div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p>Category: {course.category}</p>
                <p>Difficulty: {course.difficultyLevel}</p>

                {/* Check if the course has ended */}
                {course.isEnded ? (
                  <div
                    style={{
                      backgroundColor: "#E8F5E9",
                      padding: "15px",
                      borderRadius: "8px",
                      marginTop: "10px",
                      textAlign: "center",
                      color: "#4CAF50",
                      fontWeight: "bold",
                    }}>
                    🎉 Congratulations on completing this course! 🎉
                  </div>
                ) : (
                  <Link href={`/courses/${course._id}`} passHref>
                    <button
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}>
                      View Details
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>You are not enrolled in any courses yet.</p>
        )}

        <h2 style={{ marginTop: "40px" }}>Available Courses</h2>
        {filteredCourses.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  maxWidth: "300px",
                }}>
                <div style={{ marginRight: "10px" }}>
                  <Lottie className="h-44" animationData={courseAn} />
                </div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p>Category: {course.category}</p>
                <p>Difficulty: {course.difficultyLevel}</p>

                <button
                  onClick={() => enrollInCourse(course._id)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}>
                  Enroll
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No courses match your search query.</p>
        )}
      </div>
    </div>
  );
};

export default StudentPage;
