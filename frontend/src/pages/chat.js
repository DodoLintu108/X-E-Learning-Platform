import React, { useState, useEffect } from 'react';
import { getMessages, sendMessage } from '../services/api';

const Chat = ({ chatId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const chatMessages = await getMessages(chatId, userId);
      setMessages(chatMessages);
    };

    fetchMessages();
  }, [chatId, userId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await sendMessage(chatId, userId, newMessage);
      setMessages((prev) => [...prev, { senderId: userId, message: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div>
      <h3>Chat</h3>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
