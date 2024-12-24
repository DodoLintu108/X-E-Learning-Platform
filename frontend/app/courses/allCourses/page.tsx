"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "../../globals.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";

const ManageCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("Select Course Category");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [userID, setUserID] = useState<string | "">("");

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
    setUserID(userIDd || "");

    setAccessToken(token);
    console.log("Extracted Token:", token);
  }, [searchParams]);

  const [allCourses, setAllCourses] = useState([]);
  const [math, setMath] = useState([]);
  const [Physics, setPhysics] = useState([]);
  const [chemistry, setChemistry] = useState([]);
  const [machineLearning, setMachineLearning] = useState([]);

  useEffect(() => {
    if (accessToken) {
      getAllCourses();
      getMathCourses();
      getChemistryCourses();
      getPhysicsCourses();
      getMachineLearningCourses();
    }
  }, [accessToken]);
  const getMachineLearningCourses = async () => {
    try {
      console.log("access token", accessToken);
      const response = await axios.get(
        "http://localhost:3000/courses/category/Machine Learning",
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMachineLearning(response.data);
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
  const getPhysicsCourses = async () => {
    try {
      console.log("access token", accessToken);
      const response = await axios.get(
        "http://localhost:3000/courses/category/Physics",
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPhysics(response.data);
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
  const getChemistryCourses = async () => {
    try {
      console.log("access token", accessToken);
      const response = await axios.get(
        "http://localhost:3000/courses/category/Chemistry",
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setChemistry(response.data);
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
  const getMathCourses = async () => {
    try {
      console.log("access token", accessToken);
      const response = await axios.get(
        "http://localhost:3000/courses/category/Mathematics",
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMath(response.data);
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
      setIsEditModalOpen(true);
    } catch (error) {
      toast.error("Error opening edit modal!");
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
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null); // To show enrollment status

  const handleEnroll = async (courseId: string) => {
    if (!accessToken || !userID) {
      toast.error("You must be logged in to enroll.");
      return;
    }

    try {
      // Call the API to enroll the student in the course
      const response = await axios.put(
        `http://localhost:3000/courses/enroll/${courseId}/${userID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setEnrollmentStatus("Enrolled successfully!");
      toast.success("Enrolled in the course successfully!");

      // Optionally, you can redirect the user to another page after successful enrollment
      // router.push('/some-other-page');
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
            fontSize: "38px",
          }}>
          All Courses{" "}
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
            alignItems: "start",
          }}></div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
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
              <div>
                <h2 className="font-bold text-2xl">Explore All Courses</h2>
              </div>
              <div
                style={{
                  display: "flex", // Enables flexbox
                  flexWrap: "wrap", // Allows wrapping to the next line if needed
                  gap: "16px", // Adds space between the cards
                  justifyContent: "space-around", // Distributes the cards evenly
                  padding: "16px", // Adds padding around the container
                }}>
                <div
                  style={{
                    display: "flex", // Enables flexbox for horizontal alignment
                    alignItems: "start", // Aligns items at the top
                    justifyContent: "flex-start", // Ensures cards start from the left
                    flexWrap: "nowrap", // Prevents wrapping to the next line
                    gap: "16px", // Space between cards
                    overflowX: "scroll", // Allows horizontal scrolling if needed
                    padding: "16px", // Adds padding around the container
                    scrollbarWidth: "none", // Hides scrollbar in Firefox
                    msOverflowStyle: "none", // Hides scrollbar in IE/Edge
                  }}>
                  {allCourses.map((course: any) => {
                    return (
                      <div
                        key={course._id}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          height: "250px",

                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "9px",
                          borderRadius: "4px",
                          border: "1px solid #7F8081",
                          boxShadow: "1px 4px 6px rgba(0, 0, 0, 0.5)",
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          width: "400px", // Fixed width for consistency
                          flexShrink: 0, // Prevents shrinking of cards in flexbox
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
                              handleEnroll(course._id);
                            }}>
                            Enroll
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h2 className="font-bold text-2xl">Mathematics</h2>
              </div>
              <div
                style={{
                  display: "flex", // Enables flexbox
                  flexWrap: "wrap", // Allows wrapping to the next line if needed
                  gap: "16px", // Adds space between the cards
                  justifyContent: "space-around", // Distributes the cards evenly
                  padding: "16px", // Adds padding around the container
                }}>
                <div
                  style={{
                    display: "flex", // Enables flexbox for horizontal alignment
                    alignItems: "start", // Aligns items at the top
                    justifyContent: "flex-start", // Ensures cards start from the left
                    flexWrap: "nowrap", // Prevents wrapping to the next line
                    gap: "16px", // Space between cards
                    overflowX: "scroll", // Allows horizontal scrolling if needed
                    padding: "16px", // Adds padding around the container
                    scrollbarWidth: "none", // Hides scrollbar in Firefox
                    msOverflowStyle: "none", // Hides scrollbar in IE/Edge
                  }}>
                  {math.map((course: any) => {
                    return (
                      <div
                        key={course._id}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          height: "250px",

                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "9px",
                          borderRadius: "4px",
                          border: "1px solid #7F8081",
                          boxShadow: "1px 4px 6px rgba(0, 0, 0, 0.5)",
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          width: "400px", // Fixed width for consistency
                          flexShrink: 0, // Prevents shrinking of cards in flexbox
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
                              handleEnroll(course._id);
                            }}>
                            Enroll
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h2 className="font-bold text-2xl">Physics</h2>
              </div>
              <div
                style={{
                  display: "flex", // Enables flexbox
                  flexWrap: "wrap", // Allows wrapping to the next line if needed
                  gap: "16px", // Adds space between the cards
                  justifyContent: "space-around", // Distributes the cards evenly
                  padding: "16px", // Adds padding around the container
                }}>
                <div
                  style={{
                    display: "flex", // Enables flexbox for horizontal alignment
                    flexWrap: "nowrap", // Prevents wrapping to the next line
                    gap: "16px", // Space between cards
                    overflowX: "scroll", // Allows horizontal scrolling if needed
                    padding: "16px", // Adds padding around the container
                    scrollbarWidth: "none", // Hides scrollbar in Firefox
                    msOverflowStyle: "none", // Hides scrollbar in IE/Edge
                  }}>
                  {Physics.map((course: any) => {
                    return (
                      <div
                        key={course._id}
                        style={{
                          display: "flex",
                          height: "250px",

                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "9px",
                          borderRadius: "4px",
                          border: "1px solid #7F8081",
                          boxShadow: "1px 4px 6px rgba(0, 0, 0, 0.5)",
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          width: "400px", // Fixed width for consistency
                          flexShrink: 0, // Prevents shrinking of cards in flexbox
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
                              handleEnroll(course._id);
                            }}>
                            Enroll
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="font-bold text-2xl">Chemistry</h2>
              </div>
              <div
                style={{
                  display: "flex", // Enables flexbox
                  flexWrap: "wrap", // Allows wrapping to the next line if needed
                  gap: "16px", // Adds space between the cards
                  justifyContent: "space-around", // Distributes the cards evenly
                  padding: "16px", // Adds padding around the container
                }}>
                <div
                  style={{
                    display: "flex", // Enables flexbox for horizontal alignment
                    alignItems: "start", // Aligns items at the top
                    justifyContent: "flex-start", // Ensures cards start from the left
                    flexWrap: "nowrap", // Prevents wrapping to the next line
                    gap: "16px", // Space between cards
                    overflowX: "scroll", // Allows horizontal scrolling if needed
                    padding: "16px", // Adds padding around the container
                    scrollbarWidth: "none", // Hides scrollbar in Firefox
                    msOverflowStyle: "none", // Hides scrollbar in IE/Edge
                  }}>
                  {chemistry.map((course: any) => {
                    return (
                      <div
                        key={course._id}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "9px",
                          height: "250px",

                          borderRadius: "4px",
                          border: "1px solid #7F8081",
                          boxShadow: "1px 4px 6px rgba(0, 0, 0, 0.5)",
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          width: "400px", // Fixed width for consistency
                          flexShrink: 0, // Prevents shrinking of cards in flexbox
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
                              handleEnroll(course._id);
                            }}>
                            Enroll
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h2 className="font-bold text-2xl">Machine Learning</h2>
              </div>
              <div
                style={{
                  display: "flex", // Enables flexbox
                  flexWrap: "wrap", // Allows wrapping to the next line if needed
                  gap: "16px", // Adds space between the cards
                  justifyContent: "space-around", // Distributes the cards evenly
                  padding: "16px", // Adds padding around the container
                }}>
                <div
                  style={{
                    display: "flex", // Enables flexbox for horizontal alignment
                    alignItems: "start", // Aligns items at the top
                    justifyContent: "flex-start", // Ensures cards start from the left
                    flexWrap: "nowrap", // Prevents wrapping to the next line
                    gap: "16px", // Space between cards
                    overflowX: "scroll", // Allows horizontal scrolling if needed
                    padding: "16px", // Adds padding around the container
                    scrollbarWidth: "none", // Hides scrollbar in Firefox
                    msOverflowStyle: "none", // Hides scrollbar in IE/Edge
                  }}>
                  {machineLearning.map((course: any) => {
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
                          height: "250px",
                          width: "400px", // Fixed width for consistency
                          flexShrink: 0, // Prevents shrinking of cards in flexbox
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
                              handleEnroll(course._id);
                            }}>
                            Enroll
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;
