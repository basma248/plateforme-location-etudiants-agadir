import React from 'react';
import { useNavigate } from 'react-router-dom';

// Icônes SVG React
const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconKey = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
  </svg>
);

const IconEdit = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const IconEye = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export default function Login() {
  const navigate = useNavigate();

  const palette = {
    primary: '#1D4E89', // bleu mer
    secondary: '#48CFCB', // turquoise doux
    neutral: '#F5F5F5', // fond clair
    visitor: '#D9D3C7', // gris/beige
  };

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${palette.primary}20 0%, ${palette.secondary}10 50%, ${palette.neutral} 100%)`,
      padding: '24px',
      boxSizing: 'border-box',
      flexDirection: 'column',
      gap: '24px',
    },
    header: {
      textAlign: 'center',
      color: palette.primary,
    },
    logo: {
      fontSize: '28px',
      fontWeight: 700,
      letterSpacing: 0.6,
    },
    subtitle: {
      marginTop: '6px',
      fontSize: '14px',
      color: '#333',
      opacity: 0.9,
    },
    card: {
      width: '100%',
      maxWidth: '520px',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(29,78,137,0.12)',
      padding: '28px',
      boxSizing: 'border-box',
    },
    choices: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginTop: '14px',
    },
    btnBase: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      padding: '14px 18px',
      borderRadius: '10px',
      border: 'none',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'transform .12s ease, box-shadow .12s ease, filter .12s ease',
      boxShadow: '0 4px 12px rgba(16,24,40,0.06)',
    },
    btnIcon: {
      fontSize: '20px',
    },
    smallNote: {
      fontSize: '13px',
      color: '#555',
      marginTop: '8px',
    },
    footer: {
      marginTop: '12px',
      fontSize: '13px',
      color: '#666',
      opacity: 0.9,
    },
  };

  const handleNavigate = (to) => {
    navigate(to);
  };

  return (
    <div style={styles.page}>
      <header style={styles.header} aria-hidden>
        <div style={styles.logo}>Darna Agadir</div>
        <div style={styles.subtitle}>
          Bienvenue sur la plateforme logement étudiant à Agadir{' '}
          <span style={{ display: 'inline-flex', verticalAlign: 'middle', marginLeft: '4px' }}>
            <IconHome />
          </span>
        </div>
      </header>

      <main style={styles.card} role="main" aria-labelledby="access-title">
        <h2 id="access-title" style={{ margin: 0, color: palette.primary }}>
          Accéder à la plateforme
        </h2>

        <div style={styles.choices}>
          <button
            type="button"
            onClick={() => handleNavigate('/login')}
            style={{ ...styles.btnBase, background: palette.primary, color: '#fff' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            aria-label="Se connecter"
          >
            <span style={styles.btnIcon}><IconKey /></span>
            Se connecter
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('/register')}
            style={{ ...styles.btnBase, background: palette.secondary, color: '#012' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            aria-label="Créer un compte étudiant"
          >
            <span style={styles.btnIcon}><IconEdit /></span>
            Créer un compte étudiant
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('/')}
            style={{ ...styles.btnBase, background: palette.visitor, color: '#222' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            aria-label="Continuer sans compte"
          >
            <span style={styles.btnIcon}><IconEye /></span>
            Continuer sans compte
          </button>

          <div style={styles.smallNote}>
            Choisissez l'option qui vous convient — vous pouvez revenir ici à tout moment.
          </div>
        </div>
      </main>

      <footer style={styles.footer} aria-hidden>
        © 2025 Darna Agadir — Tous droits réservés · Plateforme étudiante sécurisée & gratuite
      </footer>
    </div>
  );
}
// ...existing code...