import React from 'react';
import { useNavigate } from 'react-router-dom';
import './welcome.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <h1>Welcome to Our Platform</h1>
        <p>Your gateway to a better experience.</p>
      </header>
      <div className="button-container">
        <button className="welcome-button" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="welcome-button" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
        <button className="welcome-button" onClick={() => navigate('/forgot-password')}>
          Forgot Password
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;