import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

// Icônes SVG React
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const IconIdCard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
    <line x1="8" y1="10" x2="16" y2="10"></line>
    <line x1="8" y1="14" x2="14" y2="14"></line>
    <circle cx="18" cy="8" r="2"></circle>
  </svg>
);

const IconGraduation = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

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
        nom_utilisateur: formData.nomUtilisateur,
        password: formData.motDePasse,
        password_confirmation: formData.motDePasse, // Required for Laravel validation
        type_utilisateur: formData.typeUtilisateur,
        cin: formData.cin,
        ...(formData.typeUtilisateur === 'etudiant' && { cne: formData.cne })
      };

      console.log('Sending user data:', userData); // Debug log

      const { register } = await import('../services/authService');
      await register(userData);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-wrapper">
      <div className="register-container">
        <div className="register-header">
          <div className="register-logo">Darna Agadir</div>
          <div className="register-subtitle">Créez votre compte étudiant</div>
        </div>

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-form-row">
            <div className="register-input-group">
              <label className="register-label">
                Nom <span className="required">*</span>
              </label>
              <span className="register-input-icon"><IconUser /></span>
              <input
                required
                type="text"
                name="nom"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={handleChange}
                className="register-input"
              />
            </div>

            <div className="register-input-group">
              <label className="register-label">
                Prénom <span className="required">*</span>
              </label>
              <span className="register-input-icon"><IconUser /></span>
              <input
                required
                type="text"
                name="prenom"
                placeholder="Votre prénom"
                value={formData.prenom}
                onChange={handleChange}
                className="register-input"
              />
            </div>
          </div>

          <div className="register-input-group">
            <label className="register-label">
              Adresse email <span className="required">*</span>
            </label>
            <span className="register-input-icon"><IconMail /></span>
            <input
              required
              type="email"
              name="email"
              placeholder="votre.email@exemple.com"
              value={formData.email}
              onChange={handleChange}
              className="register-input"
            />
          </div>

          <div className="register-input-group">
            <label className="register-label">
              Numéro de téléphone <span className="required">*</span>
            </label>
            <span className="register-input-icon"><IconPhone /></span>
            <input
              required
              type="tel"
              name="telephone"
              placeholder="06XXXXXXXX"
              value={formData.telephone}
              onChange={handleChange}
              className="register-input"
            />
          </div>

          <div className="register-input-group">
            <label className="register-label">
              Nom d'utilisateur <span className="required">*</span>
            </label>
            <span className="register-input-icon"><IconShield /></span>
            <input
              required
              type="text"
              name="nomUtilisateur"
              placeholder="Choisissez un nom d'utilisateur"
              value={formData.nomUtilisateur}
              onChange={handleChange}
              className="register-input"
            />
          </div>

          <div className="register-input-group">
            <label className="register-label">
              Mot de passe <span className="required">*</span>
            </label>
            <span className="register-input-icon"><IconLock /></span>
            <input
              required
              type="password"
              name="motDePasse"
              placeholder="Créez un mot de passe sécurisé"
              value={formData.motDePasse}
              onChange={handleChange}
              className="register-input"
            />
          </div>

          <div className="register-input-group">
            <label className="register-label">
              Type d'utilisateur <span className="required">*</span>
            </label>
            <span className="register-input-icon"><IconUsers /></span>
            <select
              required
              name="typeUtilisateur"
              value={formData.typeUtilisateur}
              onChange={handleChange}
              className="register-select"
            >
              <option value="etudiant">Étudiant</option>
              <option value="loueur">Loueur</option>
            </select>
          </div>

          <div className="register-input-group">
            <label className="register-label">
              CIN <span className="required">*</span>
            </label>
            <span className="register-input-icon"><IconIdCard /></span>
            <input
              required
              type="text"
              name="cin"
              placeholder="Numéro de CIN"
              value={formData.cin}
              onChange={handleChange}
              className="register-input"
            />
          </div>

          {formData.typeUtilisateur === 'etudiant' && (
            <div className="register-input-group">
              <label className="register-label">
                CNE <span className="required">*</span>
              </label>
              <span className="register-input-icon"><IconGraduation /></span>
              <input
                required
                type="text"
                name="cne"
                placeholder="Numéro de CNE"
                value={formData.cne}
                onChange={handleChange}
                className="register-input"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="register-button"
          >
            {loading ? (
              <span className="register-button-loading">
                <span className="register-spinner"></span>
                Inscription en cours...
              </span>
            ) : (
              'Créer mon compte'
            )}
          </button>
        </form>

        <div className="register-footer">
          <span>Déjà un compte ?</span>
          <Link to="/login" className="register-link">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}