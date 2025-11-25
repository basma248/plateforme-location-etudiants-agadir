import React from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

export default function AuthEntry() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="auth-entry">
      <header className="auth-header">
        <h1>Darna Agadir</h1>
        <p>Bienvenue sur la plateforme logement étudiant à Agadir 🏠</p>
      </header>

      <main className="auth-main">
        <h2>Accéder à votre compte</h2>
        <div className="auth-options">
          <button onClick={() => handleNavigate('/login')} className="auth-button">
            Se connecter
          </button>
          <button onClick={() => handleNavigate('/register')} className="auth-button">
            Créer un compte étudiant
          </button>
          <button onClick={() => handleNavigate('/forgot-password')} className="auth-button">
            Mot de passe oublié
          </button>
        </div>
      </main>

      <footer className="auth-footer">
        © 2025 Darna Agadir — Tous droits réservés
      </footer>
    </div>
  );
}