"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link"; // Import Link from Next.js
import "react-toastify/dist/ReactToastify.css";
import "../../globals.css";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficultyLevel: string;
  courseImage?: string;
  enrolled: boolean; // Used to differentiate between enrolled and available
}

const StudentPage = () => {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem("accessToken"); // Assuming JWT token is stored in localStorage
    setLoading(true);

    try {
      const response = await axios.get("http://localhost:3000/courses/student", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { assigned, available } = response.data;
      setEnrolledCourses(assigned);
      setAvailableCourses(available);
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
    return <p>No courses available or you are not enrolled in any courses yet.</p>;
  }

    return (
        <div>
            <Navbar />
            <ToastContainer />
            <div style={{ padding: "20px" }}>
                <h1 style={{ marginBottom: "20px" }}>Welcome, Student</h1>

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
                                }}
                            >
                                <img
                                    src={course.courseImage || "default-image.jpg"}
                                    alt={course.title}
                                    style={{
                                        width: "100%",
                                        height: "150px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        marginBottom: "10px",
                                    }}
                                />
                                <h3>{course.title}</h3>
                                <p>{course.description}</p>
                                <p>Category: {course.category}</p>
                                <p>Difficulty: {course.difficultyLevel}</p>
                                {/* Replace button with a Link component */}
                                <Link
                                    href={`/courses/${course._id}`} // Update to match your folder structure
                                    passHref
                                >
                                    <button
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#007BFF",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        View Details
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You are not enrolled in any courses yet.</p>
                )}

                <h2 style={{ marginTop: "40px" }}>Available Courses</h2>
                {availableCourses.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                        {availableCourses.map((course) => (
                            <div
                                key={course._id}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "20px",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                    maxWidth: "300px",
                                }}
                            >
                                <img
                                    src={course.courseImage || "default-image.jpg"}
                                    alt={course.title}
                                    style={{
                                        width: "100%",
                                        height: "150px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        marginBottom: "10px",
                                    }}
                                />
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
                                    }}
                                >
                                    Enroll
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No courses available for enrollment.</p>
                )}
            </div>
        </div>
    );
};


export default StudentPage;

