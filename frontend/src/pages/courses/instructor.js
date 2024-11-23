// Instructor dashboard (Tasks 1.2, 4.2)

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInstructorAnalytics } from '../../services/api';

const InstructorDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getInstructorAnalytics('instructor123'); // Replace with dynamic instructor ID
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching instructor analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analytics) return <p>Loading...</p>;

  return (
    <div>
      <h1>Instructor Dashboard</h1>

      <nav>
        <ul>
          <li>
            <Link to="/courses/manage">Manage Courses</Link>
          </li>
          <li>
            <Link to="/analytics/instructor">View Analytics</Link>
          </li>
        </ul>
      </nav>

      <div>
        <h2>Analytics</h2>
        <div>
          <h3>Student Engagement</h3>
          <p>{analytics.studentEngagement}%</p>
        </div>
        <div>
          <h3>Assessment Results</h3>
          <p>Passed: {analytics.assessmentResults.passed}</p>
          <p>Failed: {analytics.assessmentResults.failed}</p>
        </div>
        <div>
          <h3>Content Effectiveness</h3>
          <ul>
            {analytics.contentEffectiveness.map((item, index) => (
              <li key={index}>
                {item.quizId}: Difficulty {item.difficulty}, Avg Score {item.averageScore}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;