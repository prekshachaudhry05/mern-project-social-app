import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      window.location.href = '/';
      return;
    }

    const decoded = jwtDecode(token);
    const currentUserId = decoded.id;

    axios.get('https://mern-project-social-app-connectify.onrender.com/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setProfile(res.data));

    axios.get('https://mern-project-social-app-connectify.onrender.com/api/posts', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const userPosts = res.data.filter(post => post.user._id === currentUserId);
      setPosts(userPosts);
    });

    fetchFriends();
  }, [token]);

  const fetchFriends = async () => {
    try {
      const res = await axios.get('https://mern-project-social-app-connectify.onrender.com/api/users/my-friends', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(res.data);
    } catch (err) {
      console.error("Failed to load friends", err);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://mern-project-social-app-connectify.onrender.com/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.filter(post => post._id !== postId));
      alert("Post deleted!");
    } catch (error) {
      console.error("Failed to delete post", error);
      alert("Something went wrong");
    }
  };

  const removeFriend = async (friendId) => {
    const confirm = window.confirm("Remove this friend?");
    if (!confirm) return;

    try {
      await axios.post(`https://mern-project-social-app-connectify.onrender.com/api/users/remove-friend/${friendId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFriends();
    } catch (err) {
      console.error("Failed to remove friend", err);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff0f5', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{
        marginTop: '100px',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid #f2c3dc',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <img
            src={profile.avatar ? `https://mern-project-social-app-connectify.onrender.com/${profile.avatar}` : '/images/default-avatar.jpg'}
            alt="avatar"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              backgroundColor: '#f8d7da',
              border: '2px solid #f08080'
            }}
          />
          <div>
            <h2 style={{ marginBottom: '5px', color: '#d63384' }}>{profile.name}</h2>
            <p><b>Email:</b> {profile.email}</p>
            <p><b>Description:</b> {profile.description || 'No description yet.'}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => setShowFriends(!showFriends)} style={greenButton}>
                {showFriends ? "Hide Friends" : "My Friends"}
              </button>
              <button onClick={() => window.location.href = '/edit-profile'} style={blueButton}>
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {showFriends && (
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ color: '#d63384' }}>My Friends</h3>
            {friends.length === 0 ? (
              <p style={{ color: 'gray' }}>No friends yet.</p>
            ) : (
              friends.map(friend => (
                <div key={friend._id} style={friendItemStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={friend.avatar ? `https://mern-project-social-app-connectify.onrender.com/${friend.avatar}` : '/images/default-avatar.jpg'}
                      alt="friend-avatar"
                      width="40"
                      height="40"
                      style={{ borderRadius: '50%', objectFit: 'cover', backgroundColor: '#f8d7da' }}
                    />
                    <span
                      onClick={() => navigate(`/user/${friend._id}`)}
                      style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                    >
                      {friend.name}
                    </span>
                  </div>
                  <button onClick={() => removeFriend(friend._id)} style={redButton}>
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        <div style={{ marginTop: '30px' }}>
          <h3 style={{ color: '#d63384' }}>Your Posts</h3>
          {posts.length === 0 ? (
            <p style={{ color: 'gray' }}>No posts yet.</p>
          ) : (
            posts.map(post => (
              <div key={post._id} style={postCardStyle}>
                <p>{post.text}</p>
                {post.image && (
                  <img
                    src={`https://mern-project-social-app-connectify.onrender.com/${post.image}`}
                    alt="post"
                    width="200"
                    style={{ marginTop: '10px', borderRadius: '6px' }}
                  />
                )}
                <br />
                <small style={{ color: '#888' }}>
                  {new Date(post.createdAt).toLocaleString()}
                </small>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    ...redButton
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

const greenButton = {
  padding: '6px 12px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const blueButton = {
  padding: '6px 12px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const redButton = {
  padding: '4px 10px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const friendItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
  borderBottom: '1px solid #f8d7da',
  paddingBottom: '8px'
};

const postCardStyle = {
  border: '1px solid #e8c6d9',
  borderRadius: '10px',
  padding: '15px',
  marginBottom: '20px',
  position: 'relative',
  backgroundColor: '#fff5f8'
};

export default Profile;
