import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // Ensure this points to your backend

export const getStudentMetrics = async (studentId) => {
    try {
      const response = await axios.get(`${BASE_URL}/analytics/student`, {
        params: { studentId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching student metrics:', error.message);
      throw error;
    }
  };
  

export const getInstructorAnalytics = async (instructorId) => {
  const response = await axios.get(`${BASE_URL}/analytics/instructor`, {
    params: { instructorId },
  });
  return response.data;
};

export const getDownloadableReport = async (instructorId) => {
  const response = await axios.get(`${BASE_URL}/analytics/download-report`, {
    params: { instructorId },
  });
  return response.data;
};
