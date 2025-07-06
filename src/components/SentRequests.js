import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const SentRequests = () => {
  const [requestsSent, setRequestsSent] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSentRequests();
  }, []);

  const fetchSentRequests = async () => {
    try {
      const res = await axios.get('https://mern-project-social-app-connectify.onrender.com/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequestsSent(res.data.requestsSent || []);
    } catch (err) {
      console.error("Failed to fetch sent requests", err);
    }
  };

  return (
    <div style={{ backgroundColor: '#fef2f7', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{
        maxWidth: '600px',
        margin: '100px auto 30px auto',
        padding: '20px',
        border: '1px solid #f8bbd0',
        borderRadius: '8px',
        backgroundColor: '#fff0f5',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#e91e63',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          Sent Friend Requests
        </h2>

        {requestsSent.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>No sent requests</p>
        ) : (
          requestsSent.map((user) => (
            <div key={user._id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px',
              borderBottom: '1px solid #fce4ec'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={user.avatar ? `https://mern-project-social-app-connectify.onrender.com/${user.avatar}` : '/images/default-avatar.jpg'}
                  width="40"
                  height="40"
                  style={{ borderRadius: '50%', objectFit: 'cover', backgroundColor: '#eee' }}
                  alt="avatar"
                />
                <span style={{ fontWeight: '500', color: '#333' }}>{user.name}</span>
              </div>
              <span style={{
                color: '#d81b60',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                (Pending)
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SentRequests;
