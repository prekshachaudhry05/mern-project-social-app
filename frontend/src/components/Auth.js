import React, { useState } from 'react';
import './Auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', description: '' });
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const url = isLogin
      ? 'https://mern-project-social-app-connectify.onrender.com/api/users/login'
      : 'https://mern-project-social-app-connectify.onrender.com/api/users/register';

    try {
      const res = await axios.post(url, formData);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        navigate('/timeline');
      } else {
        alert('Registration successful. Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response.data || 'An error occurred');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {!isLogin && (
          <>
            <input name="name" placeholder="Name" onChange={handleChange} required />
            <input name="description" placeholder="Description" onChange={handleChange} />
          </>
        )}
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: 'blue' }}>
          {isLogin ? 'Create an account' : 'Already have an account? Login'}
        </p>
      </form>
    </div>
  );
};

export default Auth;
