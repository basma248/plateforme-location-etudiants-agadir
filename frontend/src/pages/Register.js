import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

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
              <span className="register-input-icon">👤</span>
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
              <span className="register-input-icon">👤</span>
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
            <span className="register-input-icon">📧</span>
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
            <span className="register-input-icon">📱</span>
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
            <span className="register-input-icon">🔐</span>
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
            <span className="register-input-icon">🔒</span>
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
            <span className="register-input-icon">👥</span>
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
            <span className="register-input-icon">🆔</span>
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
              <span className="register-input-icon">🎓</span>
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