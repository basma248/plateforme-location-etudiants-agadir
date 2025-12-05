import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add registration logic here (e.g., API call)
    if (password === confirmPassword) {
      // Proceed with registration
      console.log('User registered:', { username, email, password });
      navigate('/login'); // Redirect to login after successful registration
    } else {
      alert("Les mots de passe ne correspondent pas.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">S'inscrire</button>
      </form>
      <p>
        Déjà un compte? <span onClick={() => navigate('/login')} className="auth-link">Se connecter</span>
      </p>
    </div>
  );
}