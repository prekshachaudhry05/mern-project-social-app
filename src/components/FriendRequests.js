import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('https://mern-project-social-app-connectify.onrender.com/api/users/requests-received', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      alert('Failed to fetch friend requests');
    }
  };

  const handleAction = async (id, action) => {
    try {
      await axios.post(`https://mern-project-social-app-connectify.onrender.com/api/users/${action}-request/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus(prev => ({ ...prev, [id]: action }));
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch {
      alert('Action failed.');
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
          Friend Requests
        </h2>

        {requests.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>No friend requests</p>
        ) : (
          requests.map(req => (
            <div
              key={req._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                borderBottom: '1px solid #fce4ec'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={req.avatar ? `https://mern-project-social-app-connectify.onrender.com/${req.avatar}` : '/images/default-avatar.jpg'}
                  width="40"
                  height="40"
                  style={{ borderRadius: '50%', objectFit: 'cover', backgroundColor: '#eee' }}
                  alt="avatar"
                />
                <span style={{ fontWeight: '500', color: '#333' }}>{req.name}</span>
              </div>

              {status[req._id] ? (
                <span style={{
                  color: status[req._id] === 'accept' ? '#388e3c' : '#aaa',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {status[req._id] === 'accept' ? 'Accepted' : 'Rejected'}
                </span>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleAction(req._id, 'accept')}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#66bb6a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(req._id, 'reject')}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#ef5350',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
