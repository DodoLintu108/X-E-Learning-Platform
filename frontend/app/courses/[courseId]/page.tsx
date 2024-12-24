"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../components/Navbar";
import courseAn from "../../../public/course.json";
import Lottie from "lottie-react";

/** 
 * A reusable modal component for showing analytics or other dialogs.
 * Adjust styling to your liking.
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          minWidth: "300px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            color: "red",
          }}
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

const CourseDetailsPage = ({ params }: { params: { courseId: string } }) => {
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedLecture, setExpandedLecture] = useState<number | null>(null);
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  const [notes, setNotes] = useState<string>("");
  const router = useRouter();
  const [teacherName, setTeacherName] = useState<any>(null);

  // Analytics states:
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [studentAverage, setStudentAverage] = useState<number | null>(null);
  const [courseAverage, setCourseAverage] = useState<number | null>(null);
  const [levelStats, setLevelStats] = useState<
    Record<string, { average: number; totalQuizzes: number }> | null
  >(null);

  // Load course details on mount
  useEffect(() => {
    const fetchData = async () => {
      const courseId = params.courseId;
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

  /**
   * Fetches full course details (title, category, lectures, etc.)
   */
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

      // Also fetch teacher user info
      try {
        const res = await axios.get(
          `http://localhost:3000/users/user/${response.data.teacherName}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTeacherName(res.data);
      } catch (error) {
        console.error("Error fetching teacher user info:", error);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Expand or collapse a lecture’s content
  const toggleLecture = (index: number) => {
    setExpandedLecture(expandedLecture === index ? null : index);
  };

  // Toggle notes sidebar
  const toggleNotes = () => {
    setIsNotesVisible(!isNotesVisible);
  };

  // Save notes to localStorage
  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = event.target.value;
    setNotes(newNotes);
    localStorage.setItem(`notes-${params.courseId}`, newNotes);
  };

  // Redirect to quizzes page for the course
  const handleQuizRedirect = () => {
    router.push(`/courses/${params.courseId}/student/quiz`);
  };

  // 1) Fetch the student’s average quiz score
  const handleViewStudentAnalytics = async () => {
    const token = localStorage.getItem("accessToken");
    const courseId = params.courseId;
    try {
      const response = await axios.get(
        `http://localhost:3000/analytics/student?courseId=${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Suppose the backend returns { averageScore: number }
      setStudentAverage(response.data.averageScore ?? 0);
    } catch (error) {
      console.error("Error fetching student analytics:", error);
    }
  };

  // 2) Fetch the course-wide average quiz score
  const handleViewCourseAnalytics = async () => {
    const token = localStorage.getItem("accessToken");
    const courseId = params.courseId;
    try {
      const response = await axios.get(
        `http://localhost:3000/analytics/course?courseId=${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Suppose the backend returns { average, levelStats }
      setCourseAverage(response.data.average);
      setLevelStats(response.data.levelStats);
    } catch (error) {
      console.error("Error fetching course analytics:", error);
    }
  };

  // Combined handler: fetch both student and course analytics
  const handleViewAnalytics = async () => {
    await handleViewStudentAnalytics();
    await handleViewCourseAnalytics();
    setIsAnalyticsOpen(true);
  };

  if (loading) {
    return <p>Loading course details...</p>;
  }

  return (
    <div>
      <Navbar />

      {/* Main Container */}
      <div
        style={{
          padding: "20px",
          marginRight: isNotesVisible ? "300px" : "0",
          transition: "margin-right 0.3s ease",
        }}
      >
        <div style={{ marginRight: "10px" }}>
          <Lottie className="h-44" animationData={courseAn} />
        </div>

        <h1>
          <strong>Title:</strong> {courseDetails?.title}
        </h1>
        <p>
          <strong>Description:</strong> {courseDetails?.description}
        </p>
        <p>
          <strong>Category:</strong> {courseDetails?.category}
        </p>
        <p>
          <strong>Difficulty:</strong> {courseDetails?.difficultyLevel}
        </p>
        <p>
          <strong>Created By:</strong> {teacherName?.name}
        </p>

        {/* Buttons Row */}
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={handleQuizRedirect}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Go to Quizzes and Assessments
          </button>

          <button
            onClick={toggleNotes}
            style={{
              padding: "10px 20px",
              backgroundColor: isNotesVisible ? "#FF5722" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            {isNotesVisible ? "Close Notes" : "Open Notes"}
          </button>

          {/* "View Analytics" Button */}
          <button
            onClick={handleViewAnalytics}
            style={{
              padding: "10px 20px",
              backgroundColor: "#9C27B0",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            View Analytics
          </button>
        </div>

        <h2>Lectures</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {courseDetails?.lectures?.map((lecture: any, index: number) => (
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
                      src={lecture.content.replace("watch?v=", "embed/")}
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
          }}
        >
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

      {/* Analytics Modal */}
      <Modal isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)}>
        <h2 style={{ marginTop: 0 }}>Your Analytics</h2>
        {studentAverage !== null ? (
          <p>
            Your Average Quiz Score: <strong>{studentAverage.toFixed(2)}</strong>
          </p>
        ) : (
          <p>Loading your average...</p>
        )}

        <h2 style={{ marginBottom: "5px" }}>Course Analytics</h2>
        {courseAverage !== null ? (
          <>
            <p>
              Course Average: <strong>{courseAverage.toFixed(2)}</strong>
            </p>
            {levelStats && Object.keys(levelStats).length > 0 ? (
              <ul>
                {Object.entries(levelStats).map(([level, stats]) => (
                  <li key={level}>
                    <strong>{level}</strong>: Average{" "}
                    {stats.average.toFixed(2)} ({stats.totalQuizzes} quizzes
                    submitted)
                  </li>
                ))}
              </ul>
            ) : (
              <p>No level breakdown available.</p>
            )}
          </>
        ) : (
          <p>Loading course average...</p>
        )}
      </Modal>
    </div>
  );
};

export default CourseDetailsPage;
