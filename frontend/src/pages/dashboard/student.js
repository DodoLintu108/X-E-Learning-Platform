// Student dashboard (Tasks 1.2, 4.1)

import React, { useEffect, useState } from 'react';
import { getStudentMetrics } from '../../services/api';

const StudentDashboard = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getStudentMetrics('student123'); // Replace with dynamic student ID
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching student metrics:', error);
      }
    };
    fetchMetrics();
  }, []);

  if (!metrics) return <p>Loading...</p>;

  return (
    <div>
      <h1>Student Dashboard</h1>
      <div>
        <h2>Course Completion</h2>
        <p>{metrics.completionRate}%</p>
      </div>
      <div>
        <h2>Average Score</h2>
        <p>{metrics.averageScore}</p>
      </div>
      <div>
        <h2>Engagement Trends</h2>
        <ul>
          {metrics.engagementTrends.modules.map((module, index) => (
            <li key={index}>
              {module}: {metrics.engagementTrends.timeSpent[index]} mins
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
