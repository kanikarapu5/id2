import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/dashboard/AdminDashboard';
import PartnerDashboard from './components/dashboard/PartnerDashboard';
import InstitutionDashboard from './components/dashboard/InstitutionDashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';

const App = () => {
  // This would be replaced with actual auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated && userRole === 'Admin'}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Partner Dashboard */}
        <Route
          path="/partner/dashboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated && userRole === 'Partner'}>
              <PartnerDashboard />
            </PrivateRoute>
          }
        />

        {/* Institution Dashboard */}
        <Route
          path="/institution/dashboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated && userRole === 'Institution'}>
              <InstitutionDashboard />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
