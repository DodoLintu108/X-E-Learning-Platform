"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import the router for navigation
import axios from "axios";
import Navbar from "../../components/Navbar";

const CourseDetailsPage = ({ params }: { params: { courseId: string } }) => {
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedLecture, setExpandedLecture] = useState<number | null>(null); // Track expanded lecture
  const router = useRouter(); // Use Next.js router

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params; // Await the params object
      const courseId = resolvedParams.courseId; // Access courseId after resolving

      if (courseId) {
        fetchCourseDetails(courseId);
      } else {
        console.error("Course ID not found in the URL");
      }
    };

    fetchData();
  }, []);

  const fetchCourseDetails = async (courseId: string) => {
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

  const toggleLecture = (index: number) => {
    setExpandedLecture(expandedLecture === index ? null : index);
  };

  const handleQuizRedirect = () => {
    router.push(`/courses/${params.courseId}/student/quiz`); // Redirect to the quiz page
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

        {/* Button to redirect to Quizzes and Assessments */}
        <button
          onClick={handleQuizRedirect}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Go to Quizzes and Assessments
        </button>

        <h2>Lectures</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {courseDetails.lectures.map((lecture: any, index: number) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <button
                onClick={() => toggleLecture(index)}
                style={{
                  width: "100%",
                  padding: "10px",
                  textAlign: "left",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {lecture.title}
              </button>
              {expandedLecture === index && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                  }}
                >
                  {lecture.type === "video" ? (
                    <iframe
                      width="100%"
                      height="315"
                      src={lecture.content.replace(
                        "watch?v=",
                        "embed/"
                      )} // Ensure the YouTube URL is in embed format
                      title={lecture.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : lecture.type === "pdf" ? (
                    <iframe
                      src={lecture.content}
                      width="100%"
                      height="600px"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                      title={lecture.title}
                    ></iframe>
                  ) : (
                    <p>Unsupported content type</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
