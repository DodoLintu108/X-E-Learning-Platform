import React, { useState } from 'react';
import { createThread, addReply, searchThreads } from '../services/api'; // Updated import for integration

const Forum = () => {
  const [threads, setThreads] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newReplyContent, setNewReplyContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const courseId = 'course123'; // Example course ID
  const userId = 'student123'; // Example user ID

  const handleCreateThread = async () => {
    if (newThreadTitle.trim()) {
      const thread = await createThread(courseId, newThreadTitle, userId);
      setThreads((prevThreads) => [...prevThreads, thread]); // Add new thread to the list
      setNewThreadTitle(''); // Clear input
    }
  };

  const handleAddReply = async (threadId) => {
    if (newReplyContent.trim()) {
      const updatedThread = await addReply(courseId, threadId, newReplyContent, userId);
      setThreads((prevThreads) =>
        prevThreads.map((thread) => (thread.threadId === threadId ? updatedThread : thread))
      );
      setNewReplyContent(''); // Clear input
    }
  };

  const handleSearchThreads = async () => {
    if (searchQuery.trim()) {
      const results = await searchThreads(courseId, searchQuery);
      setThreads(results.threads || []); // Update threads with search results
    }
  };

  return (
    <div style={styles.container}>
      <h1>Discussion Forum</h1>
      <div style={styles.newThread}>
        <input
          type="text"
          placeholder="Create a new thread..."
          value={newThreadTitle}
          onChange={(e) => setNewThreadTitle(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleCreateThread} style={styles.button}>
          Create Thread
        </button>
      </div>
      <div style={styles.search}>
        <input
          type="text"
          placeholder="Search threads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearchThreads} style={styles.button}>
          Search
        </button>
      </div>
      <div>
        {threads.map((thread) => (
          <div key={thread.threadId} style={styles.thread}>
            <h3>{thread.title}</h3>
            <ul>
              {thread.replies.map((reply) => (
                <li key={reply.replyId}>
                  <strong>{reply.authorId}</strong>: {reply.content}
                </li>
              ))}
            </ul>
            <div style={styles.newReply}>
              <input
                type="text"
                placeholder="Write a reply..."
                value={newReplyContent}
                onChange={(e) => setNewReplyContent(e.target.value)}
                style={styles.input}
              />
              <button onClick={() => handleAddReply(thread.threadId)} style={styles.button}>
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  newThread: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  search: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  thread: {
    marginBottom: '20px',
    border: '1px solid #ccc',
    padding: '10px',
  },
  newReply: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4A90E2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Forum;
