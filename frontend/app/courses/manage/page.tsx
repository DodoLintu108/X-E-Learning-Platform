"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "../../globals.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            background: "red",
            color: "white",
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
          Close
        </button>

        {/* Centered Heading */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "40px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "500" }}>
            Create New Course
          </h2>
        </div>

        {/* Modal Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "15px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("Select Course Category");
  const [newCourse, setNewCourse] = useState<{
    title: string;
    description: string;
    category: string;
    difficultyLevel: string;
    courseImage: File | null;
    courseMaterial: File | null;
  }>({
    title: "",
    description: "",
    category: "",
    difficultyLevel: "",
    courseImage: null,
    courseMaterial: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateCourse = async () => {
    const formData = new FormData();

    formData.append("title", newCourse.title);
    formData.append("description", newCourse.description);
    formData.append("category", newCourse.category);
    formData.append("difficultyLevel", newCourse.difficultyLevel);
    if (newCourse.courseImage) {
      formData.append("files", newCourse.courseImage); // Key must match backend
    }
    if (newCourse.courseMaterial) {
      formData.append("files", newCourse.courseMaterial); // Key must match backend
    }

    console.log("Form Data:");
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/courses/create",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success(response.data.message);
      setCourses([...courses, response.data.course]); // Add the new course to the list
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Error creating course!");
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
        }}
      >
        <h1
          style={{
            color: "#7F8081",
            fontSize: "28px",
          }}
        >
          Manage Courses
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          marginTop: "40px",
          alignItems: "start",
          gap: "8px",
          padding: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
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
            onClick={() => setIsModalOpen(true)}
          >
            Create Course
          </button>
        </div>
        <h1 className="">Courses</h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "2px solid #7F8081",
            padding: "9px",
            borderRadius: "4px",
            width: "100%",
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for courses..."
          />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "9px",
            borderRadius: "4px",
          }}
        >
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
            placeholder="Description"
          ></textarea>
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
            }
          >
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
            }
          >
            <option value="Select Difficulty Level" disabled>
              Select Difficulty Level
            </option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <label
          style={{
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Upload Course Materials (PDF, Docs, etc.):
        </label>
        <input
          type="file"
          multiple
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
          onChange={(e) =>
            setNewCourse({
              ...newCourse,
              courseMaterial: e.target.files ? e.target.files[0] : null,
            })
          }
        />

        {/* Video Upload */}
        <label
          style={{
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Upload Course Image:
        </label>
        <input
          type="file"
          accept="image/*" // Accepts all image formats
          multiple={false} // Allow only one image to be selected at a time
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
          onChange={(e) =>
            setNewCourse({
              ...newCourse,
              courseImage: e.target.files ? e.target.files[0] : null, // Assuming you are storing the image in `newCourse.image`
            })
          }
        />

        {/* submit button */}
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
          onClick={handleCreateCourse}
        >
          submit
        </button>
      </Modal>
    </div>
  );
};

export default ManageCourses;
