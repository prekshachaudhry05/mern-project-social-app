import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const MyFriends = () => {
  const [friends, setFriends] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await axios.get('https://mern-project-social-app-connectify.onrender.com/api/users/my-friends', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(res.data);
    } catch (err) {
      console.error('Failed to fetch friends', err);
    }
  };

  const removeFriend = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;
    try {
      await axios.post(
        `https://mern-project-social-app-connectify.onrender.com/api/users/remove-friend/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFriends();
    } catch (err) {
      alert('Failed to remove friend');
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>My Friends</h2>
        {friends.length === 0 ? (
          <p>No friends yet.</p>
        ) : (
          friends.map((user) => (
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
                <button onClick={() => removeFriend(user._id)} style={styles.removeBtn}>
                  Remove
                </button>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  removeBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default MyFriends;
