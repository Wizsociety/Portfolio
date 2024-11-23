// src/components/Dashboard/MemberDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import NotificationPanel from '../Notifications/NotificationPanel';
import TransactionHistory from './TransactionHistory';
import LoanRequest from '../Transactions/LoanRequest';
import axios from 'axios';

const MemberDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [accountDetails, setAccountDetails] = useState(null);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchAccountDetails();
    fetchLoans();
  }, []);

  const fetchAccountDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/account/member`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccountDetails(response.data);
    } catch (error) {
      console.error('Error fetching account details:', error);
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/loans/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  return (
    <div className="member-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.fullName}</h1>
        <NotificationPanel />
      </div>

      <div className="account-summary">
        <h2>Account Summary</h2>
        {accountDetails && (
          <div className="summary-details">
            <p>Account Balance: ${accountDetails.balance}</p>
            <p>Available Loan Limit: ${accountDetails.loanLimit}</p>
          </div>
        )}
      </div>

      <div className="loan-status">
        <h2>Your Loans</h2>
        {loans.map(loan => (
          <div key={loan._id} className="loan-card">
            <p>Amount: ${loan.amount}</p>
            <p>Status: {loan.status}</p>
            <p>Date: {new Date(loan.timestamp).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      <LoanRequest onLoanRequested={fetchLoans} />
      <TransactionHistory />
    </div>
  );
};

export default MemberDashboard;
