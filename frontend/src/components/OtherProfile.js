import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

const OtherProfile = () => {
  const { userId } = useParams();
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchUserPosts();
    fetchFriends();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`https://mern-project-social-app-connectify.onrender.com/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get('https://mern-project-social-app-connectify.onrender.com/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter(post => post.user._id === userId);
      setPosts(filtered);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`https://mern-project-social-app-connectify.onrender.com/api/users/${userId}/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(res.data);
    } catch (err) {
      console.error("Failed to fetch friends", err);
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.profileBox}>
          <img
            src={user.avatar ? `https://mern-project-social-app-connectify.onrender.com/${user.avatar}` : '/images/default-avatar.jpg'}
            alt="avatar"
            style={styles.avatar}
          />
          <div>
            <h2 style={styles.name}>{user.name}</h2>
            <p style={styles.email}>{user.email}</p>
            <p style={styles.desc}>{user.description}</p>
            <button onClick={() => setShowFriends(!showFriends)} style={styles.friendBtn}>
              {showFriends ? "Hide Friends" : "Show Friends"}
            </button>
            {showFriends && (
              <div style={styles.friendList}>
                {friends.length === 0 ? <p>No friends</p> : friends.map(friend => (
                  <p key={friend._id}>{friend.name}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <h3 style={styles.sectionTitle}>Posts by {user.name}</h3>
        {posts.map(post => (
          <div key={post._id} style={styles.post}>
            <p>{post.text}</p>
            {post.image && (
              <img
                src={`https://mern-project-social-app-connectify.onrender.com/${post.image}`}
                alt="post"
                style={styles.postImage}
              />
            )}
            <small style={styles.timestamp}>{new Date(post.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </>
  );
};

const styles = {
  container: {
    marginTop: '80px',
    padding: '30px',
    backgroundColor: '#fff0f5',
    minHeight: '100vh',
  },
  profileBox: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '20px',
  },
  name: {
    margin: '0 0 5px',
    color: '#ff69b4',
  },
  email: {
    margin: '0 0 10px',
    fontStyle: 'italic',
    color: '#333',
  },
  desc: {
    marginBottom: '10px',
    fontWeight: '500',
  },
  friendBtn: {
    backgroundColor: '#ff69b4',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '5px',
  },
  friendList: {
    marginTop: '10px',
    paddingLeft: '10px',
    color: '#444',
  },
  sectionTitle: {
    color: '#ff69b4',
    marginTop: '40px',
    marginBottom: '15px',
  },
  post: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '15px',
  },
  postImage: {
    maxWidth: '100%',
    marginTop: '10px',
    borderRadius: '8px',
  },
  timestamp: {
    color: '#888',
    fontSize: '12px',
    marginTop: '5px',
    display: 'block',
  },
};

export default OtherProfile;
