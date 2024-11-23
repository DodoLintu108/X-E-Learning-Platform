import React, { useState, useEffect } from 'react';
import { createCourse, addModule, searchCourses, updateCourse, getCourseVersions } from '../../services/api';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCourse, setNewCourse] = useState({ title: '', description: '', category: '', difficultyLevel: '' });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({ title: '', content: '', resources: [] });

  useEffect(() => {
    if (searchQuery) {
      handleSearchCourses();
    }
  }, [searchQuery]);

  const handleCreateCourse = async () => {
    const createdCourse = await createCourse(newCourse);
    setCourses([...courses, createdCourse]);
    setNewCourse({ title: '', description: '', category: '', difficultyLevel: '' });
  };

  const handleAddModule = async (courseId) => {
    const module = await addModule(courseId, newModule);
    setModules([...modules, module]);
    setNewModule({ title: '', content: '', resources: [] });
  };

  const handleSearchCourses = async () => {
    const results = await searchCourses(searchQuery);
    setCourses(results);
  };

  const handleUpdateCourse = async (courseId, updatedFields) => {
    const updatedCourse = await updateCourse(courseId, updatedFields);
    setCourses(
      courses.map((course) =>
        course.id === courseId ? updatedCourse : course
      ),
    );
  };

  const handleViewVersions = async (courseId) => {
    const versions = await getCourseVersions(courseId);
    console.log('Course Versions:', versions);
  };

  return (
    <div>
      <h1>Manage Courses</h1>
      {/* Search Bar */}
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
        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
        placeholder="Title"
      />
      <textarea
        value={newCourse.description}
        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
        placeholder="Description"
      ></textarea>
      <input
        type="text"
        value={newCourse.category}
        onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
        placeholder="Category"
      />
      <input
        type="text"
        value={newCourse.difficultyLevel}
        onChange={(e) => setNewCourse({ ...newCourse, difficultyLevel: e.target.value })}
        placeholder="Difficulty Level"
      />
      <button onClick={handleCreateCourse}>Create Course</button>

      {/* List of Courses */}
      <h2>Courses</h2>
      {courses.map((course) => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <button onClick={() => setSelectedCourse(course)}>Manage Modules</button>
          <button onClick={() => handleViewVersions(course.id)}>View Versions</button>
        </div>
      ))}

      {/* Add Module */}
      {selectedCourse && (
        <>
          <h2>Add Module to {selectedCourse.title}</h2>
          <input
            type="text"
            value={newModule.title}
            onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
            placeholder="Module Title"
          />
          <textarea
            value={newModule.content}
            onChange={(e) => setNewModule({ ...newModule, content: e.target.value })}
            placeholder="Module Content"
          ></textarea>
          <button onClick={() => handleAddModule(selectedCourse.id)}>Add Module</button>
        </>
      )}
    </div>
  );
};

export default ManageCourses;