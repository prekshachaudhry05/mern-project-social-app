import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const CreatePost = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const token = localStorage.getItem('token');

  const submit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('text', text);
    if (image) form.append('image', image);

    try {
      await axios.post('https://mern-project-social-app-connectify.onrender.com/api/posts', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Post created!');
      window.location.href = '/timeline';
    } catch (err) {
      alert('Failed to create post');
    }
  };

  return (
    <div style={{ backgroundColor: '#fefefe', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{
        maxWidth: '500px',
        margin: '100px auto 30px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Create a Post</h2>
        <form onSubmit={submit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            required
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              resize: 'none',
              marginBottom: '15px',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ marginBottom: '15px' }}
          />
          <br />
          <button type="submit" style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#f48fb1',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
