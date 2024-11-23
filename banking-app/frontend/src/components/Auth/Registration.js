// src/components/Auth/Registration.js
import React, { useState } from 'react';
import { registerUser } from '../../services/authService';

const Registration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    phoneNumber: '',
    email: '',
    jointAccountName: '',
    dateOfBirth: '',
    physicalAddress: '',
    password: '',
    userType: 'member',
    securityKey: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      // Handle successful registration
      console.log(response);
    } catch (error) {
      // Handle registration error
      console.error(error);
    }
  };

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nationalId"
          placeholder="National ID"
          value={formData.nationalId}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="jointAccountName"
          placeholder="Joint Account Name"
          value={formData.jointAccountName}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="physicalAddress"
          placeholder="Physical Address"
          value={formData.physicalAddress}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="userType"
          value={formData.userType}
          onChange={handleChange}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        {formData.userType === 'admin' && (
          <input
            type="text"
            name="securityKey"
            placeholder="Security Key"
            value={formData.securityKey}
            onChange={handleChange}
          />
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Registration;
