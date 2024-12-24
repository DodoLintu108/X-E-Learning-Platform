"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "../../globals.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";

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
            top: "25px",
            right: "6px",
          }}>
          ✖
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "40px",
          }}>
          <h2 style={{ fontSize: "20px", fontWeight: "500" }}>
            Create New Course
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "15px",
          }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const ManageCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("Select Course Category");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | "">("");
  const [userRole, setUserRole] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
  const [courseData, setCourseData] = useState<{
    _id: string;
    title: string;
    description: string;
    category: string;
    difficultyLevel: string;
    courseImage: string;
    courseMaterial: string;
  } | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userIDd = localStorage.getItem("userID");
    const role = localStorage.getItem("userRole");
    setUserRole(role || "");
    console.log("uddd", userIDd);
    setAccessToken(token);
    setUserID(userIDd || "");
    console.log("Extracted Token:", token);
  }, [searchParams]);

  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    if (accessToken && userID && userRole) {
      console.log("lj", userID);
      if (userRole === "admin") getAllCourses();
      else {
        console.log("uuuuu", userID);
        getTeacherCourses(userID);
      }
    }
  }, [accessToken, userID, userRole]);
  const getAllCourses = async () => {
    try {
      console.log("access token", accessToken);
      const response = await axios.get("http://localhost:3000/courses/all", {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      setAllCourses(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        toast.error(
          "Error creating course!",
          error.response?.data || error.message
        );
        if (statusCode === 401) {
          toast.error("Session expired. Redirecting to Login...");
          window.location.href = "/Login";
          return;
        }
      } else {
        console.error("Error:", error);
        toast.error("Error getting course!");
      }
    }
  };
  const getTeacherCourses = async (userId: string | null) => {
    try {
      console.log("access token", accessToken);
      const response = await axios.get(
        `http://localhost:3000/courses/teacher/${userId}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAllCourses(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        toast.error(
          "Error creating course!",
          error.response?.data || error.message
        );
        if (statusCode === 401) {
          toast.error("Session expired. Redirecting to Login...");
          // window.location.href = "/Login";
          return;
        }
      } else {
        console.error("Error:", error);
        toast.error("Error getting course!");
      }
    }
  };
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

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", newCourse.title);
    formData.append("description", newCourse.description);
    formData.append("category", newCourse.category);
    formData.append("createdBy", userID);
    formData.append("difficultyLevel", newCourse.difficultyLevel);
    formData.append("rating", newCourse.rating.toString());
    if (newCourse.courseImage) {
      formData.append("imagefiles", newCourse.courseImage);
    }
    if (newCourse.courseMaterial) {
      formData.append("files", newCourse.courseMaterial);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/courses/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success(response.data.message);
      setIsModalOpen(false);
      getAllCourses();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        toast.error(
          "Error creating course!",
          error.response?.data || error.message
        );
        if (statusCode === 401) {
          toast.error("Session expired. Redirecting to Login...");

          window.location.href = "/Login";
          return;
        }
        console.error("Error:", error.response?.data || error.message);
      } else {
        console.error("Error:", error);
      }
      toast.error("Error creating course!");
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/courses/${id}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success(response.data.message);
      getAllCourses();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        toast.error(
          "Error creating course!",
          error.response?.data || error.message
        );
        if (statusCode === 401) {
          toast.error("Session expired. Redirecting to Login...");
          // Redirect to Login
          window.location.href = "/Login";
          return;
        }
      } else {
        console.error("Error:", error);
      }
      toast.error("Error deleting course!");
    }
  };
  const handleOpenEditModal = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/courses/${id}`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      setCourseData(response.data);

      setNewCourse({
        title: response.data.title,
        rating: 0.0,
        description: response.data.description,
        category: response.data.category,
        difficultyLevel: response.data.difficultyLevel,
        courseImage: response.data.courseImage.replace(
          "http://localhost:3000/uploads/",
          ""
        ),
        courseMaterial: response.data.courseMaterial.replace(
          "http://localhost:3000/uploads/",
          ""
        ),
      });
      console.log("kj", newCourse);
      setIsEditModalOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        toast.error(
          "Error opening modal!",
          error.response?.data || error.message
        );
        if (statusCode === 401) {
          toast.error("Session expired. Redirecting to Login...");
          // Redirect to Login
          window.location.href = "/Login";
          return;
        }
      } else {
        console.error("Error:", error);
      }
      toast.error("Error opening modal!");
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const formData = new FormData();
      formData.append("title", newCourse.title);
      formData.append("description", newCourse.description);
      formData.append("category", newCourse.category);
      formData.append("difficultyLevel", newCourse.difficultyLevel);

      if (newCourse.courseImage) {
        formData.append("imagefiles", newCourse.courseImage);
      }

      if (newCourse.courseMaterial) {
        formData.append("files", newCourse.courseMaterial);
      }

      const response = await axios.put(
        `http://localhost:3000/courses/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success(response.data.message);
      setIsEditModalOpen(false);
      getAllCourses();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        toast.error(error.response?.data.message || "Error updating course!");
        if (statusCode === 401) {
          toast.error("Session expired. Redirecting to Login...");
          window.location.href = "/Login";
        }
      } else {
        console.error("Error:", error);
      }
      toast.error("Error updating course!");
    }
  };

  const handleSearch = async (query: string) => {
    if (!query) {
      setAllCourses([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/courses/search?query=${searchQuery}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAllCourses(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        toast.error(
          "Error creating course!",
          error.response?.data || error.message
        );
        if (statusCode === 401) {
          toast.error("Session expired. Redirecting to Login...");
          window.location.href = "/Login";
          return;
        }
      } else {
        console.error("Error:", error);
      }
      toast.error("Error updating course!");
    }
  };
  const handleOpenModal = async () => {
    setNewCourse({
      title: "",
      description: "",
      category: "",
      difficultyLevel: "",
      courseImage: null,
      courseMaterial: null,
      rating: 0.0,
    });
    setIsModalOpen(true);
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
            onClick={handleOpenModal}>
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
          {
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}>
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
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }>
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
                    <div
                      onClick={() =>
                        (window.location.href = `/courses/specificCourse/?courseId=${course._id}&accessToken=${accessToken}`)
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

                      <p style={{ margin: 0 }}>Category: {course.category}</p>
                      <p style={{ margin: 0 }}>
                        Level: {course.difficultyLevel}
                      </p>
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
                        onClick={() => {
                          if (accessToken) {
                            handleOpenEditModal(course._id);
                          }
                        }}>
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
                        onClick={() => handleDelete(course._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
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
        <label
          style={{
            fontWeight: "bold",
            marginBottom: "8px",
          }}>
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
          }}>
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
          onClick={handleCreateCourse}>
          submit
        </button>
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "9px",
            borderRadius: "4px",
          }}>
          <input
            type="text"
            value={newCourse?.title}
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
            value={newCourse?.description}
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
            value={newCourse?.category}
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
            value={newCourse?.difficultyLevel}
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
        <label
          style={{
            fontWeight: "bold",
            marginBottom: "8px",
          }}>
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
          }}>
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
          onClick={() => courseData && handleEdit(courseData._id)}>
          submit
        </button>
      </Modal>
    </div>
  );
};

export default ManageCourses;
