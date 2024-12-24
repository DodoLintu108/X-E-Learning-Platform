"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Navbar from "../../components/Navbar";
import "../../globals.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Interfaces
interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficultyLevel: string;
  lectures: Lecture[]; // Include lectures
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
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          minWidth: "500px",
          position: "relative",
        }}
      >
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
          }}
        >
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

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "Select Course Category",
    difficultyLevel: "Select Difficulty Level",
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
      const response = await axios.get("http://localhost:3000/courses/teacher", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    const handleAddQuiz = async () => {
        if (!selectedCourse) {
          toast.error("No course selected!");
          return;
        }
      
        const token = localStorage.getItem("accessToken");
        try {
          await axios.post(
            `http://localhost:3000/courses/${selectedCourse._id}/quizzes`,
            newQuiz,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
      
          toast.success("Quiz added successfully!");
          setIsQuizModalOpen(false);
          setNewQuiz({
            level: "Beginner",
            questions: [
              {
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
              },
            ],
          });
        } catch (err) {
          const error = err as AxiosError<{ message: string }>;
          console.error("Error adding quiz:", error);
          toast.error(
            error.response?.data?.message || "Error adding quiz. Please try again."
          );
        }
      };
    const token = localStorage.getItem("accessToken");
    const toggleLectureContent = (lectureTitle: string) => {
        setExpandedLecture(expandedLecture === lectureTitle ? null : lectureTitle);
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
        error.response?.data?.message || "Error adding lecture. Please try again."
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
      <h1>Teacher Courses</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#7AB2D3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Create Course
      </button>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {courses.length > 0 ? (
          courses.map((course) => (
            <li
              key={course._id}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                marginBottom: "10px",
                borderRadius: "5px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Category: {course.category}</p>
              <p>Difficulty: {course.difficultyLevel}</p>
              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setIsEditModalOpen(true);
                }}
                style={{
                  marginRight: "10px",
                  padding: "10px 15px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
  onClick={() => {
    setSelectedCourse(course);
    setIsQuizModalOpen(true);
  }}
  style={{
    padding: "10px 15px",
    backgroundColor: "#FF5722",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  }}
>
  Add Quiz
</button>
              <button
                onClick={() => handleDeleteCourse(course._id)}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#F44336",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setIsLectureModalOpen(true);
                }}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Add Lecture
              </button>
              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setIsViewLectureModalOpen(true);
                }}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#607D8B",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                View Lectures
              </button>
            </li>
          ))
        ) : (
          <p>No courses available</p>
        )}
      </ul>

      {/* Create Course Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Create New Course</h2>
        <input
          type="text"
          placeholder="Title"
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newCourse.description}
          onChange={(e) =>
            setNewCourse({ ...newCourse, description: e.target.value })
          }
        ></textarea>
        <select
          value={newCourse.category}
          onChange={(e) =>
            setNewCourse({ ...newCourse, category: e.target.value })
          }
        >
          <option disabled>Select Course Category</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
        </select>
        <select
          value={newCourse.difficultyLevel}
          onChange={(e) =>
            setNewCourse({ ...newCourse, difficultyLevel: e.target.value })
          }
        >
          <option disabled>Select Difficulty Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <button onClick={handleCreateCourse}>Submit</button>
      </Modal>

      {/* Edit Course Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Edit Course</h2>
        {selectedCourse && (
          <>
            <input
              type="text"
              value={selectedCourse.title}
              onChange={(e) =>
                setSelectedCourse({ ...selectedCourse, title: e.target.value })
              }
            />
            <textarea
              value={selectedCourse.description}
              onChange={(e) =>
                setSelectedCourse({
                  ...selectedCourse,
                  description: e.target.value,
                })
              }
            ></textarea>
            <select
              value={selectedCourse.category}
              onChange={(e) =>
                setSelectedCourse({
                  ...selectedCourse,
                  category: e.target.value,
                })
              }
            >
              <option disabled>Select Course Category</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
            </select>
            <select
              value={selectedCourse.difficultyLevel}
              onChange={(e) =>
                setSelectedCourse({
                  ...selectedCourse,
                  difficultyLevel: e.target.value,
                })
              }
            >
              <option disabled>Select Difficulty Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <button onClick={handleEditCourse}>Save Changes</button>
          </>
        )}
      </Modal>

      {/* Add Lecture Modal */}
      <Modal
        isOpen={isLectureModalOpen}
        onClose={() => setIsLectureModalOpen(false)}
      >
        <h2>Add Lecture to {selectedCourse?.title}</h2>
        <input
          type="text"
          placeholder="Lecture Title"
          value={newLecture.title}
          onChange={(e) =>
            setNewLecture({ ...newLecture, title: e.target.value })
          }
        />
        <select
          value={newLecture.type}
          onChange={(e) =>
            setNewLecture({
              ...newLecture,
              type: e.target.value as "video" | "pdf",
            })
          }
        >
          <option value="video">YouTube Video</option>
          <option value="pdf">PDF</option>
        </select>
        {newLecture.type === "video" ? (
          <input
            type="text"
            placeholder="YouTube Link"
            value={newLecture.content}
            onChange={(e) =>
              setNewLecture({ ...newLecture, content: e.target.value })
            }
          />
        ) : (
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              e.target.files &&
              setNewLecture({
                ...newLecture,
                content: URL.createObjectURL(e.target.files[0]),
              })
            }
          />
        )}
        <button onClick={handleAddLecture} style={{ marginTop: "20px" }}>
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
    }}
  >
    {/* Quiz Level */}
    <label>
      Select Level:
      <select
        value={newQuiz.level}
        onChange={(e) => setNewQuiz({ ...newQuiz, level: e.target.value })}
        style={{
          display: "block",
          margin: "10px 0",
          padding: "8px",
          borderRadius: "4px",
          width: "100%",
        }}
      >
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
        }}
      >
        <input
          type="text"
          placeholder={`Question ${idx + 1}`}
          value={q.question}
          onChange={(e) =>
            setNewQuiz({
              ...newQuiz,
              questions: newQuiz.questions.map((question, i) =>
                i === idx ? { ...question, question: e.target.value } : question
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
                    ? { ...question, correctAnswer: parseInt(e.target.value) }
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
            }}
          >
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
    }}
  >
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
    }}
  >
    Submit Quiz
  </button>
</Modal>

{/* View Lectures Modal */}
<Modal
  isOpen={isViewLectureModalOpen}
  onClose={() => setIsViewLectureModalOpen(false)}
>
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
          onClick={() => toggleLectureContent(lecture.title)}
        >
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
                title={lecture.title}
              ></iframe>
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
                title={lecture.title}
              ></iframe>
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
