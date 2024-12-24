"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "../../globals.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Interface for a Course object
interface Course {
  _id: string; // Unique ID for the course
  title: string; // Title of the course
  description: string; // Description of the course
  category: string; // Category of the course (e.g., Mathematics, Physics)
  difficultyLevel: string; // Difficulty level (Beginner, Intermediate, Advanced)
}

// Interface for the Modal properties
interface ModalProps {
  isOpen: boolean; // Determines if the modal is open
  onClose: () => void; // Function to close the modal
  children: React.ReactNode; // Content inside the modal
}

// Modal component to handle the create course form popup
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // If modal is not open, do not render anything

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Ensure it appears on top
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
          onClick={onClose} // Close modal when button clicked
          style={{
            background: "white",
            color: "red",
            border: "none",
            width: "80px",
            height: "40px",
            borderRadius: "5px",
            cursor: "pointer",
            position: "absolute",
            top: "25px",
            right: "6px",
          }}
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

// Main component for managing teacher courses
const TeacherCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]); // State to store courses
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  const [newCourse, setNewCourse] = useState({
    title: "", // New course title
    description: "", // New course description
    category: "Select Course Category", // Default category placeholder
    difficultyLevel: "Select Difficulty Level", // Default difficulty level placeholder
  });

  // Fetch teacher-specific courses on component mount
  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  // Function to fetch courses created by the teacher
  const fetchTeacherCourses = async () => {
    const token = localStorage.getItem("accessToken"); 
    try {
      const response = await axios.get("http://localhost:3000/courses/teacher", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API Response:", response.data); // Add this to debug the response
      setCourses(response.data); 
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Error fetching courses."); 
    }
  };
  

  // Function to handle creating a new course
  const handleCreateCourse = async () => {
    const token = localStorage.getItem("accessToken"); // Get access token from localStorage
    try {
      const response = await axios.post(
        "http://localhost:3000/courses/create",
        newCourse, // Send new course data to the API
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request header
          },
        }
      );
      toast.success("Course created successfully!"); // Show success notification
      fetchTeacherCourses(); // Refresh the courses list
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Error creating course."); // Show error notification
    }
  };

  return (
    <div>
      <Navbar /> {/* Navbar component */}
      <ToastContainer /> {/* Toast notifications */}
      <h1>Teacher Courses</h1> {/* Page heading */}
      <button
        onClick={() => setIsModalOpen(true)} // Open modal when clicked
        style={{
          padding: "10px 20px",
          backgroundColor: "#7AB2D3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Create Course {/* Button text */}
      </button>

      {/* List of courses */}
      <ul>
        {courses.length > 0 ? (
          courses.map((course) => (
            <li key={course._id}> {/* Use _id as unique key */}
              <h3>{course.title}</h3> {/* Course title */}
              <p>{course.description}</p> {/* Course description */}
              <p>Category: {course.category}</p> {/* Course category */}
              <p>Difficulty: {course.difficultyLevel}</p> {/* Course difficulty */}
            </li>
          ))
        ) : (
          <p>No courses available</p> // Display when no courses are available
        )}
      </ul>

      {/* Modal for creating a new course */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Create New Course</h2>
        <input
          type="text"
          placeholder="Title"
          value={newCourse.title}
          onChange={(e) =>
            setNewCourse({ ...newCourse, title: e.target.value })
          } // Update title in state
        />
        <textarea
          placeholder="Description"
          value={newCourse.description}
          onChange={(e) =>
            setNewCourse({ ...newCourse, description: e.target.value })
          } // Update description in state
        ></textarea>
        <select
          value={newCourse.category}
          onChange={(e) =>
            setNewCourse({ ...newCourse, category: e.target.value })
          } // Update category in state
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
          } // Update difficulty level in state
        >
          <option disabled>Select Difficulty Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <button onClick={handleCreateCourse}>Submit</button>
      </Modal>
    </div>
  );
};

export default TeacherCourses; // Export the component
