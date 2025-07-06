import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Navbar from './Navbar';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';

const Timeline = () => {
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  

  const token = localStorage.getItem('token');

  useEffect(() => {
    const initialize = async () => {
      if (!token) {
        window.location.href = '/';
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id);

        const [userRes, postsRes, usersRes] = await Promise.all([
          axios.get('https://mern-project-social-app-connectify.onrender.com/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://mern-project-social-app-connectify.onrender.com/api/posts', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://mern-project-social-app-connectify.onrender.com/api/users/all-users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCurrentUser(userRes.data);
        setPosts(postsRes.data);
        setAllUsers(usersRes.data);
      } catch (err) {
        console.error('Initialization error:', err);
        if (err.response?.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/';
        }
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [token]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`https://mern-project-social-app-connectify.onrender.com/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLikeToggle = async (post) => {
    const liked = post.likes.includes(currentUserId);
    const endpoint = liked ? 'unlike' : 'like';
    try {
      await axios.post(
        `https://mern-project-social-app-connectify.onrender.com/api/posts/${post._id}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = await axios.get('https://mern-project-social-app-connectify.onrender.com/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Like/unlike failed', err);
    }
  };

  const handleCommentSubmit = async (postId, commentText) => {
    try {
      await axios.post(
        `https://mern-project-social-app-connectify.onrender.com/api/posts/${postId}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get('https://mern-project-social-app-connectify.onrender.com/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Comment failed', err);
    }
  };

const sendFriendRequest = async (userId) => {
  try {
    await axios.post(
      `https://mern-project-social-app-connectify.onrender.com/api/users/send-request/${userId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Optimistically update currentUser.requestsSent
    setCurrentUser((prev) => ({
      ...prev,
      requestsSent: [...prev.requestsSent, userId],
    }));
  } catch (err) {
    alert('Request failed or already sent.');
  }
};


  const visiblePosts = currentUser
    ? posts.filter(
        (post) =>
          currentUser.friends.includes(post.user._id) ||
          post.user._id === currentUser._id
      )
    : [];

const suggestionUsers = allUsers.filter(
  (user) =>
    !currentUser?.friends.includes(user._id) &&
    !currentUser?.requestsSent.includes(user._id) &&
    user._id !== currentUserId
);


  const toggleDetails = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const toggleSuggestions = () => {
    setShowSuggestions((prev) => !prev);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
  <div style={{ backgroundColor: '#fefefe', minHeight: '100vh', fontFamily: 'sans-serif' }}>
    <Navbar />
    <div style={{ marginTop: '70px', display: 'flex', padding: '20px' }}>
      <div style={{ flex: 3, paddingRight: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Your Timeline</h2>
          <button onClick={toggleSuggestions} style={{
            padding: '10px 12px',
            fontSize: '14px',
            backgroundColor: '#f48fb1',
            color: 'Black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            {showSuggestions ? 'Hide Suggestions' : 'Show Suggestions'}
          </button>
        </div>

        {visiblePosts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#777' }}>
            <p>No posts to display. Send friend requests to view others' posts.</p>
          </div>
        ) : (
          visiblePosts.map((post) => {
            const avatarSrc = post.user.avatar
              ? `https://mern-project-social-app-connectify.onrender.com/${post.user.avatar}`
              : '/images/default-avatar.jpg';
            const isOwnPost = post.user._id === currentUserId;
            const liked = post.likes.includes(currentUserId);

            return (
              <div key={post._id} style={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '10px',
                marginBottom: '20px',
                padding: '15px',
                boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
                position: 'relative'
              }}>
                {isOwnPost && (
                  <button onClick={() => handleDelete(post._id)} style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#f44336',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}>
                    Delete
                  </button>
                )}

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <img src={avatarSrc} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <a href={`/user/${post.user._id}`} style={{ marginLeft: '10px', fontWeight: 'bold', color: '#f06292', textDecoration: 'none' }}>
                    {post.user.name}
                  </a>
                </div>

                <p style={{ marginBottom: '10px' }}>{post.text}</p>

                {post.image && (
                  <img src={`https://mern-project-social-app-connectify.onrender.com/${post.image}`} alt="post" width="100%" style={{
                    maxWidth: '400px',
                    borderRadius: '6px',
                    marginTop: '10px'
                  }} />
                )}
                <br />
                <small style={{ color: '#999' }}>{new Date(post.createdAt).toLocaleString()}</small>
                <br />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => handleLikeToggle(post)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    {liked ? <FaHeart color="red" /> : <FaRegHeart />}
                  </button>
                  <span>{post.likes.length} likes</span>
                  <button onClick={() => toggleDetails(post._id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <FaComment />
                  </button>
                  <span>{post.comments.length} comments</span>
                </div>

                {expandedPostId === post._id && (
                  <div style={{ marginTop: '15px' }}>
                    <h4 style={{ marginBottom: '10px' }}>Comments</h4>
                    {post.comments.map((c, i) => (
                      <p key={i} style={{ marginBottom: '5px' }}>
                        <strong>{c.user.name}:</strong> {c.text}
                      </p>
                    ))}
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleCommentSubmit(post._id, e.target.comment.value);
                      e.target.comment.value = '';
                    }}>
                      <input
                        name="comment"
                        placeholder="Add a comment..."
                        required
                        style={{
                          width: '80%',
                          padding: '6px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          marginRight: '6px'
                        }}
                      />
                      <button type="submit" style={{
                        backgroundColor: '#f48fb1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        cursor: 'pointer'
                      }}>Post</button>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {showSuggestions && (
        <div style={{
          flex: 1,
          backgroundColor: '#fdfdfd',
          borderLeft: '1px solid #eee',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: 'inset 0 0 4px #eee',
          height: 'fit-content'
        }}>
          <h3 style={{ color: '#444' }}>People You May Know</h3>
          {suggestionUsers.length === 0 ? (
            <p>No suggestions</p>
          ) : (
            suggestionUsers.map((user) => (
              <div key={user._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <img
                  src={user.avatar ? `https://mern-project-social-app-connectify.onrender.com/${user.avatar}` : '/images/default-avatar.jpg'}
                  alt="user avatar"
                  width="36"
                  height="36"
                  style={{ borderRadius: '50%' }}
                />
                <a href={`/user/${user._id}`} style={{ marginLeft: '10px', color: '#f06292', flexGrow: 1, textDecoration: 'none' }}>
                  {user.name}
                </a>
                <button
                  onClick={() => sendFriendRequest(user._id)}
                  disabled={currentUser?.requestsSent.includes(user._id)}
                  style={{
                    backgroundColor: currentUser?.requestsSent.includes(user._id) ? '#ccc' : '#f48fb1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    cursor: currentUser?.requestsSent.includes(user._id) ? 'default' : 'pointer'
                  }}
                >
                  {currentUser?.requestsSent.includes(user._id) ? 'Sent' : 'Add'}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  </div>
);
};

export default Timeline;
