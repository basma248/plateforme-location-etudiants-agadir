import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    nomUtilisateur: '',
    motDePasse: '',
    typeUtilisateur: 'etudiant',
    cin: '',
    cne: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Préparer les données pour l'API
      const userData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        nomUtilisateur: formData.nomUtilisateur,
        motDePasse: formData.motDePasse,
        typeUtilisateur: formData.typeUtilisateur,
        cin: formData.cin,
        ...(formData.typeUtilisateur === 'etudiant' && { cne: formData.cne })
      };

      const { register } = await import('../services/authService');
      await register(userData);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ddd',
    fontSize: 14,
    width: '100%',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: 4,
    fontSize: 14,
    fontWeight: 500,
    color: '#333'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'linear-gradient(135deg, #1D4E8922 0%, #48CFCB10 50%, #F5F5F5 100%)' }}>
      <div style={{ width: '100%', maxWidth: 520, background: '#fff', padding: 28, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
        <h2 style={{ marginTop: 0, color: '#1D4E89' }}>Inscription</h2>
        {error && <div style={{ padding: '12px', background: '#ffebee', color: '#c62828', borderRadius: '8px', fontSize: '14px', marginTop: '12px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
          <div>
            <label style={labelStyle}>Nom *</label>
            <input
              required
              type="text"
              name="nom"
              placeholder="Votre nom"
              value={formData.nom}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Prénom *</label>
            <input
              required
              type="text"
              name="prenom"
              placeholder="Votre prénom"
              value={formData.prenom}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Email *</label>
            <input
              required
              type="email"
              name="email"
              placeholder="votre.email@exemple.com"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Numéro de téléphone *</label>
            <input
              required
              type="tel"
              name="telephone"
              placeholder="06XXXXXXXX"
              value={formData.telephone}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Nom d'utilisateur *</label>
            <input
              required
              type="text"
              name="nomUtilisateur"
              placeholder="Choisissez un nom d'utilisateur"
              value={formData.nomUtilisateur}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Mot de passe *</label>
            <input
              required
              type="password"
              name="motDePasse"
              placeholder="Créez un mot de passe"
              value={formData.motDePasse}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Type d'utilisateur *</label>
            <select
              required
              name="typeUtilisateur"
              value={formData.typeUtilisateur}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="etudiant">Étudiant</option>
              <option value="loueur">Loueur</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>CIN *</label>
            <input
              required
              type="text"
              name="cin"
              placeholder="Numéro de CIN"
              value={formData.cin}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {formData.typeUtilisateur === 'etudiant' && (
            <div>
              <label style={labelStyle}>CNE *</label>
              <input
                required
                type="text"
                name="cne"
                placeholder="Numéro de CNE"
                value={formData.cne}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 12,
              borderRadius: 8,
              border: 'none',
              background: loading ? '#ccc' : '#1D4E89',
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 8,
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#153d6f')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#1D4E89')}
          >
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 14 }}>
          <span style={{ color: '#666' }}>Déjà un compte? </span>
          <Link to="/login" style={{ color: '#1D4E89', textDecoration: 'none', fontWeight: 500 }}>
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}