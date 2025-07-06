import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { jwtDecode } from 'jwt-decode';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');
  const currentUserId = jwtDecode(token).id;

  useEffect(() => {
    axios.get('https://mern-project-social-app-connectify.onrender.com/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const filtered = res.data.filter(user => user._id !== currentUserId);
      setUsers(filtered);
    });
  }, [token, currentUserId]);

  const sendRequest = async (id) => {
    try {
      await axios.post(`https://mern-project-social-app-connectify.onrender.com/api/friends/request/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Friend request sent');
    } catch (err) {
      alert('Request failed');
    }
  };

  return (
    <div style={{ backgroundColor: '#fefefe', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{
        maxWidth: '700px',
        margin: '100px auto 30px auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{ textAlign: 'center', color: '#f06292', marginBottom: '20px' }}>All Users</h2>

        {users.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'gray' }}>No other users found</p>
        ) : (
          users.map(user => (
            <div key={user._id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #eee',
              padding: '12px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={user.avatar ? `https://mern-project-social-app-connectify.onrender.com/${user.avatar}` : '/images/default-avatar.jpg'}
                  alt="avatar"
                  width="40"
                  height="40"
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: '500', color: '#333' }}>{user.name}</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#777' }}>{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => sendRequest(user._id)}
                style={{
                  backgroundColor: '#f48fb1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  cursor: 'pointer'
                }}
              >
                Add Friend
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllUsers;
