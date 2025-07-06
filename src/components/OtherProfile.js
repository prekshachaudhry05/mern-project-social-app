import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

const OtherProfile = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const [data, setData] = useState(null);
  const [showFriends, setShowFriends] = useState(false);

  useEffect(() => {
    if (!token) return (window.location.href = '/');
    axios.get(`https://mern-project-social-app-connectify.onrender.com/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setData(res.data));
  }, [id, token]);

  if (!data) return <div>Loading...</div>;

  const { user, posts, friends } = data;

  return (
    <div style={{ backgroundColor: '#fff0f5', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={containerStyle}>
        <div style={headerStyle}>
          <img
            src={user.avatar ? `https://mern-project-social-app-connectify.onrender.com/${user.avatar}` : '/images/default-avatar.jpg'}
            alt="avatar"
            style={avatarStyle}
          />
          <div>
            <h2 style={{ color: '#d63384' }}>{user.name}</h2>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Description:</b> {user.description || 'No description yet'}</p>
            <button onClick={() => setShowFriends(!showFriends)} style={buttonStyle}>
              {showFriends ? 'Hide Friends' : 'Show Friends'}
            </button>
          </div>
        </div>

        {showFriends && (
          <div style={{ marginTop: '25px' }}>
            <h3 style={sectionHeading}>Friends of {user.name}</h3>
            {friends.length === 0 ? (
              <p style={{ color: 'gray' }}>No friends.</p>
            ) : (
              friends.map(friend => (
                <div key={friend._id} style={friendCardStyle}>
                  <img
                    src={friend.avatar ? `https://mern-project-social-app-connectify.onrender.com/${friend.avatar}` : '/images/default-avatar.jpg'}
                    alt="friend avatar"
                    width="40"
                    height="40"
                    style={friendAvatarStyle}
                  />
                  <span>{friend.name}</span>
                </div>
              ))
            )}
          </div>
        )}

        <div style={{ marginTop: '30px' }}>
          <h3 style={sectionHeading}>Posts by {user.name}</h3>
          {posts.map(post => (
            <div key={post._id} style={postCardStyle}>
              <p>{post.text}</p>
              {post.image && (
                <img
                  src={`https://mern-project-social-app-connectify.onrender.com/${post.image}`}
                  alt="post"
                  width="200"
                  style={{ marginTop: '10px', borderRadius: '4px' }}
                />
              )}
              <br />
              <small style={{ color: 'gray' }}>{new Date(post.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  marginTop: '100px',
  maxWidth: '800px',
  marginLeft: 'auto',
  marginRight: 'auto',
  backgroundColor: '#ffffff',
  padding: '25px',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
};

const headerStyle = {
  display: 'flex',
  gap: '30px',
  alignItems: 'center'
};

const avatarStyle = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  objectFit: 'cover',
  backgroundColor: '#eee',
  border: '2px solid #f8bbd0'
};

const buttonStyle = {
  marginTop: '10px',
  padding: '6px 12px',
  backgroundColor: '#e91e63',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const sectionHeading = {
  color: '#c2185b',
  marginBottom: '15px'
};

const friendCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '10px',
  paddingBottom: '8px',
  borderBottom: '1px solid #f8bbd0'
};

const friendAvatarStyle = {
  borderRadius: '50%',
  objectFit: 'cover',
  backgroundColor: '#eee'
};

const postCardStyle = {
  border: '1px solid #f3c2d5',
  borderRadius: '6px',
  padding: '10px',
  marginBottom: '15px',
  backgroundColor: '#fdfdfd'
};

export default OtherProfile;
