import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import MemberDashboard from "./components/Dashboard/MemberDashboard";
import Register from "./components/Auth/Registration";
import Login from "./components/Auth/Login";
import { AuthContext, AuthProvider } from "./components/Auth/AuthContext";
import axios from "axios"; // Import axios for API calls

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/member" replace />;
  return children;
};

const App = () => {
  useEffect(() => {
    // Backend health check on app initialization
    axios
      .get("http://localhost:5000/api/health")
      .then((response) => {
        console.log("Backend health check:", response.data.message);
      })
      .catch((error) => {
        console.error("Error connecting to backend:", error.message);
      });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/member"
            element={
              <PrivateRoute>
                <MemberDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/member" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
