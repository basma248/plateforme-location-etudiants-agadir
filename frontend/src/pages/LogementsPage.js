import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardAnnonce from '../components/CardAnnonce';
import { getAnnonces } from '../services/annonceService';
import './LogementsPage.css';

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

function LogementsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('annonces'); // 'annonces' ou 'ajouter'
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  
  // Filtres avancés
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    zone: '',
    prixMin: '',
    prixMax: '',
    surfaceMin: '',
    surfaceMax: '',
    nbChambres: '',
    meuble: '',
    sortBy: 'date',
    sortDirection: 'desc'
  });

  // Zones disponibles (vous pouvez les récupérer depuis l'API)
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

  // Charger les annonces avec filtres
  const loadAnnonces = async () => {
    setLoading(true);
    try {
      // Préparer les filtres pour l'API
      const apiFilters = {};
      
      if (filters.search) apiFilters.search = filters.search;
      // Exclure les annonces de type "colocation" de la page logements
      // Si l'utilisateur a sélectionné "colocation", on l'ignore
      if (filters.type && filters.type !== 'colocation') {
        apiFilters.type = filters.type;
      }
      // Exclure explicitement les annonces de colocation
      apiFilters.exclude_type = 'colocation';
      if (filters.zone) apiFilters.zone = filters.zone;
      if (filters.prixMin) apiFilters.prix_min = filters.prixMin;
      if (filters.prixMax) apiFilters.prix_max = filters.prixMax;
      if (filters.surfaceMin) apiFilters.surface_min = filters.surfaceMin;
      if (filters.surfaceMax) apiFilters.surface_max = filters.surfaceMax;
      if (filters.nbChambres) apiFilters.nb_chambres = filters.nbChambres;
      if (filters.meuble !== '') apiFilters.meuble = filters.meuble;
      
      // Gérer le tri
      if (filters.sortBy === 'prix_desc') {
        apiFilters.sort_by = 'prix';
        apiFilters.sort_direction = 'desc';
      } else if (filters.sortBy) {
        apiFilters.sort_by = filters.sortBy;
        apiFilters.sort_direction = filters.sortDirection || 'desc';
      }

      const data = await getAnnonces(apiFilters);
      // Filtrer aussi côté client pour être sûr d'exclure les colocations
      const filteredData = Array.isArray(data) ? data.filter(annonce => annonce.type !== 'colocation') : [];
      setAnnonces(filteredData);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
      setAnnonces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnonces();
  }, []);

  // Recharger les annonces quand les filtres changent (sauf pour la recherche qui nécessite un clic)
  useEffect(() => {
    // Ne pas recharger automatiquement pour la recherche textuelle
    // Elle sera déclenchée par le bouton "Rechercher" ou Enter
    // Recharger seulement pour les autres filtres
    const timer = setTimeout(() => {
      if (filters.search === '') {
        // Si la recherche est vide, recharger avec les autres filtres
        loadAnnonces();
      }
    }, 500); // Debounce de 500ms
    return () => clearTimeout(timer);
  }, [filters.type, filters.zone, filters.prixMin, filters.prixMax, filters.surfaceMin, filters.surfaceMax, filters.nbChambres, filters.meuble, filters.sortBy]);

  // Appliquer les filtres
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
      search: '',
      type: '',
      zone: '',
      prixMin: '',
      prixMax: '',
      surfaceMin: '',
      surfaceMax: '',
      nbChambres: '',
      meuble: '',
      sortBy: 'date',
      sortDirection: 'desc'
    });
    setTimeout(() => {
      loadAnnonces();
    }, 100);
  };

  return (
    <div className="logements-page">
      <Navbar />
      <main className="logements-main">
        <div className="logements-container">
          {/* Header */}
          <div className="logements-header">
            <h1>
              <IconHome />
              Trouvez ou proposez un logement à Agadir
            </h1>
            <p>Trouvez le logement parfait qui correspond à vos besoins</p>
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
                onClick={() => {
                  setActiveSection('ajouter');
                  navigate('/ajouter-annonce');
                }}
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
                {/* Type */}
                <div className="filter-group">
                  <label>Type de logement</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <option value="">Tous les types</option>
                    <option value="chambre">Chambre</option>
                    <option value="studio">Studio</option>
                    <option value="appartement">Appartement</option>
                    {/* Colocation exclue - voir page dédiée /colocation */}
                  </select>
                </div>

                {/* Zone */}
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

                {/* Prix Min */}
                <div className="filter-group">
                  <label>Prix minimum (DH)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.prixMin}
                    onChange={(e) => handleFilterChange('prixMin', e.target.value)}
                    min="0"
                  />
                </div>

                {/* Prix Max */}
                <div className="filter-group">
                  <label>Prix maximum (DH)</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={filters.prixMax}
                    onChange={(e) => handleFilterChange('prixMax', e.target.value)}
                    min="0"
                  />
                </div>

                {/* Surface Min */}
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

                {/* Surface Max */}
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

                {/* Nombre de chambres */}
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

                {/* Meublé */}
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

                {/* Tri */}
                <div className="filter-group">
                  <label>Trier par</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange('sortBy', value);
                      // Définir la direction automatiquement
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

              {/* Actions */}
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
                    {loading ? 'Chargement...' : `${annonces.length} logement${annonces.length > 1 ? 's' : ''} trouvé${annonces.length > 1 ? 's' : ''}`}
                  </h2>
                </div>

                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Chargement des annonces...</p>
                  </div>
                ) : annonces.length === 0 ? (
                  <div className="no-results">
                    <div className="no-results-icon">
                      <IconSearch />
                    </div>
                    <h3>Aucun logement trouvé</h3>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LogementsPage;
