// src/components/Transactions/LoanRequest.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import axios from 'axios';

const LoanRequest = ({ onLoanRequested }) => {
  const { token } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/loans/request`,
        { amount: parseFloat(amount), reason },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setMessage('Loan request submitted successfully');
      setAmount('');
      setReason('');
      
      if (onLoanRequested) {
        onLoanRequested();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Loan request failed');
    }
  };

  return (
    <div className="loan-request-form">
      <h2>Request a Loan</h2>
      {message && <div className="message">{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label>Reason for Loan</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        <button type="submit">Submit Loan Request</button>
      </form>
    </div>
  );
};

export default LoanRequest;
