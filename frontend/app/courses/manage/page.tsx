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
            top: "25px",
            right: "6px",
          }}
        >
          ✖
        </button>
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
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("Select Course Category");

  useEffect(() => {
    getAllCourses();
  }, []);

  const [allCourses, setAllCourses] = useState([]);
  const getAllCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/courses/all");
      setAllCourses(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response?.data || error.message);
        toast.error(
          "Error getting course!",
          error.response?.data || error.message
        );
      } else {
        console.error("Error:", error);
      }
      toast.error("Error getting course!");
    }
  };
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
    category: "Select Course Category",
    difficultyLevel: "Select Difficulty Level",
    courseImage: null,
    courseMaterial: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", newCourse.title);
    formData.append("description", newCourse.description);
    formData.append("category", newCourse.category);
    formData.append("difficultyLevel", newCourse.difficultyLevel);
    if (newCourse.courseImage) {
      formData.append("imagefiles", newCourse.courseImage); // Key must match backend
    }
    if (newCourse.courseMaterial) {
      formData.append("files", newCourse.courseMaterial); // Key must match backend
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/courses/create",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success(response.data.message);
      setIsModalOpen(false); // Close the modal
      getAllCourses(); // Refresh the list
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response?.data || error.message);
        toast.error(
          "Error creating course!",
          error.response?.data || error.message
        );
      } else {
        console.error("Error:", error);
      }
      toast.error("Error creating course!");
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/courses/${id}`
      );
      toast.success(response.data.message);
      getAllCourses();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response?.data || error.message);
        toast.error(
          "Error deleting course!",
          error.response?.data || error.message
        );
      } else {
        console.error("Error:", error);
      }
      toast.error("Error deleting course!");
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
          {
            <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              {allCourses.map((course: any) => {
                return (
                  <div
                    key={course._id}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "9px",
                      borderRadius: "4px",
                      border: "1px solid #7F8081",
                      boxShadow: "1px 4px 6px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <div>
                      <img
                        src={`${course.courseImage}`}
                        alt="course"
                        width={100}
                        height={100}
                        style={{
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <div>
                      <h3>Title: {course.title}</h3>
                      <p>Description : {course.description}</p>
                      <p>Category:{course.category}</p>
                      <p>Level : {course.difficultyLevel}</p>
                    </div>
                    <div>
                      <button
                        style={{
                          width: "100%",
                          padding: "10px",
                          backgroundColor: "#7AB2D3",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        style={{
                          width: "100%",
                          padding: "10px",
                          backgroundColor: "#7AB2D3",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          marginTop: "5px",
                        }}
                        onClick={() => handleDelete(course._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
              <div></div>
            </div>
          }
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
          accept="image/*"
          multiple={false}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
          onChange={(e) =>
            setNewCourse({
              ...newCourse,
              courseImage: e.target.files ? e.target.files[0] : null,
            })
          }
        />
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
