import React from 'react';
import Navbar from '../components/Navbar';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <header style={styles.header}>
        <h1>Welcome to E-Learning</h1>
        <p>Your personalized learning platform for students, instructors, and admins.</p>
        <div style={styles.buttons}>
          <a href="/login" style={styles.button}>Login</a>
          <a href="/register" style={styles.button}>Register</a>
        </div>
      </header>
    </div>
  );
};

const styles = {
  header: {
    textAlign: 'center',
    margin: '50px 20px',
  },
  buttons: {
    marginTop: '20px',
  },
  button: {
    margin: '0 10px',
    padding: '10px 20px',
    fontSize: '16px',
    textDecoration: 'none',
    backgroundColor: '#4A90E2',
    color: '#fff',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
};

export default HomePage;
