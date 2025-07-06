import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Navbar = () => {
  const [name, setName] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const res = await axios.get('https://mern-project-social-app-connectify.onrender.com/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.name);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div style={navbarStyle}>
      <div style={leftLinksStyle}>
        <a href="/timeline" style={navLink}>🕒 Timeline</a>
        <a href="/create" style={navLink}>➕ Create Post</a>
        <a href="/requests" style={navLink}>📥 Requests</a>
        <a href="/sent-requests" style={navLink}>📤 Sent</a>
        <a href="/profile" style={navLink}>👤 Profile</a>
      </div>

      <div style={rightSideStyle}>
        {name && <span style={{ color: '#c2185b', fontWeight: 'bold' }}>{name}</span>}
        <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>
    </div>
  );
};

// ✨ Light Pink Theme Styles
const navbarStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '60px',
  backgroundColor: '#ffe4ec',  // light pink background
  borderBottom: '2px solid #f8c6d9',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 25px',
  zIndex: 1000,
  fontFamily: 'sans-serif'
};

const leftLinksStyle = {
  display: 'flex',
  gap: '30px',
};

const navLink = {
  textDecoration: 'none',
  fontWeight: 'bold',
  color: '#d63384',
  fontSize: '16px'
};

const rightSideStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  fontSize: '16px',
};

const logoutButtonStyle = {
  padding: '6px 12px',
  backgroundColor: '#f06292',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default Navbar;
