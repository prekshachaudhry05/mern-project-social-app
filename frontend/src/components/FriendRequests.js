import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('https://mern-project-social-app-connectify.onrender.com/api/users/requests-received', {
        headers: { Authorization: token },
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  const handleAccept = async (userId) => {
    try {
      await axios.post(
        `https://mern-project-social-app-connectify.onrender.com/api/users/accept-request/${userId}`,
        {},
        { headers: { Authorization: token } }
      );
      fetchRequests();
    } catch (err) {
      alert('Failed to accept request');
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.post(
        `https://mern-project-social-app-connectify.onrender.com/api/users/reject-request/${userId}`,
        {},
        { headers: { Authorization: token } }
      );
      fetchRequests();
    } catch (err) {
      alert('Failed to reject request');
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Friend Requests</h2>
        {requests.length === 0 ? (
          <p>No incoming requests</p>
        ) : (
          requests.map((user) => (
            <div key={user._id} style={styles.card}>
              <img
                src={
                  user.avatar
                    ? `https://mern-project-social-app-connectify.onrender.com/${user.avatar}`
                    : '/images/default-avatar.jpg'
                }
                alt="avatar"
                style={styles.avatar}
              />
              <div style={styles.userInfo}>
                <p style={styles.name}>{user.name}</p>
                <div style={styles.buttons}>
                  <button onClick={() => handleAccept(user._id)} style={styles.accept}>
                    Accept
                  </button>
                  <button onClick={() => handleReject(user._id)} style={styles.reject}>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    marginTop: '80px',
    padding: '30px',
    backgroundColor: '#ffe4e6',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    color: '#ff69b4',
    marginBottom: '30px',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '15px',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '15px',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
  },
  accept: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  reject: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default FriendRequests;
