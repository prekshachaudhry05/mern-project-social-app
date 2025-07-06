// Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('https://mern-project-social-app-connectify.onrender.com/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Failed to load profile', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get('https://mern-project-social-app-connectify.onrender.com/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.filter(p => p.user._id === user?._id));
    } catch (err) {
      console.error('Failed to load posts', err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`https://mern-project-social-app-connectify.onrender.com/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post', err);
    }
  };

  if (!user) return <div>Loading...</div>;

  const avatarSrc = user.avatar
    ? `https://mern-project-social-app-connectify.onrender.com/${user.avatar}`
    : '/images/default-avatar.jpg';

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: '70px', padding: '20px', backgroundColor: '#ffe6f0', minHeight: '100vh' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <img src={avatarSrc} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginRight: '20px' }} />
          <div>
            <h2 style={{ margin: 0 }}>{user.name}</h2>
            <p style={{ margin: '5px 0', color: '#666' }}>{user.email}</p>
            {user.description && <p style={{ marginTop: '5px' }}>{user.description}</p>}
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => navigate('/edit-profile')} style={buttonStyle}>Edit Profile</button>
              <button onClick={() => navigate('/my-friends')} style={{ ...buttonStyle, marginLeft: '10px' }}>My Friends</button>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '10px' }}>My Posts</h3>
          {posts.length === 0 ? (
            <p>No posts yet</p>
          ) : (
            posts.map(post => (
              <div key={post._id} style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#fff',
                padding: '10px',
                marginBottom: '15px',
                position: 'relative'
              }}>
                <p>{post.text}</p>
                {post.image && <img src={`https://mern-project-social-app-connectify.onrender.com/${post.image}`} alt="post" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', marginTop: '10px' }} />}
                <small style={{ color: 'gray', fontSize: '12px' }}>{new Date(post.createdAt).toLocaleString()}</small>
                <button
                  onClick={() => handleDelete(post._id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#d9534f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '6px 12px',
  backgroundColor: '#f06292',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default Profile;
