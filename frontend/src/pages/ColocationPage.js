import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardAnnonce from '../components/CardAnnonce';
import { getAnnonces, createAnnonce } from '../services/annonceService';
import { getToken, isAuthenticated } from '../services/authService';
import './ColocationPage.css';

// Icônes SVG React
const IconHome = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconList = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const IconPlus = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const IconRefresh = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const IconChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const IconUsers = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

function ColocationPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('annonces'); // 'annonces' ou 'ajouter'
  
  // États pour les annonces
  const [annonces, setAnnonces] = useState([]);
  const [loadingAnnonces, setLoadingAnnonces] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  
  // Filtres pour les annonces
  const [filters, setFilters] = useState({
    type: 'colocation',
    search: '',
    zone: '',
    prixMin: '',
    prixMax: '',
    surfaceMin: '',
    surfaceMax: '',
    nbChambres: '',
    meuble: '',
    colocationType: '',
    sortBy: 'date',
    sortDirection: 'desc'
  });

  // États pour le formulaire d'ajout
  const [formData, setFormData] = useState({
    titre: '',
    colocationType: '', // 'logement_trouve' ou 'logement_recherche'
    // Pour "J'ai trouvé un logement"
    nbColocatairesRecherches: '',
    nbColocatairesTrouves: '0',
    conditionsColocation: '',
    // Pour "Je cherche un logement"
    genreRecherche: '',
    typeChambreRecherchee: '',
    nbPersonnesSouhaitees: '',
    chercheSeul: false,
    // Informations générales
    zone: '',
    adresse: '',
    prix: '',
    surface: '',
    nbChambres: '1',
    description: '',
    descriptionLongue: '',
    meuble: false,
    disponibilite: '',
    equipements: [],
    regles: []
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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

  const equipementsList = [
    'Wi-Fi', 'Chauffage', 'Climatisation', 'Lave-linge', 'Lave-vaisselle',
    'Parking', 'Ascenseur', 'Balcon', 'Terrasse', 'Jardin', 'Piscine',
    'Salle de sport', 'Sécurité', 'Internet fibre'
  ];

  const reglesList = [
    'Non-fumeur', 'Animaux autorisés', 'Animaux non autorisés',
    'Pas de fêtes', 'Pas de visiteurs', 'Étudiants uniquement',
    'Filles uniquement', 'Garçons uniquement'
  ];

  // Charger les annonces de colocation
  const loadAnnonces = async () => {
    setLoadingAnnonces(true);
    try {
      const apiFilters = {
        type: 'colocation',
        ...filters
      };
      
      if (filters.search) apiFilters.search = filters.search;
      if (filters.zone) apiFilters.zone = filters.zone;
      if (filters.prixMin) apiFilters.prix_min = filters.prixMin;
      if (filters.prixMax) apiFilters.prix_max = filters.prixMax;
      if (filters.surfaceMin) apiFilters.surface_min = filters.surfaceMin;
      if (filters.surfaceMax) apiFilters.surface_max = filters.surfaceMax;
      if (filters.nbChambres) apiFilters.nb_chambres = filters.nbChambres;
      if (filters.meuble !== '') apiFilters.meuble = filters.meuble;
      if (filters.colocationType) apiFilters.colocation_type = filters.colocationType;
      
      if (filters.sortBy) {
        apiFilters.sort_by = filters.sortBy;
        apiFilters.sort_direction = filters.sortDirection || 'desc';
      }

      const data = await getAnnonces(apiFilters);
      setAnnonces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
      setAnnonces([]);
    } finally {
      setLoadingAnnonces(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'annonces') {
      loadAnnonces();
    }
  }, [activeSection]);

  // Recharger quand les filtres changent
  useEffect(() => {
    if (activeSection === 'annonces') {
      const timer = setTimeout(() => {
        if (filters.search === '') {
          loadAnnonces();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [filters.zone, filters.prixMin, filters.prixMax, filters.surfaceMin, filters.surfaceMax, filters.nbChambres, filters.meuble, filters.colocationType, filters.sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadAnnonces();
  };

  const handleResetFilters = () => {
    setFilters({
      type: 'colocation',
      search: '',
      zone: '',
      prixMin: '',
      prixMax: '',
      surfaceMin: '',
      surfaceMax: '',
      nbChambres: '',
      meuble: '',
      colocationType: '',
      sortBy: 'date',
      sortDirection: 'desc'
    });
    setTimeout(() => {
      loadAnnonces();
    }, 100);
  };

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 10) {
      alert('Vous ne pouvez ajouter que 10 photos maximum');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`L'image ${file.name} est trop grande (max 5MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, file]);
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleEquipementToggle = (equipement) => {
    setFormData(prev => ({
      ...prev,
      equipements: prev.equipements.includes(equipement)
        ? prev.equipements.filter(e => e !== equipement)
        : [...prev.equipements, equipement]
    }));
  };

  const handleRegleToggle = (regle) => {
    setFormData(prev => ({
      ...prev,
      regles: prev.regles.includes(regle)
        ? prev.regles.filter(r => r !== regle)
        : [...prev.regles, regle]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titre.trim()) newErrors.titre = 'Le titre est requis';
    if (!formData.colocationType) newErrors.colocationType = 'Le type de colocation est requis';
    
    // Validation pour "J'ai trouvé un logement"
    if (formData.colocationType === 'logement_trouve') {
      if (!formData.genreRecherche) {
        newErrors.genreRecherche = 'Le genre recherché est requis';
      }
      if (!formData.nbColocatairesRecherches || formData.nbColocatairesRecherches < 1) {
        newErrors.nbColocatairesRecherches = 'Le nombre de colocataires recherchés est requis (minimum 1)';
      }
      if (formData.nbColocatairesTrouves < 0) {
        newErrors.nbColocatairesTrouves = 'Le nombre de colocataires trouvés ne peut pas être négatif';
      }
      if (!formData.zone.trim()) newErrors.zone = 'La zone est requise';
      if (!formData.prix || formData.prix <= 0) newErrors.prix = 'Le prix par colocataire est requis';
      if (images.length === 0) newErrors.images = 'Au moins une photo du logement est requise';
    }
    
    // Validation pour "Je cherche un logement"
    if (formData.colocationType === 'logement_recherche') {
      if (!formData.genreRecherche) {
        newErrors.genreRecherche = 'Veuillez indiquer votre genre';
      }
      if (!formData.typeChambreRecherchee) {
        newErrors.typeChambreRecherchee = 'Veuillez indiquer le type de chambre recherchée';
      }
      if (!formData.zone || !formData.zone.trim()) {
        newErrors.zone = 'La zone préférée est requise';
      }
      // Prix n'est pas obligatoire pour "je cherche un logement"
      // Pas besoin de photos pour "je cherche un logement"
    }
    
    if (!formData.description.trim()) newErrors.description = 'La description est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      alert('Vous devez être connecté pour créer une annonce');
      navigate('/login');
      return;
    }

    if (!validateForm()) {
      alert('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const annonceData = {
        ...formData,
        type: 'colocation',
        colocationType: formData.colocationType,
        // Pour "J'ai trouvé un logement"
        nbColocatairesRecherches: formData.colocationType === 'logement_trouve' ? parseInt(formData.nbColocatairesRecherches) : null,
        nbColocatairesTrouves: formData.colocationType === 'logement_trouve' ? parseInt(formData.nbColocatairesTrouves) : 0,
        conditionsColocation: formData.colocationType === 'logement_trouve' ? formData.conditionsColocation : null,
        genreRecherche: formData.colocationType === 'logement_trouve' ? formData.genreRecherche : (formData.colocationType === 'logement_recherche' ? formData.genreRecherche : null),
        // Pour "Je cherche un logement"
        typeChambreRecherchee: formData.colocationType === 'logement_recherche' ? formData.typeChambreRecherchee : null,
        nbPersonnesSouhaitees: formData.colocationType === 'logement_recherche' ? (formData.nbPersonnesSouhaitees ? parseInt(formData.nbPersonnesSouhaitees) : null) : null,
        chercheSeul: formData.colocationType === 'logement_recherche' ? formData.chercheSeul : false,
        // Champs conditionnels selon le type
        zone: formData.zone || '', // S'assurer que zone n'est jamais null
        adresse: formData.colocationType === 'logement_trouve' ? formData.adresse : null,
        prix: formData.prix || 0, // Prix par colocataire OU budget max selon le type (0 si vide)
        surface: formData.colocationType === 'logement_trouve' ? formData.surface : null,
        nbChambres: formData.colocationType === 'logement_trouve' ? (formData.nbChambres || 1) : 1, // Valeur par défaut pour logement_recherche car la colonne ne peut pas être null
        meuble: formData.colocationType === 'logement_trouve' ? formData.meuble : false,
        disponibilite: formData.colocationType === 'logement_trouve' ? formData.disponibilite : null,
        equipements: formData.colocationType === 'logement_trouve' ? formData.equipements : [],
        regles: formData.regles
      };

      await createAnnonce(annonceData, token, images);
      alert('Votre annonce de colocation a été créée avec succès!');
      
      // Réinitialiser le formulaire
      setFormData({
        titre: '',
        colocationType: '',
        nbColocatairesRecherches: '',
        nbColocatairesTrouves: '0',
        conditionsColocation: '',
        genreRecherche: '',
        typeChambreRecherchee: '',
        nbPersonnesSouhaitees: '',
        chercheSeul: false,
        zone: '',
        adresse: '',
        prix: '',
        surface: '',
        nbChambres: '1',
        description: '',
        descriptionLongue: '',
        meuble: false,
        disponibilite: '',
        equipements: [],
        regles: []
      });
      setImages([]);
      setImagePreviews([]);
      setErrors({});
      
      // Passer à la section annonces et recharger
      setActiveSection('annonces');
      setTimeout(() => {
        loadAnnonces();
      }, 500);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert(error.message || 'Une erreur est survenue lors de la création de votre annonce');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="colocation-page">
      <Navbar />
      <main className="colocation-main">
        <div className="colocation-container">
          {/* Header */}
          <div className="colocation-header">
            <h1>
              <IconUsers />
              Colocation
            </h1>
            <p>Trouvez ou proposez une colocation à Agadir</p>
          </div>

          {/* Navigation principale - Onglets */}
          <div className="section-tabs-wrapper">
            <div className="section-tabs">
              <button
                className={`section-tab ${activeSection === 'annonces' ? 'active' : ''}`}
                onClick={() => setActiveSection('annonces')}
                aria-label="Voir les annonces"
              >
                <IconList />
                Voir les annonces
              </button>
              <button
                className={`section-tab ${activeSection === 'ajouter' ? 'active' : ''}`}
                onClick={() => setActiveSection('ajouter')}
                aria-label="Ajouter une annonce"
              >
                <IconPlus />
                Ajouter une annonce
              </button>
            </div>
          </div>

          {/* Section Annonces */}
          {activeSection === 'annonces' && (
            <>
              {/* Barre de recherche principale */}
              <div className="search-bar-container">
                <form onSubmit={handleSearch} className="main-search-form">
                  <div className="search-input-wrapper">
                    <span className="search-icon">
                      <IconSearch />
                    </span>
                    <input
                      type="text"
                      placeholder="Rechercher par titre, description ou zone..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="main-search-input"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearch(e);
                        }
                      }}
                    />
                    <button type="submit" className="search-button">
                      <IconSearch />
                      Rechercher
                    </button>
                  </div>
                </form>
                <button
                  className="toggle-filters-btn"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? <IconChevronUp /> : <IconChevronDown />}
                  Filtres avancés
                </button>
              </div>

              {/* Filtres avancés */}
              {showFilters && (
                <div className="advanced-filters-panel">
                  <div className="filters-grid">
                    <div className="filter-group">
                      <label>Zone</label>
                      <select
                        value={filters.zone}
                        onChange={(e) => handleFilterChange('zone', e.target.value)}
                      >
                        <option value="">Toutes les zones</option>
                        {zones.map(zone => (
                          <option key={zone} value={zone}>{zone}</option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>Type de colocation</label>
                      <select
                        value={filters.colocationType}
                        onChange={(e) => handleFilterChange('colocationType', e.target.value)}
                      >
                        <option value="">Tous les types</option>
                        <option value="logement_trouve">Logement trouvé - Cherche colocataires</option>
                        <option value="logement_recherche">Cherche logement + colocataire</option>
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>Prix minimum (MAD)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.prixMin}
                        onChange={(e) => handleFilterChange('prixMin', e.target.value)}
                        min="0"
                      />
                    </div>

                    <div className="filter-group">
                      <label>Prix maximum (MAD)</label>
                      <input
                        type="number"
                        placeholder="10000"
                        value={filters.prixMax}
                        onChange={(e) => handleFilterChange('prixMax', e.target.value)}
                        min="0"
                      />
                    </div>

                    <div className="filter-group">
                      <label>Surface minimum (m²)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.surfaceMin}
                        onChange={(e) => handleFilterChange('surfaceMin', e.target.value)}
                        min="0"
                      />
                    </div>

                    <div className="filter-group">
                      <label>Surface maximum (m²)</label>
                      <input
                        type="number"
                        placeholder="200"
                        value={filters.surfaceMax}
                        onChange={(e) => handleFilterChange('surfaceMax', e.target.value)}
                        min="0"
                      />
                    </div>

                    <div className="filter-group">
                      <label>Nombre de chambres</label>
                      <select
                        value={filters.nbChambres}
                        onChange={(e) => handleFilterChange('nbChambres', e.target.value)}
                      >
                        <option value="">Tous</option>
                        <option value="1">1 chambre</option>
                        <option value="2">2 chambres</option>
                        <option value="3">3 chambres</option>
                        <option value="4">4+ chambres</option>
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>Meublé</label>
                      <select
                        value={filters.meuble}
                        onChange={(e) => handleFilterChange('meuble', e.target.value)}
                      >
                        <option value="">Tous</option>
                        <option value="1">Meublé</option>
                        <option value="0">Non meublé</option>
                      </select>
                    </div>

                    <div className="filter-group">
                      <label>Trier par</label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleFilterChange('sortBy', value);
                          if (value === 'prix') {
                            handleFilterChange('sortDirection', 'asc');
                          } else if (value === 'prix_desc') {
                            handleFilterChange('sortDirection', 'desc');
                          } else {
                            handleFilterChange('sortDirection', 'desc');
                          }
                        }}
                      >
                        <option value="date">Date (plus récent)</option>
                        <option value="prix">Prix (croissant)</option>
                        <option value="prix_desc">Prix (décroissant)</option>
                        <option value="rating">Note (plus haute)</option>
                      </select>
                    </div>
                  </div>

                  <div className="filters-actions">
                    <button
                      type="button"
                      className="btn-apply-filters"
                      onClick={loadAnnonces}
                    >
                      <IconSearch />
                      Appliquer les filtres
                    </button>
                    <button
                      type="button"
                      className="btn-reset-filters"
                      onClick={handleResetFilters}
                    >
                      <IconRefresh />
                      Réinitialiser
                    </button>
                  </div>
                </div>
              )}

              {/* Résultats */}
              <div className="results-section">
                <div className="results-header">
                  <h2>
                    {loadingAnnonces 
                      ? 'Chargement...' 
                      : `${annonces.length} annonce${annonces.length > 1 ? 's' : ''} de colocation trouvée${annonces.length > 1 ? 's' : ''}`}
                  </h2>
                </div>

                {loadingAnnonces ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Chargement des annonces...</p>
                  </div>
                ) : annonces.length === 0 ? (
                  <div className="no-results">
                    <div className="no-results-icon">
                      <IconSearch />
                    </div>
                    <h3>Aucune annonce de colocation trouvée</h3>
                    <p>Essayez de modifier vos critères de recherche</p>
                    <button className="btn-reset-filters" onClick={handleResetFilters}>
                      <IconRefresh />
                      Réinitialiser les filtres
                    </button>
                  </div>
                ) : (
                  <div className="annonces-grid">
                    {annonces.map(annonce => (
                      <CardAnnonce key={annonce.id} annonce={annonce} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Section Ajouter une annonce */}
          {activeSection === 'ajouter' && (
            <>
              <div className="page-header">
                <h1>Créer une annonce de colocation</h1>
                <p>Remplissez le formulaire ci-dessous pour créer votre annonce de colocation</p>
              </div>

              <form onSubmit={handleSubmit} className="annonce-form">
                  {/* Type de colocation */}
                  <div className="form-section">
                    <div className="section-header">
                      <div className="section-number">1</div>
                      <div className="section-title-content">
                        <h3>Type de colocation *</h3>
                        <p className="section-hint">Choisissez le type de votre annonce</p>
                      </div>
                    </div>
                    <div className="colocation-type-options">
                      <label className={`colocation-type-option ${formData.colocationType === 'logement_trouve' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="colocationType"
                          value="logement_trouve"
                          checked={formData.colocationType === 'logement_trouve'}
                          onChange={handleInputChange}
                          required
                        />
                        <div className="option-content">
                          <div className="option-icon">
                            <IconHome />
                          </div>
                          <div className="option-text">
                            <strong>J'ai trouvé un logement</strong>
                            <p>Je cherche des colocataires pour partager mon logement</p>
                          </div>
                        </div>
                      </label>

                      <label className={`colocation-type-option ${formData.colocationType === 'logement_recherche' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="colocationType"
                          value="logement_recherche"
                          checked={formData.colocationType === 'logement_recherche'}
                          onChange={handleInputChange}
                          required
                        />
                        <div className="option-content">
                          <div className="option-icon">
                            <IconSearch />
                          </div>
                          <div className="option-text">
                            <strong>Je cherche un logement</strong>
                            <p>Je cherche un colocataire et un logement ensemble</p>
                          </div>
                        </div>
                      </label>
                    </div>
                    {errors.colocationType && <span className="error-message">{errors.colocationType}</span>}
                  </div>

                  {/* Champs spécifiques pour "J'ai trouvé un logement" */}
                  {formData.colocationType === 'logement_trouve' && (
                    <div className="form-section">
                      <div className="section-header">
                        <div className="section-number">2</div>
                        <div className="section-title-content">
                          <h3>Détails de la recherche de colocataires</h3>
                          <p className="section-hint">Indiquez combien de colocataires vous recherchez et vos préférences</p>
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Genre recherché *</label>
                          <select
                            name="genreRecherche"
                            value={formData.genreRecherche}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Sélectionner</option>
                            <option value="homme">Homme</option>
                            <option value="femme">Femme</option>
                          </select>
                          <small>Genre des colocataires recherchés</small>
                          {errors.genreRecherche && <span className="error-message">{errors.genreRecherche}</span>}
                        </div>

                        <div className="form-group">
                          <label>Nombre de colocataires recherchés *</label>
                          <input
                            type="number"
                            name="nbColocatairesRecherches"
                            value={formData.nbColocatairesRecherches}
                            onChange={handleInputChange}
                            placeholder="Ex: 2"
                            min="1"
                            required
                          />
                          <small>Combien de colocataires cherchez-vous ?</small>
                          {errors.nbColocatairesRecherches && <span className="error-message">{errors.nbColocatairesRecherches}</span>}
                        </div>

                        <div className="form-group">
                          <label>Nombre de colocataires déjà trouvés</label>
                          <input
                            type="number"
                            name="nbColocatairesTrouves"
                            value={formData.nbColocatairesTrouves}
                            onChange={handleInputChange}
                            placeholder="0"
                            min="0"
                          />
                          <small>Combien avez-vous déjà trouvé ?</small>
                          {errors.nbColocatairesTrouves && <span className="error-message">{errors.nbColocatairesTrouves}</span>}
                        </div>
                      </div>

                      <div className="form-group full-width">
                        <label>Conditions de colocation</label>
                        <textarea
                          name="conditionsColocation"
                          value={formData.conditionsColocation}
                          onChange={handleInputChange}
                          placeholder="Ex: Étudiants sérieux uniquement, non-fumeurs, calme requis..."
                          rows="4"
                        />
                        <small>Décrivez les conditions et préférences pour vos colocataires</small>
                      </div>
                    </div>
                  )}

                  {/* Champs spécifiques pour "Je cherche un logement" */}
                  {formData.colocationType === 'logement_recherche' && (
                    <div className="form-section">
                      <div className="section-header">
                        <div className="section-number">2</div>
                        <div className="section-title-content">
                          <h3>Vos préférences de recherche</h3>
                          <p className="section-hint">Indiquez vos préférences pour trouver un colocataire et un logement</p>
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Genre *</label>
                          <select
                            name="genreRecherche"
                            value={formData.genreRecherche}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Sélectionner</option>
                            <option value="homme">Homme</option>
                            <option value="femme">Femme</option>
                            <option value="mixte">Mixte (peu importe)</option>
                          </select>
                          <small>Votre genre</small>
                          {errors.genreRecherche && <span className="error-message">{errors.genreRecherche}</span>}
                        </div>

                        <div className="form-group">
                          <label>Type de chambre recherchée *</label>
                          <select
                            name="typeChambreRecherchee"
                            value={formData.typeChambreRecherchee}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Sélectionner</option>
                            <option value="chambre_seule">Chambre seule</option>
                            <option value="chambre_partagee">Chambre partagée</option>
                            <option value="indifferent">Peu importe</option>
                          </select>
                          <small>Quel type de chambre cherchez-vous ?</small>
                          {errors.typeChambreRecherchee && <span className="error-message">{errors.typeChambreRecherchee}</span>}
                        </div>
                      </div>

                      {formData.typeChambreRecherchee === 'chambre_partagee' && (
                        <div className="form-row">
                          <div className="form-group">
                            <label>Nombre de personnes dans la chambre</label>
                            <input
                              type="number"
                              name="nbPersonnesSouhaitees"
                              value={formData.nbPersonnesSouhaitees}
                              onChange={handleInputChange}
                              placeholder="Ex: 2"
                              min="2"
                            />
                            <small>Combien de personnes maximum dans la chambre partagée ?</small>
                          </div>
                        </div>
                      )}

                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            name="chercheSeul"
                            checked={formData.chercheSeul}
                            onChange={handleInputChange}
                          />
                          Je cherche à être seul(e) dans ma chambre
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Informations de base - Différent selon le type */}
                  {formData.colocationType === 'logement_trouve' ? (
                    <div className="form-section">
                      <div className="section-header">
                        <div className="section-number">3</div>
                        <div className="section-title-content">
                          <h3>Informations du logement</h3>
                          <p className="section-hint">Détails du logement que vous avez trouvé</p>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group full-width">
                          <label>Titre de l'annonce *</label>
                          <input
                            type="text"
                            name="titre"
                            value={formData.titre}
                            onChange={handleInputChange}
                            placeholder="Ex: Colocation moderne à Universiapolis"
                            required
                          />
                          {errors.titre && <span className="error-message">{errors.titre}</span>}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Zone *</label>
                          <select
                            name="zone"
                            value={formData.zone}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Sélectionner une zone</option>
                            {zones.map(zone => (
                              <option key={zone} value={zone}>{zone}</option>
                            ))}
                          </select>
                          {errors.zone && <span className="error-message">{errors.zone}</span>}
                        </div>

                        <div className="form-group">
                          <label>Adresse complète</label>
                          <input
                            type="text"
                            name="adresse"
                            value={formData.adresse}
                            onChange={handleInputChange}
                            placeholder="Rue, numéro, etc."
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Prix mensuel par colocataire (MAD) *</label>
                          <input
                            type="number"
                            name="prix"
                            value={formData.prix}
                            onChange={handleInputChange}
                            placeholder="Ex: 2000"
                            min="0"
                            required
                          />
                          <small>Prix que chaque colocataire devra payer</small>
                          {errors.prix && <span className="error-message">{errors.prix}</span>}
                        </div>

                        <div className="form-group">
                          <label>Surface totale (m²)</label>
                          <input
                            type="number"
                            name="surface"
                            value={formData.surface}
                            onChange={handleInputChange}
                            placeholder="Ex: 50"
                            min="0"
                          />
                        </div>

                        <div className="form-group">
                          <label>Nombre de chambres</label>
                          <input
                            type="number"
                            name="nbChambres"
                            value={formData.nbChambres}
                            onChange={handleInputChange}
                            placeholder="1"
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              name="meuble"
                              checked={formData.meuble}
                              onChange={handleInputChange}
                            />
                            Logement meublé
                          </label>
                        </div>

                        <div className="form-group">
                          <label>Disponibilité</label>
                          <input
                            type="text"
                            name="disponibilite"
                            value={formData.disponibilite}
                            onChange={handleInputChange}
                            placeholder="Ex: Immédiate, Janvier 2024"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="form-section">
                      <div className="section-header">
                        <div className="section-number">3</div>
                        <div className="section-title-content">
                          <h3>Informations de recherche</h3>
                          <p className="section-hint">Indiquez ce que vous recherchez</p>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group full-width">
                          <label>Titre de votre demande *</label>
                          <input
                            type="text"
                            name="titre"
                            value={formData.titre}
                            onChange={handleInputChange}
                            placeholder="Ex: Étudiant cherche colocataire et logement à Universiapolis"
                            required
                          />
                          {errors.titre && <span className="error-message">{errors.titre}</span>}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Zone préférée *</label>
                          <select
                            name="zone"
                            value={formData.zone}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Sélectionner une zone</option>
                            {zones.map(zone => (
                              <option key={zone} value={zone}>{zone}</option>
                            ))}
                          </select>
                          <small>Zone où vous souhaitez trouver un logement</small>
                          {errors.zone && <span className="error-message">{errors.zone}</span>}
                        </div>

                        <div className="form-group">
                          <label>Budget maximum (MAD/mois)</label>
                          <input
                            type="number"
                            name="prix"
                            value={formData.prix}
                            onChange={handleInputChange}
                            placeholder="Ex: 2000"
                            min="0"
                          />
                          <small>Votre budget maximum pour le loyer</small>
                          {errors.prix && <span className="error-message">{errors.prix}</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="form-section">
                    <div className="section-header">
                      <div className="section-number">{formData.colocationType ? '4' : '3'}</div>
                      <div className="section-title-content">
                        <h3>Description</h3>
                        <p className="section-hint">Décrivez votre annonce de manière attractive</p>
                      </div>
                    </div>
                    <div className="form-group full-width">
                      <label>Description courte *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Décrivez votre annonce..."
                        rows="4"
                        required
                      />
                      {errors.description && <span className="error-message">{errors.description}</span>}
                    </div>

                    <div className="form-group full-width">
                      <label>Description détaillée</label>
                      <textarea
                        name="descriptionLongue"
                        value={formData.descriptionLongue}
                        onChange={handleInputChange}
                        placeholder="Plus de détails sur le logement, le quartier, etc."
                        rows="6"
                      />
                    </div>
                  </div>

                  {/* Images - Seulement pour "J'ai trouvé un logement" */}
                  {formData.colocationType === 'logement_trouve' && (
                    <div className="form-section">
                      <div className="section-header">
                        <div className="section-number">4</div>
                        <div className="section-title-content">
                          <h3>Photos du logement *</h3>
                          <p className="section-hint">Ajoutez jusqu'à 10 photos depuis votre ordinateur (max 5MB chacune)</p>
                        </div>
                      </div>
                      <div className="images-upload">
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="image-upload" className="upload-button">
                          📷 Ajouter des photos du logement (max 10)
                        </label>
                        {errors.images && <span className="error-message">{errors.images}</span>}
                        
                        {imagePreviews.length > 0 && (
                          <div className="image-previews">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="image-preview">
                                <img src={preview} alt={`Preview ${index + 1}`} />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="remove-image-btn"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Équipements - Seulement pour "J'ai trouvé un logement" */}
                  {formData.colocationType === 'logement_trouve' && (
                    <div className="form-section">
                      <div className="section-header">
                        <div className="section-number">5</div>
                        <div className="section-title-content">
                          <h3>Équipements du logement</h3>
                          <p className="section-hint">Sélectionnez les équipements disponibles</p>
                        </div>
                      </div>
                      <div className="checkbox-grid">
                        {equipementsList.map(equipement => (
                          <label key={equipement} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={formData.equipements.includes(equipement)}
                              onChange={() => handleEquipementToggle(equipement)}
                            />
                            <span>{equipement}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Règles de colocation */}
                  <div className="form-section">
                    <div className="section-header">
                      <div className="section-number">{formData.colocationType === 'logement_trouve' ? '6' : '4'}</div>
                      <div className="section-title-content">
                        <h3>Règles et préférences</h3>
                        <p className="section-hint">
                          {formData.colocationType === 'logement_trouve' 
                            ? 'Règles que vous souhaitez appliquer dans votre colocation'
                            : 'Vos préférences et conditions pour la colocation'}
                        </p>
                      </div>
                    </div>
                    <div className="checkbox-grid">
                      {reglesList.map(regle => (
                        <label key={regle} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.regles.includes(regle)}
                            onChange={() => handleRegleToggle(regle)}
                          />
                          <span>{regle}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                {/* Bouton de soumission */}
                <div className="form-actions">
                  <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? 'Création en cours...' : 'Publier l\'annonce'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ColocationPage;
