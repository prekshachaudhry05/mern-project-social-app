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

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode(token);
    setCurrentUserId(decoded.id);

    fetchCurrentUser();
    fetchAllUsers();
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('https://mern-project-social-app-connectify.onrender.com/api/users/profile', {
        headers: { Authorization:  `Bearer ${token}` },
      });
      setCurrentUser(res.data);
    } catch (err) {
      console.error('Failed to load user', err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get('https://mern-project-social-app-connectify.onrender.com/api/users/all-users', {
        headers: { Authorization:  `Bearer ${token}` },
      });
      setAllUsers(res.data);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get('https://mern-project-social-app-connectify.onrender.com/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
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
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLikeToggle = async (post) => {
    const liked = post.likes.includes(currentUserId);
    const endpoint = liked ? 'unlike' : 'like';

    try {
      await axios.post(`https://mern-project-social-app-connectify.onrender.com/api/posts/${post._id}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
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
      fetchPosts();
    } catch (err) {
      console.error('Comment failed', err);
    }
  };

  const toggleDetails = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const toggleSuggestions = () => {
    setShowSuggestions((prev) => !prev);
  };

  const sendFriendRequest = async (userId) => {
    try {
      await axios.post(`https://mern-project-social-app-connectify.onrender.com/api/users/send-request/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCurrentUser();
    } catch (err) {
      alert('Request failed or already sent.');
    }
  };

  const visiblePosts = currentUser
    ? posts.filter(
        (post) => currentUser.friends.includes(post.user._id) || post.user._id === currentUser._id
      )
    : [];

  const suggestionUsers = allUsers.filter(
    (user) =>
      !currentUser?.friends.includes(user._id) &&
      !currentUser?.requestsSent.includes(user._id) &&
      user._id !== currentUserId
  );

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: '70px', display: 'flex' }}>
        {/* MAIN FEED */}
        <div style={{ flex: 3, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: '#d63384' }}>Timeline</h2>
            <button
              onClick={toggleSuggestions}
              style={{
                padding: '6px 12px',
                backgroundColor: '#d63384',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {showSuggestions ? 'Hide Suggestions' : 'Suggestions'}
            </button>
          </div>

          {visiblePosts.map((post) => {
            const avatarSrc = post.user.avatar
              ? `https://mern-project-social-app-connectify.onrender.com/${post.user.avatar}`
              : '/images/default-avatar.jpg';
            const isOwnPost = post.user._id === currentUserId;
            const liked = post.likes.includes(currentUserId);

            return (
              <div
                key={post._id}
                style={{
                  border: '1px solid lightgray',
                  backgroundColor: '#ffe6f0',
                  margin: '15px 0',
                  padding: '15px',
                  borderRadius: '8px',
                  position: 'relative',
                }}
              >
                {isOwnPost && (
                  <button
                    onClick={() => handleDelete(post._id)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <p><b>{post.user.name}</b></p>
                </div>
                <p>{post.text}</p>
                {post.image && (
                  <img
                    src={`https://mern-project-social-app-connectify.onrender.com/${post.image}`}
                    alt="post"
                    width={250}
                    style={{ marginTop: '10px', borderRadius: '4px' }}
                  />
                )}
                <br />
                <small style={{ color: 'gray', fontSize: '12px' }}>
                  {new Date(post.createdAt).toLocaleString()}
                </small>
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
                  <div style={{ marginTop: '10px' }}>
                    <h4>Comments:</h4>
                    {post.comments.map((c, i) => (
                      <p key={i}><b>{c.user.name}:</b> {c.text}</p>
                    ))}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCommentSubmit(post._id, e.target.comment.value);
                        e.target.comment.value = '';
                      }}
                    >
                      <input
                        name="comment"
                        placeholder="Add a comment..."
                        required
                        style={{ padding: '5px', width: '80%', marginRight: '10px' }}
                      />
                      <button type="submit" style={{
                        padding: '6px 12px',
                        backgroundColor: '#d63384',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}>
                        Post
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SUGGESTIONS SIDEBAR */}
        {showSuggestions && (
          <div
            style={{
              flex: 1,
              backgroundColor: '#fff0f5',
              borderLeft: '1px solid #ddd',
              padding: '20px',
              maxHeight: '100vh',
              overflowY: 'auto',
            }}
          >
            <h3 style={{ color: '#d63384' }}>People You May Know</h3>
            {suggestionUsers.length === 0 ? (
              <p>No suggestions</p>
            ) : (
              suggestionUsers.map((user) => (
                <div
                  key={user._id}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}
                >
                  <img
                    src={
                      user.avatar
                        ? `https://mern-project-social-app-connectify.onrender.com/${user.avatar}`
                        : '/images/default-avatar.jpg'
                    }
                    width="40"
                    height="40"
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                    alt="suggestion"
                  />
                  <span>{user.name}</span>
                  <button
                    onClick={() => sendFriendRequest(user._id)}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Add
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
