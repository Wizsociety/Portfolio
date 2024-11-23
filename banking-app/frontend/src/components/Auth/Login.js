// src/components/Auth/Login.js
import React, { useState } from 'react';
import { loginUser } from '../../services/authService';

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(loginData);
      // Store token and user info
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      // Redirect based on user type
      if (response.user.userType === 'admin') {
        // Redirect to admin dashboard
        window.location.href = '/admin-dashboard';
      } else {
        // Redirect to member dashboard
        window.location.href = '/member-dashboard';
      }
    } catch (error) {
      // Handle login error
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
