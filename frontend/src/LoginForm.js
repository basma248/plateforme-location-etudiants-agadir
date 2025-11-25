import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from './services/authService';

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
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440, background: '#fff', padding: 28, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
        <h2 style={{ marginTop: 0 }}>Connexion</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          {error && <div style={{ padding: '10px', background: '#ffebee', color: '#c62828', borderRadius: '8px', fontSize: '14px' }}>{error}</div>}
          <input required placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
          <input required type="password" placeholder="Mot de passe" value={pwd} onChange={(e) => setPwd(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
          <button type="submit" disabled={loading} style={{ padding: 12, borderRadius: 8, border: 'none', background: loading ? '#ccc' : '#1D4E89', color: '#fff', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <Link to="/register">Créer un compte</Link>
          <Link to="/forgot">Mot de passe oublié?</Link>
        </div>
      </div>
    </div>
  );
}
// ...existing code...