import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, isAdmin } from './services/authService';
import './LoginForm.css';

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
            <span className="login-input-icon">📧</span>
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
            <span className="login-input-icon">🔒</span>
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