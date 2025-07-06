import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [hasAvatar, setHasAvatar] = useState(false);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        'https://mern-project-social-app-connectify.onrender.com/api/users/profile',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setName(res.data.name || '');
      setDescription(res.data.description || '');
      if (res.data.avatar) {
        setPreview(`https://mern-project-social-app-connectify.onrender.com/${res.data.avatar}`);
        setHasAvatar(true);
      } else {
        setPreview('/images/default-avatar.jpg');
        setHasAvatar(false);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm('Are you sure you want to remove your avatar?')) return;
    try {
      await axios.put(
        'https://mern-project-social-app-connectify.onrender.com/api/users/profile',
        { removeAvatar: true, name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setPreview('/images/default-avatar.jpg');
      setHasAvatar(false);
    } catch (err) {
      alert('Failed to remove avatar');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (avatar) formData.append('avatar', avatar);

    try {
      await axios.put(
        'https://mern-project-social-app-connectify.onrender.com/api/users/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Profile updated!');
      navigate('/profile');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <form onSubmit={handleUpdate} style={styles.form}>
          <h2 style={styles.heading}>Edit Profile</h2>

          <label style={styles.label}>Name:</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={styles.textarea}
          />

          <div style={styles.avatarSection}>
            <img
              src={preview}
              alt="avatar"
              style={styles.avatar}
            />
            {hasAvatar && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                style={styles.removeBtn}
              >
                Remove Avatar
              </button>
            )}
          </div>

          <label style={styles.label}>Upload New Avatar:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            style={styles.inputFile}
          />

          <button type="submit" style={styles.button}>Update</button>
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
    minHeight: '100vh',
    padding: '30px 0',
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
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  input: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  textarea: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    resize: 'none',
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
  },
  removeBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '6px 10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  inputFile: {
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#ff69b4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default EditProfile;
