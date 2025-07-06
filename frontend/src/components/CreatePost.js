import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text && !image) {
      alert('Please enter some text or upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('text', text);
    if (image) formData.append('image', image);

    try {
      await axios.post(
        'https://mern-project-social-app-connectify.onrender.com/api/posts',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert('Post created successfully');
      navigate('/timeline');
    } catch (err) {
      alert('Failed to create post');
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.heading}>Create a Post</h2>
          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="4"
            style={styles.textarea}
          ></textarea>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={styles.fileInput}
          />
          <button type="submit" style={styles.button}>Post</button>
        </form>
      </div>
    </>
  );
};

const styles = {
  container: {
    marginTop: '80px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#ffe4e6',
    height: '100vh',
  },
  form: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  heading: {
    textAlign: 'center',
    color: '#ff69b4',
    marginBottom: '10px',
  },
  textarea: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    resize: 'none',
  },
  fileInput: {
    padding: '5px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#ff69b4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default CreatePost;
