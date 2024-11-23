// src/components/Dashboard/AdminDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import NotificationPanel from '../Notifications/NotificationPanel';
import TransactionHistory from './TransactionHistory';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [accountDetails, setAccountDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [loanRequests, setLoanRequests] = useState([]);

  useEffect(() => {
    fetchAccountDetails();
    fetchMembers();
    fetchLoanRequests();
  }, []);

  const fetchAccountDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/account`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccountDetails(response.data);
    } catch (error) {
      console.error('Error fetching account details:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/account/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchLoanRequests = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/loans/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoanRequests(response.data);
    } catch (error) {
      console.error('Error fetching loan requests:', error);
    }
  };

  const handleLoanApproval = async (loanId, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/loans/${loanId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchLoanRequests();
    } catch (error) {
      console.error('Error updating loan status:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.fullName}</h1>
        <NotificationPanel />
      </div>

      <div className="account-summary">
        <h2>Account Summary</h2>
        {accountDetails && (
          <div className="summary-details">
            <p>Account Balance: ${accountDetails.balance}</p>
            <p>Total Members: {members.length}</p>
            <p>Pending Loans: {loanRequests.length}</p>
          </div>
        )}
      </div>

      <div className="loan-requests">
        <h2>Pending Loan Requests</h2>
        {loanRequests.map(loan => (
          <div key={loan._id} className="loan-request-card">
            <p>Member: {loan.user.fullName}</p>
            <p>Amount: ${loan.amount}</p>
            <p>Date: {new Date(loan.timestamp).toLocaleDateString()}</p>
            <div className="action-buttons">
              <button onClick={() => handleLoanApproval(loan._id, 'approved')}>
                Approve
              </button>
              <button onClick={() => handleLoanApproval(loan._id, 'rejected')}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <TransactionHistory />
    </div>
  );
};

export default AdminDashboard;
