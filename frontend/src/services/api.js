import axios from 'axios';
import { io } from 'socket.io-client';

// Base URL for backend API
const BASE_URL = 'http://localhost:3000'; // Adjust this for production

// --------- Analytics API Functions ---------

/**
 * Fetches metrics for a student.
 * @param {string} studentId - The ID of the student
 */
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

/**
 * Fetches analytics for an instructor.
 * @param {string} instructorId - The ID of the instructor
 */
export const getInstructorAnalytics = async (instructorId) => {
  const response = await axios.get(`${BASE_URL}/analytics/instructor`, {
    params: { instructorId },
  });
  return response.data;
};

/**
 * Fetches a downloadable report URL for an instructor.
 * @param {string} instructorId - The ID of the instructor
 */
export const getDownloadableReport = async (instructorId) => {
  const response = await axios.get(`${BASE_URL}/analytics/download-report`, {
    params: { instructorId },
  });
  return response.data;
};

// --------- Invitation-Based Chat Functions ---------

/**
 * Creates a chat invitation for a specific student and instructor.
 * @param {string} studentId - The ID of the student
 * @param {string} instructorId - The ID of the instructor
 */
export const createInvitation = async (studentId, instructorId) => {
  const response = await axios.post(`${BASE_URL}/chat/invite`, { studentId, instructorId });
  return response.data;
};

/**
 * Fetches messages for a specific chat.
 * @param {string} chatId - The chat ID
 * @param {string} userId - The user ID of the requesting participant
 */
export const getMessages = async (chatId, userId) => {
  const response = await axios.get(`${BASE_URL}/chat/${chatId}/${userId}/messages`);
  return response.data;
};

/**
 * Sends a message in a specific chat.
 * @param {string} chatId - The chat ID
 * @param {string} senderId - The ID of the user sending the message
 * @param {string} message - The message text
 */
export const sendMessage = async (chatId, senderId, message) => {
  const response = await axios.post(`${BASE_URL}/chat/message`, { chatId, senderId, message });
  return response.data;
};

// --------- Real-Time Chat Functions ---------

// WebSocket connection
const socket = io(BASE_URL, {
  transports: ['websocket'], // Use WebSocket transport
});

/**
 * Joins a chat session using WebSocket.
 * @param {Array<string>} participants - Array of user IDs participating in the chat
 */
export const joinChat = (participants) => {
  socket.emit('joinChat', participants);
};

/**
 * Sends a real-time message via WebSocket.
 * @param {string} chatId - The chat ID
 * @param {string} senderId - The ID of the sender
 * @param {string} message - The message text
 */
export const sendRealTimeMessage = (chatId, senderId, message) => {
  socket.emit('sendMessage', { chatId, senderId, message });
};

/**
 * Listens for incoming real-time messages via WebSocket.
 * @param {Function} callback - Callback function to handle incoming messages
 */
export const onReceiveMessage = (callback) => {
  socket.on('receiveMessage', callback);
};

// --------- Discussion Forum API Functions ---------

/**
 * Creates a new thread in a course forum.
 * @param {string} courseId - The ID of the course
 * @param {string} title - The title of the thread
 * @param {string} authorId - The ID of the thread creator
 */
export const createThread = async (courseId, title, authorId) => {
  const response = await axios.post(`${BASE_URL}/forum/thread`, {
    courseId,
    title,
    authorId,
  });
  return response.data;
};

/**
 * Adds a reply to an existing thread in a course forum.
 * @param {string} courseId - The ID of the course
 * @param {string} threadId - The ID of the thread
 * @param {string} content - The content of the reply
 * @param {string} authorId - The ID of the reply creator
 */
export const addReply = async (courseId, threadId, content, authorId) => {
  const response = await axios.post(`${BASE_URL}/forum/reply`, {
    courseId,
    threadId,
    content,
    authorId,
  });
  return response.data;
};

/**
 * Searches for threads in a course forum based on a query.
 * @param {string} courseId - The ID of the course
 * @param {string} query - The search query
 */
export const searchThreads = async (courseId, query) => {
  const response = await axios.get(`${BASE_URL}/forum/search`, {
    params: { courseId, query },
  });
  return response.data;
};

// --------- Export All Functions ---------

export default {
  getStudentMetrics,
  getInstructorAnalytics,
  getDownloadableReport,
  createInvitation,
  getMessages,
  sendMessage,
  joinChat,
  sendRealTimeMessage,
  onReceiveMessage,
  createThread,
  addReply,
  searchThreads,
};
