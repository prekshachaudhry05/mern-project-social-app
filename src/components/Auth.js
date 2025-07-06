import React, { useState } from 'react';
import axios from 'axios';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', description: '' });
  const [error, setError] = useState('');

  const toggle = () => {
    setIsLogin(!isLogin);
    setForm({ name: '', email: '', password: '', description: '' });
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? '/api/users/login' : '/api/users/register';

    try {
      const res = await axios.post(`https://mern-project-social-app-connectify.onrender.com${url}`, form);

      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/timeline';
      } else {
        alert('Registered successfully! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      const message = err?.response?.data || 'Something went wrong';
      setError(message);
    }
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Connectify</h1>

      <div style={containerStyle}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                value={form.name}
                required
                style={inputStyle}
              />
              <input
                name="description"
                placeholder="Description (optional)"
                onChange={handleChange}
                value={form.description}
                style={inputStyle}
              />
            </>
          )}
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            required
            style={inputStyle}
          />
          <button type="submit" style={submitButtonStyle}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <button onClick={toggle} style={toggleButtonStyle}>
          {isLogin ? 'New user? Register here' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

// Background
const pageStyle = {
  minHeight: '100vh',
  backgroundColor: '#ffe6f0', // light pink background
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

// App name
const titleStyle = {
  fontSize: '50px',
  marginBottom: '20px',
  color: '#b30059', // dark pink for heading
};

// Form card
const containerStyle = {
  maxWidth: '340px',
  width: '100%',
  padding: '25px',
  borderRadius: '10px',
  backgroundColor: '#fff0f5', // pale pink
  boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
};

// Inputs
const inputStyle = {
  width: '90%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #d88ca4',
  backgroundColor: '#fff',
};

// Submit button
const submitButtonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#ff66a3',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

// Toggle
const toggleButtonStyle = {
  marginTop: '12px',
  background: 'none',
  border: 'none',
  color: '#b30059',
  textDecoration: 'underline',
  cursor: 'pointer',
};

// Error message
const errorStyle = {
  color: 'red',
  marginBottom: '10px',
};

export default Auth;
