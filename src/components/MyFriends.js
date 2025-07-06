import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const MyFriends = () => {
  const [friends, setFriends] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('https://mern-project-social-app-connectify.onrender.com/api/friends', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setFriends(res.data));
  }, [token]);

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
        <h2 style={{ textAlign: 'center', color: '#f06292', marginBottom: '20px' }}>My Friends</h2>

        {friends.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'gray' }}>You have no friends yet</p>
        ) : (
          friends.map(friend => (
            <div key={friend._id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #eee',
              padding: '12px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={friend.avatar ? `https://mern-project-social-app-connectify.onrender.com/${friend.avatar}` : '/images/default-avatar.jpg'}
                  alt="avatar"
                  width="40"
                  height="40"
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: '500', color: '#333' }}>{friend.name}</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#777' }}>{friend.email}</p>
                </div>
              </div>
              <a
                href={`/user/${friend._id}`}
                style={{
                  backgroundColor: '#f48fb1',
                  color: 'white',
                  textDecoration: 'none',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '14px'
                }}
              >
                View
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyFriends;
