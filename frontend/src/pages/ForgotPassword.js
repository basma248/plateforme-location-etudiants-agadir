import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/authService';
import './Register.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      
      if (response.success) {
        setSuccess(true);
        setMessage(response.message);
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la demande de réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Réinitialiser le mot de passe</h2>
        <p className="register-subtitle">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {success ? (
          <div className="success-message">
            <p>{message}</p>
            <p className="info-text" style={{ marginTop: '16px' }}>
              Vérifiez votre boîte de réception. Si vous ne recevez pas l'email, vérifiez votre dossier spam.
            </p>
            <button 
              onClick={() => navigate('/login')} 
              className="btn-primary"
              style={{ marginTop: '16px' }}
            >
              Retour à la connexion
            </button>
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

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer les instructions'}
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
