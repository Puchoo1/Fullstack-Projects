import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import FeedbackForm from './components/FeedbackForm';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Signup */}
        <Route path="/signup" element={<Signup />} />
        
        {/* Feedback Form */}
        <Route path="/feedback" element={<FeedbackForm />} />
      </Routes>
    </Router>
  );
};

export default App;
