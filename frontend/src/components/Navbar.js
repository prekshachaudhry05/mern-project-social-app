import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.navContent}>
        <h2 style={styles.logo}>Connectify</h2>
        <div style={styles.links}>
          <Link to="/timeline" style={styles.link}>Timeline</Link>
          <Link to="/create-post" style={styles.link}>Create Post</Link>
          <Link to="/profile" style={styles.link}>Profile</Link>
          <Link to="/friend-requests" style={styles.link}>Requests</Link>
          <Link to="/sent-requests" style={styles.link}>Sent</Link>
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
    padding: '0 30px',
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
    gap: '15px',
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
};

export default Navbar;
