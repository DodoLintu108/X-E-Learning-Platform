// Course creation form (Task 2.1)

import React, { useState } from 'react';
import axios from 'axios';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [createdBy, setCreatedBy] = useState('instructor123'); // Hardcoded instructor ID for now

  const handleCreateCourse = async () => {
    try {
      const response = await axios.post('http://localhost:3000/courses/create', {
        title,
        description,
        category,
        difficultyLevel,
        createdBy,
      });
      alert(Course created successfully! Course ID: ${response.data._id});
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Create a New Course</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={styles.textarea}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={styles.input}
      />
      <select
        value={difficultyLevel}
        onChange={(e) => setDifficultyLevel(e.target.value)}
        style={styles.select}
      >
        <option value="">Select Difficulty Level</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
      <button onClick={handleCreateCourse} style={styles.button}>
        Create Course
      </button>
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '600px', margin: '0 auto' },
  input: { width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px' },
  textarea: { width: '100%', padding: '10px', height: '100px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px' },
  select: { width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px' },
  button: { padding: '10px 20px', backgroundColor: '#4A90E2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};

export default CreateCourse;