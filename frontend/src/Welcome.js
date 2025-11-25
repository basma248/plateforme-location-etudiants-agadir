// ...existing code...
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();
  const palette = {
    primary: '#1D4E89',
    secondary: '#48CFCB',
    neutral: '#F5F5F5',
    visitor: '#D9D3C7',
  };

  const container = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background: `linear-gradient(135deg, ${palette.primary}22 0%, ${palette.secondary}10 50%, ${palette.neutral} 100%)`,
    boxSizing: 'border-box',
    flexDirection: 'column',
    gap: 24,
  };

  const card = {
    width: '100%',
    maxWidth: 640,
    background: '#fff',
    borderRadius: 14,
    padding: 28,
    boxShadow: '0 12px 40px rgba(13,38,77,0.12)',
    boxSizing: 'border-box',
    textAlign: 'center',
  };

  const btn = (bg, color) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    padding: '14px 18px',
    borderRadius: 10,
    border: 'none',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    background: bg,
    color,
    transition: 'transform .12s ease, box-shadow .12s ease',
  });

  return (
    <div style={container}>
      <header style={{ textAlign: 'center', color: palette.primary }}>
        <div style={{ fontSize: 34, fontWeight: 800 }}>Darna Agadir</div>
        <div style={{ marginTop: 6, fontSize: 15, color: '#333' }}>
          Bienvenue sur la plateforme logement étudiant à Agadir 🏠
        </div>
      </header>

      <main style={card} role="main" aria-labelledby="welcome-title">
        <h2 id="welcome-title" style={{ margin: 0, color: palette.primary }}>Accéder à la plateforme</h2>

        <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
          <button
            aria-label="Se connecter"
            onClick={() => navigate('/login')}
            style={btn(palette.primary, '#fff')}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
          >
            <span style={{ fontSize: 20 }}>🔑</span> Se connecter
          </button>

          <button
            aria-label="S'inscrire"
            onClick={() => navigate('/register')}
            style={btn(palette.secondary, '#012')}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
          >
            <span style={{ fontSize: 20 }}>📝</span> S'inscrire
          </button>

          <button
            aria-label="Mot de passe oublié"
            onClick={() => navigate('/forgot')}
            style={btn(palette.visitor, '#222')}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
          >
            <span style={{ fontSize: 20 }}>🔐</span> Mot de passe oublié
          </button>
        </div>

        <p style={{ marginTop: 14, color: '#555', fontSize: 13 }}>
          Choisissez rapidement — vous pouvez revenir ici à tout moment.
        </p>
      </main>

      <footer style={{ position: 'fixed', bottom: 12, textAlign: 'center', width: '100%', color: '#666' }}>
        © 2025 Darna Agadir — Tous droits réservés
      </footer>
    </div>
  );
}
// ...existing code...