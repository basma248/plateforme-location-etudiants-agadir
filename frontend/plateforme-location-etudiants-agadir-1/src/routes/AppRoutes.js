import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthEntry from '../pages/AuthEntry';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthEntry />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;