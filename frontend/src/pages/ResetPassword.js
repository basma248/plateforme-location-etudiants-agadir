import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import './Register.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Récupérer le token et l'email depuis les paramètres de l'URL
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Token de réinitialisation manquant dans l\'URL');
    }

    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation côté client
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!token) {
      setError('Token de réinitialisation manquant');
      return;
    }

    if (!email) {
      setError('Email manquant');
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(email, token, password, passwordConfirmation);
      
      if (response.success) {
        setSuccess(true);
        setMessage(response.message || 'Mot de passe réinitialisé avec succès');
        
        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <div className="register-container">
        <div className="register-card">
          <h2>Réinitialisation du mot de passe</h2>
          <p className="error-message">
            Token de réinitialisation manquant. Veuillez utiliser le lien reçu par email.
          </p>
          <button 
            onClick={() => navigate('/forgot')} 
            className="btn-primary"
            style={{ marginTop: '16px' }}
          >
            Demander un nouveau lien
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Réinitialiser le mot de passe</h2>
        <p className="register-subtitle">
          Entrez votre nouveau mot de passe ci-dessous.
        </p>

        {success ? (
          <div className="success-message">
            <p>{message}</p>
            <p className="info-text">Redirection vers la page de connexion...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="register-form">
            {error && (
              <div className="error-message" style={{ marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre.email@exemple.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Nouveau mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Au moins 6 caractères"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="passwordConfirmation">Confirmer le mot de passe</label>
              <input
                type="password"
                id="passwordConfirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                minLength={6}
                placeholder="Répétez le mot de passe"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>

            <div className="register-footer">
              <button 
                type="button"
                onClick={() => navigate('/login')} 
                className="link-button"
              >
                Retour à la connexion
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


