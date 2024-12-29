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
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [studentGrades, setStudentGrades] = useState<Record<string, number>>(
    {}
  ); // To store grades for enrolled courses
  const [feedback, setFeedback] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourses(availableCourses);
    } else {
      const filtered = availableCourses.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, availableCourses]);

  const fetchCourses = async () => {
    const token = localStorage.getItem("accessToken");
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
      setFilteredCourses(available);

      // Fetch grades for enrolled courses
      const grades = await Promise.all(
        assigned.map(async (course: Course) => {
          try {
            const res = await axios.get(
              `http://localhost:3000/analytics/student?courseId=${course._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return { courseId: course._id, grade: res.data.averageScore || 0 };
          } catch (err) {
            console.error(`Error fetching grade for course ${course._id}:`, err);
            return { courseId: course._id, grade: null };
          }
        })
      );

      const gradesMap: Record<string, number> = {};
      grades.forEach((gradeData) => {
        gradesMap[gradeData.courseId] = gradeData.grade;
      });
      setStudentGrades(gradesMap);
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
      fetchCourses();
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Failed to enroll in the course.");
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedCourseId || !feedback.trim()) return;
    const token = localStorage.getItem("accessToken");

    try {
      await axios.post(
        `http://localhost:3000/courses/${selectedCourseId}/feedback`,
        { comment: feedback },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Feedback submitted successfully!");
      setSelectedCourseId(null);
      setFeedback("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback.");
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

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div style={{ padding: "20px" }}>
        <h1 style={{ marginBottom: "20px" }}>Welcome, Student</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search courses by name..."
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
                }}
              >
                <div style={{ marginRight: "10px" }}>
                  <Lottie className="h-44" animationData={courseAn} />
                </div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p>Category: {course.category}</p>
                <p>Difficulty: {course.difficultyLevel}</p>

                {course.isEnded ? (
                  <>
                    <p>
                      <strong>
                        Grade:{" "}
                        <span
                          style={{
                            color:
                              studentGrades[course._id] >= 50
                                ? "green"
                                : "red",
                          }}
                        >
                          {studentGrades[course._id]?.toFixed(2)}%
                        </span>{" "}
                        -{" "}
                        {studentGrades[course._id] >= 50
                          ? "Passed 🎉"
                          : "Failed 😞"}
                      </strong>
                    </p>
                    <button
                      onClick={() => setSelectedCourseId(course._id)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "10px",
                      }}
                    >
                      Submit Feedback
                    </button>
                  </>
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
                      }}
                    >
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
                }}
              >
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
                  }}
                >
                  Enroll
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No courses match your search query.</p>
        )}
      </div>

      {/* Feedback Modal */}
      {selectedCourseId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              minWidth: "400px",
            }}
          >
            <h2>Submit Feedback</h2>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
              rows={5}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <button
              onClick={handleSubmitFeedback}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
            <button
              onClick={() => {
                setSelectedCourseId(null);
                setFeedback("");
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "#FF5722",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPage;
