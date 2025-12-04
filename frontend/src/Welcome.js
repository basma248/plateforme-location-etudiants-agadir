import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const logoUrl = "/logo.png";

  useEffect(() => {
    setIsLoaded(true);
    
    const img = new Image();
    img.onload = () => {
      setLogoLoaded(true);
    };
    img.src = logoUrl;
  }, [logoUrl]);

  const handleGuestAccess = () => {
    navigate('/home');
  };

  return (
    <div className="welcome-page">
      {/* Arrière-plan moderne avec effets */}
      <div className="background-wrapper">
        <div className="gradient-mesh"></div>
        <div className="animated-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        <div className="grid-pattern"></div>
      </div>

      {/* Contenu principal */}
      <div className={`content-wrapper ${isLoaded ? 'visible' : ''}`}>
        {/* Section Logo */}
        <section className="logo-section">
          <div className="logo-frame">
            <div className="logo-glow"></div>
            <img 
              src={logoUrl}
              alt="Darna Agadir" 
              className={`logo-image ${logoLoaded ? 'loaded' : ''}`}
              onLoad={() => setLogoLoaded(true)}
            />
          </div>
        </section>

        {/* Section Header */}
        <section className="header-section">
          <h1 className="main-heading">
            Bienvenue sur <span className="brand-name">Darna Agadir</span>
          </h1>
          <p className="main-description">
            La plateforme de référence pour trouver votre logement étudiant idéal à Agadir
          </p>
        </section>

        {/* Section Actions */}
        <section className="actions-section">
          <div className="actions-card">
            <div className="card-header-section">
              <h2 className="card-heading">Commencer</h2>
              <p className="card-subheading">Choisissez votre option</p>
            </div>

            <div className="buttons-container">
              <button
                className="action-button primary-button"
                onClick={() => navigate('/login')}
              >
                <div className="button-content">
                  <span className="button-label">Se connecter</span>
                  <svg className="button-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="button-shine"></div>
              </button>

              <button
                className="action-button secondary-button"
                onClick={() => navigate('/register')}
              >
                <div className="button-content">
                  <span className="button-label">Créer un compte</span>
                  <svg className="button-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="button-shine"></div>
              </button>

              <button
                className="action-button accent-button"
                onClick={handleGuestAccess}
              >
                <div className="button-content">
                  <span className="button-label">Continuer sans compte</span>
                  <svg className="button-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="button-shine"></div>
              </button>

              <button
                className="text-button"
                onClick={() => navigate('/forgot')}
              >
                Mot de passe oublié ?
              </button>
            </div>
          </div>
        </section>

        {/* Section Features */}
        <section className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <h3 className="feature-title">Recherche avancée</h3>
              <p className="feature-text">Filtres précis et efficaces</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="feature-title">Messagerie</h3>
              <p className="feature-text">Contact direct et sécurisé</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3 className="feature-title">Favoris</h3>
              <p className="feature-text">Sauvegardez vos préférés</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="page-footer">
          <p className="footer-text">© 2025 Darna Agadir — Tous droits réservés</p>
          <div className="footer-links">
            <button onClick={() => navigate('/a-propos')} className="footer-link">
              À propos
            </button>
            <span className="footer-separator">•</span>
            <button onClick={() => navigate('/contact')} className="footer-link">
              Contact
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
