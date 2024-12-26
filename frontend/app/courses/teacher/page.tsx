"use client";
import Lottie from "lottie-react";
import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Navbar from "../../components/Navbar";
import "../../globals.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Underline } from "lucide-react";
import courseAn from "../../../public/course.json";

// Interfaces
interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficultyLevel: string;
  courseImage: File | null;
  courseMaterial: File | null;

  lectures: Lecture[]; // Include lectures
  isEnded: boolean; // Indicates if the course has ended
}

interface Lecture {
  title: string;
  type: "video" | "pdf"; // Determines if it's a video or PDF
  content: string; // Either YouTube link or PDF URL
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface ErrorResponse {
  message: string; // Define the shape of your error response
}

// Modal component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
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
      }}>
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          minWidth: "500px",
          position: "relative",
        }}>
        <button
          onClick={onClose}
          style={{
            background: "white",
            color: "red",
            border: "none",
            width: "80px",
            height: "40px",
            borderRadius: "5px",
            cursor: "pointer",
            position: "absolute",
            top: "10px",
            right: "10px",
          }}>
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

const TeacherCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Create course modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit course modal
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false); // Add lecture modal
  const [isViewLectureModalOpen, setIsViewLectureModalOpen] = useState(false); // View lectures modal
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false); // Quiz modal
  const [expandedLecture, setExpandedLecture] = useState<string | null>(null); // Track expanded lecture
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery]);
  const handleSearch = async (query: string) => {
    const token = localStorage.getItem("accessToken");

    if (!query) {
      setCourses([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/courses/search?query=${searchQuery}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setCourses(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        toast.error(
          "No courses Available!",
          error.response?.data || error.message
        );
        if (statusCode === 401) {
          toast.error("Session expired. Redirecting to Login...");
          window.location.href = "/Login";
          return;
        }
      } else {
        console.error("Error:", error);
        toast.error("Error Occured!");
      }
    }
  };
  const [newQuiz, setNewQuiz] = useState({
    level: "Beginner",
    questions: [
      {
        question: "",
        options: ["", "", "", ""], // Four options
        correctAnswer: 0, // Index of correct answer
      },
    ],
  });

  const [newCourse, setNewCourse] = useState<{
    title: string;
    description: string;
    category: string;
    difficultyLevel: string;
    courseImage: File | null;
    courseMaterial: File | null;
    rating: number;
  }>({
    title: "",
    description: "",
    category: "Select Course Category",
    difficultyLevel: "Select Difficulty Level",
    courseImage: null,
    courseMaterial: null,
    rating: 0.0,
  });

  const [newLecture, setNewLecture] = useState<Lecture>({
    title: "",
    type: "video",
    content: "",
  });

  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  const fetchTeacherCourses = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        "http://localhost:3000/courses/teacher",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Error fetching courses.");
    }
  };

  const handleCreateCourse = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.post("http://localhost:3000/courses/create", newCourse, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course created successfully!");
      fetchTeacherCourses();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Error creating course.");
    }
  };

  const handleEditCourse = async () => {
    const token = localStorage.getItem("accessToken");
    if (!selectedCourse) return;

    try {
      await axios.put(
        `http://localhost:3000/courses/${selectedCourse._id}`,
        selectedCourse,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Course updated successfully!");
      fetchTeacherCourses();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error editing course:", error);
      toast.error("Error editing course.");
    }
  };
  const handleViewQuizAnalytics = async (quizId: string) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(
        `http://localhost:3000/analytics/quiz?quizId=${quizId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { data } = response;
      toast.success(`Quiz Average: ${data.averageQuizScore}`);
    } catch (error) {
      console.error("Error fetching quiz analytics:", error);
      toast.error("Error fetching quiz analytics.");
    }
  };
  interface LevelStats {
    [level: string]: {
      totalQuizzes: number;
      average: number;
    };
  }

  const handleEndCourse = async (courseId: string) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.put(
        `http://localhost:3000/courses/${courseId}/end`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Course has been ended successfully!");
      fetchTeacherCourses(); // Refresh courses to reflect the updated status
    } catch (error) {
      console.error("Error ending the course:", error);
      toast.error("Failed to end the course. Please try again.");
    }
  };

  const handleViewCourseAnalytics = async (courseId: string) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(
        `http://localhost:3000/analytics/course?courseId=${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data: { average: number; levelStats: LevelStats } = response.data;

      const levelStats = Object.entries(data.levelStats)
        .map(
          ([level, stats]) =>
            `${level}: ${
              stats.totalQuizzes
            } quizzes, Average: ${stats.average.toFixed(2)}`
        )
        .join("\n");

      toast.success(
        `Course Average: ${data.average.toFixed(
          2
        )}\nLevel Breakdown:\n${levelStats}`
      );
    } catch (error) {
      console.error("Error fetching course analytics:", error);
      toast.error("Error fetching course analytics.");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    const token = localStorage.getItem("accessToken");

    try {
      await axios.delete(`http://localhost:3000/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course deleted successfully!");
      fetchTeacherCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Error deleting course.");
    }
  };

  const handleAddLecture = async () => {
    if (!selectedCourse) {
      toast.error("No course selected!");
      return;
    }
    const handleEndCourse = async (courseId: string) => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.put(
          `http://localhost:3000/courses/${courseId}/end`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Course has been ended successfully!");
        fetchTeacherCourses(); // Refresh courses to reflect the updated status
      } catch (error) {
        console.error("Error ending the course:", error);
        toast.error("Failed to end the course. Please try again.");
      }
    };

    const handleAddQuiz = async () => {
      if (!selectedCourse) {
        toast.error("No course selected!");
        return;
      }

      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.post(
          `http://localhost:3000/courses/${selectedCourse._id}/quizzes`,
          newQuiz, // Send the quiz data
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success("Quiz added successfully!");
        setIsQuizModalOpen(false); // Close modal
        setNewQuiz({
          level: "Beginner",
          questions: [
            { question: "", options: ["", "", "", ""], correctAnswer: 0 },
          ],
        });

        // Optionally, refresh course list or quiz list
        fetchTeacherCourses();
      } catch (error: any) {
        console.error("Error adding quiz:", error);
        toast.error(
          error.response?.data?.message ||
            "Error adding quiz. Please try again."
        );
      }
    };
    const token = localStorage.getItem("accessToken");
    const toggleLectureContent = (lectureTitle: string) => {
      setExpandedLecture(
        expandedLecture === lectureTitle ? null : lectureTitle
      );
    };
    try {
      await axios.post(
        `http://localhost:3000/courses/${selectedCourse._id}/lectures`,
        {
          title: newLecture.title,
          type: newLecture.type,
          content: newLecture.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Lecture added successfully!");
      setIsLectureModalOpen(false);
      setNewLecture({ title: "", type: "video", content: "" });

      fetchTeacherCourses(); // Optionally refresh courses
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error adding lecture:", error);
      toast.error(
        error.response?.data?.message ||
          "Error adding lecture. Please try again."
      );
    }
  };

  const toggleLectureContent = (lectureTitle: string) => {
    setExpandedLecture(expandedLecture === lectureTitle ? null : lectureTitle);
  };

  const handleAddQuiz = async () => {
    if (!selectedCourse) {
      toast.error("No course selected!");
      return;
    }

    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        `http://localhost:3000/courses/${selectedCourse._id}/quizzes`,
        newQuiz, // The newQuiz object containing questions, level, etc.
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Quiz added successfully!");
      setIsQuizModalOpen(false); // Close the quiz modal
      setNewQuiz({
        level: "Beginner", // Reset to default level
        questions: [], // Clear questions after submission
      });

      fetchTeacherCourses(); // Optionally refresh courses to reflect the new quiz
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error adding quiz:", error);
      toast.error(
        error.response?.data?.message || "Error adding quiz. Please try again."
      );
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginTop: "40px",
          alignItems: "center",
          gap: "8px",
        }}>
        <h1
          style={{
            color: "#7F8081",
            fontSize: "28px",
          }}>
          Manage Your Courses
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            marginTop: "40px",
            alignItems: "start",
            gap: "8px",
            padding: "18px",
          }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}>
            <button
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#7AB2D3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginLeft: "25px",
              }}
              onClick={() => setIsModalOpen(true)}>
              Create Course
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              border: "2px solid #7F8081",
              padding: "9px",
              borderRadius: "4px",
              width: "100%",
            }}>
            <input
              style={{
                width: "20%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for courses..."
            />

            <ul style={{ listStyleType: "none", padding: 0 }}>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <li>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "13px",
                      }}>
                      <div
                        key={course._id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "9px",
                          borderRadius: "4px",
                          border: "1px solid #7F8081",
                          boxShadow: "1px 4px 6px rgba(0, 0, 0, 0.5)",
                          cursor: "pointer",
                          transition: "transform 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "scale(1.02)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }>
                        <div style={{ marginRight: "10px" }}>
                          <Lottie className="h-44" animationData={courseAn} />
                        </div>
                        <div
                          onClick={() =>
                            (window.location.href = `/courses/specificCourse/?courseId=${course._id}`)
                          }
                          onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.02)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                          style={{
                            flex: "1",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: "5px",
                            paddingLeft: "10px",
                            maxWidth: "500px",
                            cursor: "pointer",
                            transition: "transform 0.2s",
                          }}>
                          <h3
                            style={{
                              margin: 0,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}>
                            Title: {course.title}
                          </h3>
                          <p
                            style={{
                              margin: 0,
                              whiteSpace: "normal",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "400px",
                            }}>
                            Description: {course.description}
                          </p>

                          <p style={{ margin: 0 }}>
                            Category: {course.category}
                          </p>
                          <p style={{ margin: 0 }}>
                            Level: {course.difficultyLevel}
                          </p>
                        </div>
                        <div className=" flex flex-row">
                          <button
                            onClick={() =>
                              handleViewCourseAnalytics(course._id)
                            }
                            style={{
                              padding: "10px 15px",
                              backgroundColor: "#9AA6B2",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              textDecoration: "underline",
                              cursor: "pointer",
                              marginRight: "10px",
                            }}>
                            View Course Analytics
                          </button>
                          <button
                            onClick={() => handleEndCourse(course._id)}
                            style={{
                              padding: "10px 15px",
                              backgroundColor: "#9AA6B2",
                              color: "white",
                              textDecoration: "underline",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                              marginRight: "10px",
                            }}
                            disabled={course.isEnded}>
                            {course.isEnded ? "Course Ended" : "End Course"}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setIsEditModalOpen(true);
                            }}
                            style={{
                              marginRight: "10px",
                              padding: "10px 15px",
                              backgroundColor: "#9AA6B2",
                              color: "white",
                              textDecoration: "underline",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}>
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setIsQuizModalOpen(true);
                            }}
                            style={{
                              padding: "10px 15px",
                              backgroundColor: "#9AA6B2",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                              textDecoration: "underline",
                              marginRight: "10px",
                            }}>
                            Add Quiz
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            style={{
                              padding: "10px 15px",
                              backgroundColor: "#9AA6B2",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              textDecoration: "underline",
                              cursor: "pointer",
                              marginRight: "10px",
                            }}>
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setIsLectureModalOpen(true);
                            }}
                            style={{
                              padding: "10px 15px",
                              backgroundColor: "#9AA6B2",
                              color: "white",
                              border: "none",
                              textDecoration: "underline",
                              borderRadius: "5px",
                              cursor: "pointer",
                              marginRight: "10px",
                            }}>
                            Add Lecture
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setIsViewLectureModalOpen(true);
                            }}
                            style={{
                              padding: "10px 15px",
                              backgroundColor: "#9AA6B2",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}>
                            View Lectures
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p>No courses available</p>
              )}
            </ul>
          </div>
        </div>{" "}
      </div>

      {/* Create Course Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "9px",
            borderRadius: "4px",
          }}>
          <input
            type="text"
            value={newCourse.title}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            onChange={(e) =>
              setNewCourse({ ...newCourse, title: e.target.value })
            }
            placeholder="Title"
          />
          <textarea
            value={newCourse.description}
            onChange={(e) =>
              setNewCourse({ ...newCourse, description: e.target.value })
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            placeholder="Description"></textarea>
          <select
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            value={newCourse.category}
            onChange={(e) =>
              setNewCourse({ ...newCourse, category: e.target.value })
            }>
            <option value="Select Course Category" disabled>
              Select Course Category
            </option>
            <option value="Mathematics">Mathematics</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
          </select>
          <select
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            value={newCourse.difficultyLevel}
            onChange={(e) =>
              setNewCourse({ ...newCourse, difficultyLevel: e.target.value })
            }>
            <option value="Select Difficulty Level" disabled>
              Select Difficulty Level
            </option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <button
          style={{
            width: "85%",
            padding: "4px 5px",
            backgroundColor: "#7AB2D3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginLeft: "25px",
            marginTop: "-15px",
          }}
          onClick={handleCreateCourse}>
          submit
        </button>
      </Modal>
      {/* Edit Course Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Edit Course</h2>
        {selectedCourse && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "9px",
                borderRadius: "4px",
              }}>
              <input
                type="text"
                value={selectedCourse.title}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                onChange={(e) =>
                  setSelectedCourse({
                    ...selectedCourse,
                    title: e.target.value,
                  })
                }
                placeholder="Title"
              />
              <textarea
                value={selectedCourse.description}
                onChange={(e) =>
                  setSelectedCourse({
                    ...selectedCourse,
                    description: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                placeholder="Description"></textarea>
              <select
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "20px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                value={selectedCourse.category}
                onChange={(e) =>
                  setSelectedCourse({
                    ...selectedCourse,
                    category: e.target.value,
                  })
                }>
                <option value="Select Course Category" disabled>
                  Select Course Category
                </option>
                <option value="Mathematics">Mathematics</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
              <select
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "20px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                value={selectedCourse?.difficultyLevel}
                onChange={(e) =>
                  setSelectedCourse({
                    ...selectedCourse,
                    difficultyLevel: e.target.value,
                  })
                }>
                <option value="Select Difficulty Level" disabled>
                  Select Difficulty Level
                </option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <button
              style={{
                width: "85%",
                padding: "4px 5px",
                backgroundColor: "#7AB2D3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginLeft: "25px",
                marginTop: "-15px",
              }}
              onClick={handleEditCourse}>
              submit
            </button>
          </>
        )}
      </Modal>
      {/* Add Lecture Modal */}
      <Modal
        isOpen={isLectureModalOpen}
        onClose={() => setIsLectureModalOpen(false)}>
        <h2>Add Lecture to {selectedCourse?.title}</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "9px",
            borderRadius: "4px",
          }}>
          <input
            type="text"
            placeholder="Lecture Title"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            value={newLecture.title}
            onChange={(e) =>
              setNewLecture({ ...newLecture, title: e.target.value })
            }
          />
          <select
            value={newLecture.type}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            onChange={(e) =>
              setNewLecture({
                ...newLecture,
                type: e.target.value as "video" | "pdf",
              })
            }>
            <option value="video">YouTube Video</option>
            <option value="pdf">PDF</option>
          </select>
          {newLecture.type === "video" ? (
            <input
              type="text"
              placeholder="YouTube Link"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              value={newLecture.content}
              onChange={(e) =>
                setNewLecture({ ...newLecture, content: e.target.value })
              }
            />
          ) : (
            <input
              type="file"
              accept="application/pdf"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              onChange={(e) =>
                e.target.files &&
                setNewLecture({
                  ...newLecture,
                  content: URL.createObjectURL(e.target.files[0]),
                })
              }
            />
          )}
        </div>

        <button
          onClick={handleAddLecture}
          style={{
            width: "85%",
            padding: "4px 5px",
            backgroundColor: "#7AB2D3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginLeft: "25px",
            marginTop: "-15px",
          }}>
          Add Lecture
        </button>
      </Modal>

      {/* Add Quiz Modal */}
      <Modal isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)}>
        <h2>Add Quiz to {selectedCourse?.title}</h2>

        <div
          style={{
            maxHeight: "400px", // Set a maximum height for the scrollable area
            overflowY: "auto", // Enable vertical scrolling
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}>
          {/* Quiz Level */}
          <label>
            Select Level:
            <select
              value={newQuiz.level}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, level: e.target.value })
              }
              style={{
                display: "block",
                margin: "10px 0",
                padding: "8px",
                borderRadius: "4px",
                width: "100%",
              }}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </label>

          {/* Questions */}
          <h3>Questions</h3>
          {newQuiz.questions.map((q, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}>
              <input
                type="text"
                placeholder={`Question ${idx + 1}`}
                value={q.question}
                onChange={(e) =>
                  setNewQuiz({
                    ...newQuiz,
                    questions: newQuiz.questions.map((question, i) =>
                      i === idx
                        ? { ...question, question: e.target.value }
                        : question
                    ),
                  })
                }
                style={{
                  display: "block",
                  marginBottom: "10px",
                  padding: "8px",
                  borderRadius: "4px",
                  width: "100%",
                }}
              />

              {/* Options */}
              {q.options.map((option, optIdx) => (
                <input
                  key={optIdx}
                  type="text"
                  placeholder={`Option ${optIdx + 1}`}
                  value={option}
                  onChange={(e) =>
                    setNewQuiz({
                      ...newQuiz,
                      questions: newQuiz.questions.map((question, i) =>
                        i === idx
                          ? {
                              ...question,
                              options: question.options.map((opt, j) =>
                                j === optIdx ? e.target.value : opt
                              ),
                            }
                          : question
                      ),
                    })
                  }
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    padding: "8px",
                    borderRadius: "4px",
                    width: "100%",
                  }}
                />
              ))}

              {/* Correct Answer */}
              <label>
                Correct Answer:
                <select
                  value={q.correctAnswer}
                  onChange={(e) =>
                    setNewQuiz({
                      ...newQuiz,
                      questions: newQuiz.questions.map((question, i) =>
                        i === idx
                          ? {
                              ...question,
                              correctAnswer: parseInt(e.target.value),
                            }
                          : question
                      ),
                    })
                  }
                  style={{
                    display: "block",
                    marginTop: "5px",
                    padding: "8px",
                    borderRadius: "4px",
                    width: "100%",
                  }}>
                  {q.options.map((_, optIdx) => (
                    <option key={optIdx} value={optIdx}>
                      Option {optIdx + 1}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </div>

        {/* Add Question */}
        <button
          onClick={() =>
            setNewQuiz({
              ...newQuiz,
              questions: [
                ...newQuiz.questions,
                { question: "", options: ["", "", "", ""], correctAnswer: 0 },
              ],
            })
          }
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}>
          Add Question
        </button>

        {/* Submit Quiz */}
        <button
          onClick={handleAddQuiz}
          style={{
            padding: "10px 15px",
            backgroundColor: "#FF5722",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}>
          Submit Quiz
        </button>
      </Modal>
      {/* View Lectures Modal */}
      <Modal
        isOpen={isViewLectureModalOpen}
        onClose={() => setIsViewLectureModalOpen(false)}>
        <h2>Lectures for {selectedCourse?.title}</h2>
        <ul>
          {selectedCourse?.lectures.map((lecture, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              {/* Clickable Lecture Title */}
              <span
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
                onClick={() => toggleLectureContent(lecture.title)}>
                {lecture.title}
              </span>

              {/* Expanded Content */}
              {expandedLecture === lecture.title && (
                <div style={{ marginTop: "10px" }}>
                  {lecture.type === "video" ? (
                    <iframe
                      width="100%"
                      height="315"
                      src={lecture.content.replace("watch?v=", "embed/")}
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title={lecture.title}></iframe>
                  ) : (
                    <iframe
                      src={lecture.content}
                      width="100%"
                      height="500"
                      style={{
                        border: "1px solid #ccc",
                        marginTop: "10px",
                        borderRadius: "5px",
                      }}
                      title={lecture.title}></iframe>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default TeacherCourses;
