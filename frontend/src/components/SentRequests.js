import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const SentRequests = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, []);

  const fetchAllData = async () => {
    try {
      const [profileRes, usersRes] = await Promise.all([
        axios.get('https://mern-project-social-app-connectify.onrender.com/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('https://mern-project-social-app-connectify.onrender.com/api/users/all-users', {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      setSentRequests(profileRes.data.requestsSent || []);
      setAllUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUserById = (id) => allUsers.find((user) => user._id === id);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Sent Friend Requests</h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#555' }}>Loading...</p>
        ) : sentRequests.length === 0 ? (
          <p style={styles.noRequests}>You haven’t sent any friend requests.</p>
        ) : (
          sentRequests.map((id) => {
            const user = getUserById(id);
            if (!user) return null;

            return (
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
                <div>
                  <p><strong>{user.name}</strong></p>
                  <p style={styles.email}>{user.email}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '80px 20px 20px',
    maxWidth: '700px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    color: '#d63384',
    textAlign: 'center',
    marginBottom: '20px'
  },
  noRequests: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#555'
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffe6f0',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
    gap: '15px'
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  email: {
    fontSize: '14px',
    color: '#555'
  }
};

export default SentRequests;
