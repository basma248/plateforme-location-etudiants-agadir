import React from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    // Logic for handling login goes here
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Se connecter</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input type="password" id="password" required />
        </div>
        <button type="submit" className="auth-button">Connexion</button>
      </form>
      <div className="auth-links">
        <button onClick={() => navigate('/forgot-password')} className="link-button">Mot de passe oublié ?</button>
        <button onClick={() => navigate('/register')} className="link-button">Créer un compte</button>
      </div>
    </div>
  );
};

export default Login;