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
const Modal = ({ isOpen, onClose, children }) => {
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
          minWidth: "300px",
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
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    difficultyLevel: "",
    video: null,
    files: [],
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({
    title: "",
    content: "",
    resources: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      handleSearchCourses();
    }
  }, [searchQuery]);

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

  const handleViewVersions = async (courseId) => {
    const versions = await getCourseVersions(courseId);
    console.log("Course Versions:", versions);
  };
  const handleFileChange = (e) => {
    setNewCourse({ ...newCourse, files: Array.from(e.target.files) });
  };

  const handleVideoChange = (e) => {
    setNewCourse({ ...newCourse, video: e.target.files[0] });
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
            onClick={() => setIsModalOpen(true)}
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
          onChange={(e) => console.log(e.target.files)}
        />

        {/* Video Upload */}
        <label
          style={{
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Upload Course Videos:
        </label>
        <input
          type="file"
          accept="video/*"
          multiple
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
          onChange={(e) => console.log(e.target.files)}
        />
         
         {/* submit button */}
                  <button
            style={{
              width: "85%",
              padding: "4px 5px",  // Smaller padding (vertical and horizontal)
              backgroundColor: "#7AB2D3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginLeft: "25px",
              marginTop: "-15px",  // Move the button up by 10 pixels
            }}
            onClick={() => setIsModalOpen(true)}
          >
            submit
          </button> 
      </Modal>
    </div>
  );
};

export default ManageCourses;
