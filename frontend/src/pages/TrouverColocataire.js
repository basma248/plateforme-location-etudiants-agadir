import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getColocataires, createColocataire, contactColocataire } from '../services/colocataireService';
import { getToken, isAuthenticated } from '../services/authService';
import './TrouverColocataire.css';

function TrouverColocataire() {
  const navigate = useNavigate();
  const [colocataires, setColocataires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Filtres
  const [filters, setFilters] = useState({
    search: '',
    zone: '',
    type_logement: '',
    budget_max: '',
    sortBy: 'date',
    sortDirection: 'desc'
  });

  // Formulaire de création
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    zone_preferee: '',
    budget_max: '',
    type_logement: '',
    preferences: '',
    contact_email: '',
    contact_telephone: '',
    genre: '', // Homme ou Femme
    type_recherche: '', // chambre_seule, chambre_partagee, studio, appartement
    nb_personnes_souhaitees: '' // Si chambre partagée
  });

  // Zones disponibles
  const zones = [
    'Universiapolis',
    'Hay Mohammadi',
    'Hay Riad',
    'Centre-ville',
    'Anza',
    'Inezgane',
    'Aït Melloul',
    'Dcheira',
    'Tikiouine',
    'Taddart'
  ];

  // Charger les colocataires avec filtres
  const loadColocataires = async () => {
    setLoading(true);
    try {
      const apiFilters = {};
      
      if (filters.search) apiFilters.search = filters.search;
      if (filters.zone) apiFilters.zone = filters.zone;
      if (filters.type_logement) apiFilters.type_logement = filters.type_logement;
      if (filters.budget_max) apiFilters.budget_max = filters.budget_max;
      if (filters.sortBy) {
        apiFilters.sort_by = filters.sortBy;
        apiFilters.sort_direction = filters.sortDirection || 'desc';
      }

      const data = await getColocataires(apiFilters);
      setColocataires(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des colocataires:', error);
      setColocataires([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColocataires();
  }, []);

  // Recharger quand les filtres changent
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search === '') {
        loadColocataires();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.zone, filters.type_logement, filters.budget_max, filters.sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadColocataires();
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      zone: '',
      type_logement: '',
      budget_max: '',
      sortBy: 'date',
      sortDirection: 'desc'
    });
    setTimeout(() => {
      loadColocataires();
    }, 100);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      alert('Vous devez être connecté pour créer une demande');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      await createColocataire(formData, token);
      alert('Votre demande de colocataire a été créée avec succès!');
      setFormData({
        titre: '',
        description: '',
        zone_preferee: '',
        budget_max: '',
        type_logement: '',
        preferences: '',
        contact_email: '',
        contact_telephone: '',
        genre: '',
        type_recherche: '',
        nb_personnes_souhaitees: ''
      });
      setShowForm(false);
      loadColocataires();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert(error.message || 'Une erreur est survenue lors de la création de votre demande');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContact = async (colocataire) => {
    if (!isAuthenticated()) {
      alert('Vous devez être connecté pour contacter un colocataire');
      navigate('/login');
      return;
    }

    try {
      const token = getToken();
      await contactColocataire(colocataire.id, token);
      
      // Afficher les informations de contact
      const email = colocataire.contact_email || colocataire.etudiant?.email;
      const phone = colocataire.contact_telephone || colocataire.etudiant?.telephone;
      
      let contactInfo = 'Informations de contact:\n\n';
      if (email) contactInfo += `Email: ${email}\n`;
      if (phone) contactInfo += `Téléphone: ${phone}\n`;
      
      alert(contactInfo || 'Contact enregistré');
    } catch (error) {
      console.error('Erreur lors du contact:', error);
      alert(error.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="trouver-colocataire-page">
      <Navbar />
      <main className="trouver-colocataire-main">
        <div className="trouver-colocataire-container">
          {/* Header */}
          <div className="trouver-colocataire-header">
            <h1>👥 Trouver un colocataire</h1>
            <p>Connectez-vous avec d'autres étudiants pour partager un logement</p>
            {isAuthenticated() && (
              <button 
                className="btn-create-demand"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Annuler' : '+ Créer une demande'}
              </button>
            )}
          </div>

          {/* Formulaire de création */}
          {showForm && (
            <div className="create-demand-form-container full-width-form">
              <h2>Créer une demande de colocataire</h2>
              <p className="section-description">
                Remplissez ce formulaire pour créer votre demande de colocataire
              </p>
              <form onSubmit={handleSubmit} className="create-demand-form">
                {/* Informations personnelles */}
                <div className="form-section">
                  <h3>1. Informations personnelles</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Genre *</label>
                      <select
                        name="genre"
                        value={formData.genre}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="">Sélectionner</option>
                        <option value="homme">Homme</option>
                        <option value="femme">Femme</option>
                      </select>
                      <small>Votre genre</small>
                    </div>
                  </div>
                </div>

                {/* Type de recherche */}
                <div className="form-section">
                  <h3>2. Type de logement recherché</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Type de chambre/logement *</label>
                      <select
                        name="type_recherche"
                        value={formData.type_recherche}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="">Sélectionner</option>
                        <option value="chambre_seule">Chambre seule</option>
                        <option value="chambre_partagee">Chambre partagée</option>
                        <option value="studio">Studio</option>
                        <option value="appartement">Appartement</option>
                      </select>
                      <small>Quel type de logement cherchez-vous ?</small>
                    </div>

                    {formData.type_recherche === 'chambre_partagee' && (
                      <div className="form-group">
                        <label>Nombre de personnes souhaitées</label>
                        <input
                          type="number"
                          name="nb_personnes_souhaitees"
                          value={formData.nb_personnes_souhaitees}
                          onChange={handleFormChange}
                          placeholder="Ex: 2"
                          min="2"
                        />
                        <small>Combien de personnes maximum dans la chambre partagée ?</small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations de base */}
                <div className="form-section">
                  <h3>3. Informations de base</h3>
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>Titre de votre demande *</label>
                      <input
                        type="text"
                        name="titre"
                        value={formData.titre}
                        onChange={handleFormChange}
                        placeholder="Ex: Étudiant cherche colocataire à Universiapolis"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Décrivez votre profil, vos préférences, ce que vous cherchez..."
                      rows="5"
                      required
                    />
                    <small>Parlez de vous, de vos habitudes, de ce que vous recherchez</small>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Zone préférée</label>
                      <select
                        name="zone_preferee"
                        value={formData.zone_preferee}
                        onChange={handleFormChange}
                      >
                        <option value="">Sélectionner une zone</option>
                        {zones.map(zone => (
                          <option key={zone} value={zone}>{zone}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Type de logement</label>
                      <select
                        name="type_logement"
                        value={formData.type_logement}
                        onChange={handleFormChange}
                      >
                        <option value="">Tous</option>
                        <option value="chambre">Chambre</option>
                        <option value="studio">Studio</option>
                        <option value="appartement">Appartement</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Budget maximum (MAD/mois)</label>
                      <input
                        type="number"
                        name="budget_max"
                        value={formData.budget_max}
                        onChange={handleFormChange}
                        placeholder="Ex: 2000"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Préférences */}
                <div className="form-section">
                  <h3>4. Préférences et conditions</h3>
                  <div className="form-group full-width">
                    <label>Préférences et conditions</label>
                    <textarea
                      name="preferences"
                      value={formData.preferences}
                      onChange={handleFormChange}
                      placeholder="Ex: Non-fumeur, calme, étudiant sérieux, horaires réguliers, animaux autorisés ou non..."
                      rows="4"
                    />
                    <small>Décrivez vos préférences et les conditions que vous souhaitez</small>
                  </div>
                </div>

                {/* Contact */}
                <div className="form-section">
                  <h3>5. Informations de contact</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email de contact (optionnel)</label>
                      <input
                        type="email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleFormChange}
                        placeholder="Laissez vide pour utiliser votre email de compte"
                      />
                      <small>Si différent de votre email de compte</small>
                    </div>

                    <div className="form-group">
                      <label>Téléphone de contact (optionnel)</label>
                      <input
                        type="tel"
                        name="contact_telephone"
                        value={formData.contact_telephone}
                        onChange={handleFormChange}
                        placeholder="Laissez vide pour utiliser votre téléphone de compte"
                      />
                      <small>Si différent de votre téléphone de compte</small>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? 'Création...' : 'Créer la demande'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Barre de recherche et filtres */}
          <div className="filters-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Rechercher par titre, description ou zone..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">Rechercher</button>
              </div>
            </form>

            <div className="filters-row">
              <select
                value={filters.zone}
                onChange={(e) => handleFilterChange('zone', e.target.value)}
                className="filter-select"
              >
                <option value="">Toutes les zones</option>
                {zones.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>

              <select
                value={filters.type_logement}
                onChange={(e) => handleFilterChange('type_logement', e.target.value)}
                className="filter-select"
              >
                <option value="">Tous les types</option>
                <option value="chambre">Chambre</option>
                <option value="studio">Studio</option>
                <option value="appartement">Appartement</option>
              </select>

              <input
                type="number"
                placeholder="Budget max (MAD)"
                value={filters.budget_max}
                onChange={(e) => handleFilterChange('budget_max', e.target.value)}
                className="filter-input"
                min="0"
              />

              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="filter-select"
              >
                <option value="date">Plus récent</option>
                <option value="budget">Budget croissant</option>
              </select>

              <button onClick={handleResetFilters} className="btn-reset">
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Liste des colocataires */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Chargement des demandes...</p>
            </div>
          ) : colocataires.length === 0 ? (
            <div className="no-results">
              <p>Aucune demande de colocataire trouvée</p>
            </div>
          ) : (
            <div className="colocataires-grid">
              {colocataires.map(colocataire => (
                <div key={colocataire.id} className="colocataire-card">
                  <div className="colocataire-header">
                    <div className="colocataire-avatar">
                      <img 
                        src={colocataire.etudiant?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(colocataire.etudiant?.nom_complet || 'User')} 
                        alt={colocataire.etudiant?.nom_complet}
                      />
                    </div>
                    <div className="colocataire-info">
                      <h3>{colocataire.titre}</h3>
                      <p className="colocataire-name">{colocataire.etudiant?.nom_complet}</p>
                    </div>
                  </div>

                  <div className="colocataire-body">
                    <p className="colocataire-description">{colocataire.description}</p>
                    
                    <div className="colocataire-details">
                      {colocataire.zone_preferee && (
                        <div className="detail-item">
                          <span className="detail-icon">📍</span>
                          <span>{colocataire.zone_preferee}</span>
                        </div>
                      )}
                      {colocataire.type_logement && (
                        <div className="detail-item">
                          <span className="detail-icon">🏠</span>
                          <span>{colocataire.type_logement}</span>
                        </div>
                      )}
                      {colocataire.budget_max && (
                        <div className="detail-item">
                          <span className="detail-icon">💰</span>
                          <span>{colocataire.budget_formatted || `${colocataire.budget_max} MAD`}</span>
                        </div>
                      )}
                    </div>

                    {colocataire.preferences && (
                      <div className="colocataire-preferences">
                        <strong>Préférences:</strong> {colocataire.preferences}
                      </div>
                    )}

                    <div className="colocataire-stats">
                      <span>👁️ {colocataire.vues || 0} vues</span>
                      <span>📧 {colocataire.contacts || 0} contacts</span>
                    </div>
                  </div>

                  <div className="colocataire-footer">
                    <button 
                      className="btn-contact"
                      onClick={() => handleContact(colocataire)}
                    >
                      Contacter
                    </button>
                    <span className="colocataire-date">
                      {new Date(colocataire.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TrouverColocataire;


