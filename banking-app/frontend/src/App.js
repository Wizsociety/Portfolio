import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import MemberDashboard from './components/Dashboard/MemberDashboard';
import Register from './components/Auth/Registration';
import Login from './components/Auth/Login';
import { AuthProvider } from './components/Auth/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/member" element={<MemberDashboard />} />
          <Route path="/register" element={<Registration />} />
          {/* Redirect unknown paths to /member */}
          <Route path="*" element={<Navigate to="/member" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

