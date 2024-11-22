import { io } from 'socket.io-client';

// Connect to the WebSocket backend
const socket = io('http://localhost:3000', {
  transports: ['websocket'], // Ensure WebSocket transport is used
});

// Function to join a chat
export const joinChat = (participants) => {
  socket.emit('joinChat', participants);
};

// Function to send a message
export const sendMessage = (chatId, senderId, message) => {
  socket.emit('sendMessage', { chatId, senderId, message });
};

// Listen for incoming messages
export const onReceiveMessage = (callback) => {
  socket.on('receiveMessage', callback);
};

export default socket;
