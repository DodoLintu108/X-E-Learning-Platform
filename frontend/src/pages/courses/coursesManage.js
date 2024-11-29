import React, { useState, useEffect } from "react";
import {
  createCourse,
  addModule,
  searchCourses,
  //updateCourse,
  getCourseVersions,
} from "../../services/api";
import Navbar from "../../components/Navbar";
import "../../app/globals.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    difficultyLevel: "",
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({
    title: "",
    content: "",
    resources: [],
  });

  useEffect(() => {
    if (searchQuery) {
      handleSearchCourses();
    }
  }, [searchQuery]);

  const handleCreateCourse = async () => {
    const createdCourse = await createCourse(newCourse);
    if (createdCourse) toast.success("Course Created Successfully");
    setCourses([...courses, createdCourse]);
    setNewCourse({
      title: "",
      description: "",
      category: "",
      difficultyLevel: "",
    });
  };

  const handleAddModule = async (courseId) => {
    const modulee = await addModule(courseId, newModule);
    setModules([...modules, modulee]);
    setNewModule({ title: "", content: "", resources: [] });
  };

  const handleSearchCourses = async () => {
    const results = await searchCourses(searchQuery);
    setCourses(results);
  };

  // const handleUpdateCourse = async (courseId, updatedFields) => {
  //   const updatedCourse = await updateCourse(courseId, updatedFields);
  //   setCourses(
  //     courses.map((course) => (course.id === courseId ? updatedCourse : course))
  //   );
  // };

  const handleViewVersions = async (courseId) => {
    const versions = await getCourseVersions(courseId);
    console.log("Course Versions:", versions);
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
            justifyContent: "flex-start", // Aligns the button to the left
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
            onClick={handleCreateCourse}
          >
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
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for courses..."
          />

          {/* Create Course */}
          <h2>Create New Course</h2>
          <input
            type="text"
            value={newCourse.title}
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
            placeholder="Description"
          ></textarea>
          <input
            type="text"
            value={newCourse.category}
            onChange={(e) =>
              setNewCourse({ ...newCourse, category: e.target.value })
            }
            placeholder="Category"
          />
          <input
            type="text"
            value={newCourse.difficultyLevel}
            onChange={(e) =>
              setNewCourse({ ...newCourse, difficultyLevel: e.target.value })
            }
            placeholder="Difficulty Level"
          />

          {/* List of Courses */}
          <h2>Courses</h2>
          {courses.map((course) => (
            <div key={course.id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <button onClick={() => setSelectedCourse(course)}>
                Manage Modules
              </button>
              <button onClick={() => handleViewVersions(course.id)}>
                View Versions
              </button>
            </div>
          ))}

          {/* Add Module */}
          {selectedCourse && (
            <>
              <h2>Add Module to {selectedCourse.title}</h2>
              <input
                type="text"
                value={newModule.title}
                onChange={(e) =>
                  setNewModule({ ...newModule, title: e.target.value })
                }
                placeholder="Module Title"
              />
              <textarea
                value={newModule.content}
                onChange={(e) =>
                  setNewModule({ ...newModule, content: e.target.value })
                }
                placeholder="Module Content"
              ></textarea>
              <button onClick={() => handleAddModule(selectedCourse.id)}>
                Add Module
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;
