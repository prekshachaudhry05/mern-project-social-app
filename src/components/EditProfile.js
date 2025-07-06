import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const EditProfile = () => {
  const [profile, setProfile] = useState({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return (window.location.href = '/');
    axios.get('https://mern-project-social-app-connectify.onrender.com/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setProfile(res.data);
      setName(res.data.name);
      setDescription(res.data.description || '');
    });
  }, [token]);

  const handleRemovePhoto = () => {
    const confirm = window.confirm("Are you sure you want to remove your avatar?");
    if (!confirm) return;

    setRemoveAvatar(true);
    setAvatar(null);
    setProfile(prev => ({ ...prev, avatar: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', name);
    form.append('description', description);
    if (avatar) form.append('avatar', avatar);
    if (removeAvatar) form.append('removeAvatar', 'true');

    try {
      await axios.put('https://mern-project-social-app-connectify.onrender.com/api/users/profile', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Profile updated!');
      window.location.href = '/profile';
    } catch (err) {
      alert('Failed to update profile');
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (!confirm) return;

    try {
      await axios.delete('https://mern-project-social-app-connectify.onrender.com/api/users/delete', {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (err) {
      alert('Failed to delete account');
      console.error(err);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff0f5', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={containerStyle}>
        <h2 style={headingStyle}>Edit Profile</h2>

        <img
          src={profile.avatar ? `https://mern-project-social-app-connectify.onrender.com/${profile.avatar}` : '/images/default-avatar.jpg'}
          alt="avatar"
          style={avatarStyle}
        />

        <div style={{ marginTop: '10px' }}>
          {profile.avatar && (
            <button onClick={handleRemovePhoto} style={removeButtonStyle}>
              Remove Photo
            </button>
          )}
          <br /><br />
          <label style={{ fontWeight: 'bold', color: '#c2185b' }}>
            Change Photo:
            <input
              type="file"
              onChange={e => {
                setAvatar(e.target.files[0]);
                setRemoveAvatar(false);
              }}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            required
            style={inputStyle}
          />
          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (optional)"
            style={inputStyle}
          />
          <button type="submit" style={saveButtonStyle}>Save Changes</button>
        </form>

        <button onClick={handleDeleteAccount} style={deleteButtonStyle}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

// 🌸 Theme styles
const containerStyle = {
  marginTop: '100px',
  maxWidth: '450px',
  marginLeft: 'auto',
  marginRight: 'auto',
  backgroundColor: '#fff',
  padding: '25px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  textAlign: 'center'
};

const headingStyle = {
  color: '#d63384',
  marginBottom: '20px'
};

const avatarStyle = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid #f8bbd0',
  marginBottom: '10px'
};

const inputStyle = {
  display: 'block',
  margin: '12px auto',
  padding: '10px',
  width: '100%',
  border: '1px solid #ccc',
  borderRadius: '6px'
};

const saveButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#e91e63',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '10px'
};

const deleteButtonStyle = {
  marginTop: '30px',
  padding: '10px 20px',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const removeButtonStyle = {
  backgroundColor: '#6c757d',
  color: 'white',
  padding: '6px 12px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default EditProfile;
