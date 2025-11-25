import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate password recovery process
    if (email) {
      setMessage('Instructions to reset your password have been sent to your email.');
      setEmail('');
    } else {
      setMessage('Please enter a valid email address.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Envoyer les instructions</button>
      </form>
      {message && <p className="message">{message}</p>}
      <button onClick={() => navigate('/login')} className="link-btn">Retour à la connexion</button>
    </div>
  );
}