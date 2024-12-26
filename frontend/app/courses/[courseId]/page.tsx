"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import the router for navigation
import axios from "axios";
import Navbar from "../../components/Navbar";
import courseAn from "../../../public/course.json";
import Lottie from "lottie-react";

const CourseDetailsPage = ({ params }: { params: { courseId: string } }) => {
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedLecture, setExpandedLecture] = useState<number | null>(null); // Track expanded lecture
  const [isNotesVisible, setIsNotesVisible] = useState(false); // State for sidebar toggle
  const [notes, setNotes] = useState<string>(""); // Notes content
  const router = useRouter(); // Use Next.js router
  const [teacherName, setTeacherName] = useState<any>(null); // Notes content

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params; // Await the params object
      const courseId = resolvedParams.courseId; // Access courseId after resolving

      if (courseId) {
        fetchCourseDetails(courseId);
        // Load saved notes from localStorage
        const savedNotes = localStorage.getItem(`notes-${courseId}`);
        if (savedNotes) {
          setNotes(savedNotes);
        }
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
      try {
        const res = await axios.get(
          `http://localhost:3000/users/user/${response.data.teacherName}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTeacherName(res.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLecture = (index: number) => {
    setExpandedLecture(expandedLecture === index ? null : index);
  };

  const toggleNotes = () => {
    setIsNotesVisible(!isNotesVisible); // Toggle visibility of the notes sidebar
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = event.target.value;
    setNotes(newNotes);
    localStorage.setItem(`notes-${params.courseId}`, newNotes); // Save notes specific to the course
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
      <div
        style={{
          padding: "20px",
          marginRight: isNotesVisible ? "300px" : "0", // Adjust margin when notes are visible
          transition: "margin-right 0.3s ease", // Smooth transition
        }}>
        <div style={{ marginRight: "10px" }}>
          <Lottie className="h-44" animationData={courseAn} />
        </div>
        <h1>
          <strong> Title :</strong> {courseDetails.title}
        </h1>
        <p>
          <strong> Description :</strong>
          {courseDetails.description}
        </p>
        <p>
          <strong> Category :</strong> {courseDetails.category}
        </p>
        <p>
          <strong>Difficulty:</strong>
          {courseDetails.difficultyLevel}
        </p>
        <p>
          <strong>Created By: </strong> {teacherName?.name}
        </p>

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
          }}>
          Go to Quizzes and Assessments
        </button>

        {/* Button to toggle Notes Sidebar */}
        <button
          onClick={toggleNotes}
          style={{
            padding: "10px 20px",
            backgroundColor: isNotesVisible ? "#FF5722" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
            marginLeft: "10px",
          }}>
          {isNotesVisible ? "Close Notes" : "Open Notes"}
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
                }}>
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
                  }}>
                  {lecture.type === "video" ? (
                    <iframe
                      width="100%"
                      height="315"
                      src={lecture.content.replace("watch?v=", "embed/")} // Ensure the YouTube URL is in embed format
                      title={lecture.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen></iframe>
                  ) : lecture.type === "pdf" ? (
                    <iframe
                      src={lecture.content}
                      width="100%"
                      height="600px"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                      title={lecture.title}></iframe>
                  ) : (
                    <p>Unsupported content type</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Notes Sidebar */}
      {isNotesVisible && (
        <div
          style={{
            position: "fixed",
            top: "0",
            right: "0",
            width: "300px",
            height: "100%",
            backgroundColor: "#f9f9f9",
            borderLeft: "1px solid #ccc",
            padding: "20px",
            boxShadow: "-2px 0px 5px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}>
          <h2>Notes</h2>
          <textarea
            style={{
              width: "100%",
              height: "80%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "14px",
              resize: "none",
            }}
            placeholder="Write your notes here..."
            value={notes}
            onChange={handleNoteChange}
          />
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;
