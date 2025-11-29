import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardAnnonce from '../components/CardAnnonce';
import { getAnnonces } from '../services/annonceService';
import './LogementsPage.css';

function LogementsPage() {
  const navigate = useNavigate();
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
      if (filters.type) apiFilters.type = filters.type;
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
      setAnnonces(Array.isArray(data) ? data : []);
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
            <h1>🏠 Tous les logements disponibles</h1>
            <p>Trouvez le logement parfait qui correspond à vos besoins</p>
          </div>

          {/* Barre de recherche principale */}
          <div className="search-bar-container">
            <form onSubmit={handleSearch} className="main-search-form">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
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
                  Rechercher
                </button>
              </div>
            </form>
            <button
              className="toggle-filters-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? '▲' : '▼'} Filtres avancés
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
                    <option value="colocation">Colocation</option>
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
                  🔍 Appliquer les filtres
                </button>
                <button
                  type="button"
                  className="btn-reset-filters"
                  onClick={handleResetFilters}
                >
                  🔄 Réinitialiser
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
                <div className="no-results-icon">🔍</div>
                <h3>Aucun logement trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
                <button className="btn-reset-filters" onClick={handleResetFilters}>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LogementsPage;
