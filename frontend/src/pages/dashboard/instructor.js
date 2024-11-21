 // Instructor dashboard (Tasks 1.2, 4.2)

 import React, { useEffect, useState } from 'react';
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
      <div>
        <h2>Student Engagement</h2>
        <p>{analytics.studentEngagement}%</p>
      </div>
      <div>
        <h2>Assessment Results</h2>
        <p>Passed: {analytics.assessmentResults.passed}</p>
        <p>Failed: {analytics.assessmentResults.failed}</p>
      </div>
      <div>
        <h2>Content Effectiveness</h2>
        <ul>
          {analytics.contentEffectiveness.map((item, index) => (
            <li key={index}>
              {item.quizId}: Difficulty {item.difficulty}, Avg Score {item.averageScore}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InstructorDashboard;
