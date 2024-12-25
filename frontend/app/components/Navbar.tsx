// Navigation bar for the application
import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link href="/">E-Learning</Link>
      </div>
      <ul style={styles.navLinks}>
        <li>
          <Link href="/dashboard/student">Student Dashboard</Link>
        </li>
        <li>
          <Link href="/dashboard/instructor">Instructor Dashboard</Link>
        </li>
        <li>
          <Link href="/dashboard/admin">Admin Dashboard</Link>
        </li>
        <li>
          <Link href="/courses/create">Create Course</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          <Link href="/Login">Login</Link>
        </li>
        <li>
          <Link href="/Register">Register</Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#4A90E2',
    color: '#fff',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '15px',
  },
};

export default Navbar;
