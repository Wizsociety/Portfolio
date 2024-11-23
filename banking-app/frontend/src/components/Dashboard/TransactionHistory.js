// src/components/Dashboard/TransactionHistory.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import axios from 'axios';

const TransactionHistory = () => {
  const { token } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/transactions?filter=${filter}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div className="transaction-history">
      <h2>Transaction History</h2>
      
      <div className="filter-controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Transactions</option>
          <option value="deposit">Deposits</option>
          <option value="withdrawal">Withdrawals</option>
          <option value="loan">Loans</option>
        </select>
      </div>

      <div className="transactions-list">
        {transactions.map(transaction => (
          <div key={transaction._id} className="transaction-card">
            <div className="transaction-type">
              {transaction.type.toUpperCase()}
            </div>
            <div className="transaction-amount">
              ${transaction.amount}
            </div>
            <div className="transaction-status">
              {transaction.status}
            </div>
            <div className="transaction-date">
              {new Date(transaction.timestamp).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
