import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, isAdmin } from './services/authService';
import './LoginForm.css';

// Icônes SVG React
const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, pwd);
      // Rediriger vers /admin si l'utilisateur est admin, sinon vers /home
      if (isAdmin()) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">Darna Agadir</div>
          <div className="login-subtitle">Connectez-vous à votre compte</div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="login-input-group">
            <span className="login-input-icon"><IconMail /></span>
            <input
              required
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
          </div>

          <div className="login-input-group">
            <span className="login-input-icon"><IconLock /></span>
            <input
              required
              type="password"
              placeholder="Mot de passe"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="login-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? (
              <span className="login-button-loading">
                <span className="login-spinner"></span>
                Connexion en cours...
              </span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/register" className="login-link">
            Créer un compte
          </Link>
          <Link to="/forgot" className="login-link">
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
    </div>
  );
}