// ...existing code...
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div style={styles.subtitle}>Bienvenue sur la plateforme logement étudiant à Agadir 🏠</div>
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
            <span style={styles.btnIcon}>🔑</span>
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
            <span style={styles.btnIcon}>📝</span>
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
            <span style={styles.btnIcon}>👀</span>
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