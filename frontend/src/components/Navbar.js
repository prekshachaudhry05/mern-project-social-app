import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          'https://mern-project-social-app-connectify.onrender.com/api/users/profile',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data); // store full user object
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    if (token) fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const avatarSrc = user?.avatar
    ? `https://mern-project-social-app-connectify.onrender.com/${user.avatar}`
    : '/images/default-avatar.jpg';

  return (
    <div style={styles.navbar}>
      <div style={styles.navContent}>
        <h2 style={styles.logo}>Connectify</h2>
        <div style={styles.links}>
          <Link to="/timeline" style={styles.link}>Timeline</Link>
          <Link to="/create-post" style={styles.link}>Create Post</Link>
          <Link to="/profile" style={styles.link}>Profile</Link>
          <Link to="/friend-requests" style={styles.link}>Requests</Link>

          {user && (
            <div style={styles.userInfo}>
              <img
                src={avatarSrc}
                alt="avatar"
                style={styles.avatar}
              />
              <Link to="/profile" style={styles.username}>{user.name}</Link>
            </div>
          )}

          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: '#ff69b4',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1000,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  navContent: {
    width: '100%',
    padding: '0 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: '#fff',
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '500',
  },
  logoutBtn: {
    backgroundColor: '#fff',
    color: '#ff69b4',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginRight: '10px',
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid white',
  },
  username: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

export default Navbar;
