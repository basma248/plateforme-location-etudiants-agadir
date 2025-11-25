import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardAnnonce from '../components/CardAnnonce';
import AdvancedFilters from '../components/AdvancedFilters';
import { getAnnonces } from '../services/annonceService';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    zone: '',
    prixMin: '',
    prixMax: '',
    surfaceMin: '',
    nbChambres: '',
    meuble: '',
    disponibilite: ''
  });

  // Données d'exemple si l'API n'est pas disponible
  const exampleAnnonces = [
    {
      id: 1,
      titre: 'Chambre moderne près de l\'université',
      zone: 'Universiapolis',
      prix: 1500,
      type: 'chambre',
      surface: 15,
      nbChambres: 1,
      meuble: true,
      description: 'Chambre spacieuse et lumineuse dans un appartement partagé. Proche de toutes les commodités et des transports.',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      rating: 4.8
    },
    {
      id: 2,
      titre: 'Studio indépendant Founty',
      zone: 'Founty',
      prix: 2500,
      type: 'studio',
      surface: 25,
      nbChambres: 1,
      meuble: true,
      description: 'Studio entièrement meublé avec cuisine équipée et salle de bain privée. Idéal pour étudiant.',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      rating: 4.9
    },
    {
      id: 3,
      titre: 'Appartement 2 chambres Hay Salam',
      zone: 'Hay Salam',
      prix: 3500,
      type: 'appartement',
      surface: 60,
      nbChambres: 2,
      meuble: false,
      description: 'Bel appartement au 2ème étage avec balcon. Parfait pour colocation.',
      images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'],
      rating: 4.7
    },
    {
      id: 4,
      titre: 'Colocation étudiante centre-ville',
      zone: 'Centre-ville',
      prix: 1200,
      type: 'colocation',
      surface: 20,
      nbChambres: 1,
      meuble: true,
      description: 'Chambre dans colocation sympa avec 2 autres étudiants. Ambiance conviviale garantie !',
      images: ['https://images.unsplash.com/photo-1556912172-45b7abe8b7e8?w=800'],
      rating: 4.6
    },
    {
      id: 5,
      titre: 'Studio moderne avec terrasse',
      zone: 'Anza',
      prix: 2800,
      type: 'studio',
      surface: 30,
      nbChambres: 1,
      meuble: true,
      description: 'Studio récent avec terrasse privée. Vue sur la mer. Parking disponible.',
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
      rating: 5.0
    },
    {
      id: 6,
      titre: 'Chambre dans villa étudiante',
      zone: 'Inezgane',
      prix: 1800,
      type: 'chambre',
      surface: 18,
      nbChambres: 1,
      meuble: true,
      description: 'Chambre dans une belle villa avec jardin. Accès internet haut débit inclus.',
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
      rating: 4.5
    }
  ];

  useEffect(() => {
    const loadAnnonces = async () => {
      setLoading(true);
      try {
        const data = await getAnnonces(filters);
        setAnnonces(data);
      } catch (error) {
        console.error('Erreur lors du chargement des annonces:', error);
        // En cas d'erreur, utiliser les données d'exemple
        setAnnonces(exampleAnnonces);
      } finally {
        setLoading(false);
      }
    };

    loadAnnonces();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      type: '',
      zone: '',
      prixMin: '',
      prixMax: '',
      surfaceMin: '',
      nbChambres: '',
      meuble: '',
      disponibilite: ''
    });
    setSearchQuery('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // La recherche est gérée par le filtrage en temps réel
  };

  // Filtrer les annonces
  const filteredAnnonces = annonces.filter(annonce => {
    // Recherche par texte
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        annonce.titre?.toLowerCase().includes(query) ||
        annonce.description?.toLowerCase().includes(query) ||
        annonce.zone?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Filtres
    if (filters.type && annonce.type !== filters.type) return false;
    if (filters.zone && !annonce.zone?.toLowerCase().includes(filters.zone.toLowerCase())) return false;
    if (filters.prixMin && annonce.prix < parseInt(filters.prixMin)) return false;
    if (filters.prixMax && annonce.prix > parseInt(filters.prixMax)) return false;
    if (filters.surfaceMin && annonce.surface < parseInt(filters.surfaceMin)) return false;
    if (filters.nbChambres && annonce.nbChambres !== parseInt(filters.nbChambres)) return false;
    if (filters.meuble !== '' && annonce.meuble !== (filters.meuble === 'true')) return false;

    return true;
  });

  return (
    <div className="homepage-wrapper">
      <Navbar />
      
    <main className="homepage">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="hero-overlay"></div>
          </div>
          <div className="container hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Trouvez votre logement étudiant à Agadir
              </h1>
              <p className="hero-subtitle">
                Des centaines d'annonces vérifiées. Chambres, studios, appartements et colocations.
                Trouvez votre chez-vous en quelques clics.
              </p>
          </div>

            {/* Barre de recherche principale */}
            <div className="search-bar-hero">
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-wrapper">
                  <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
              <input
                type="text"
                    className="search-input"
                    placeholder="Rechercher par zone, type de logement..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="search-button">
                Rechercher
              </button>
            </form>
          </div>
        </div>
      </section>

        {/* Filtres avancés */}
        <section className="filters-section">
        <div className="container">
            <AdvancedFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
        </div>
      </section>

        {/* Résultats */}
        <section className="results-section">
        <div className="container">
            <div className="results-header">
              <h2 className="results-title">
                {loading ? 'Chargement...' : `${filteredAnnonces.length} logement${filteredAnnonces.length > 1 ? 's' : ''} disponible${filteredAnnonces.length > 1 ? 's' : ''}`}
              </h2>
              {!loading && filteredAnnonces.length > 0 && (
                <div className="results-sort">
                  <label htmlFor="sort-select">Trier par:</label>
                  <select id="sort-select" className="sort-select">
                    <option value="prix-asc">Prix croissant</option>
                    <option value="prix-desc">Prix décroissant</option>
                    <option value="recent">Plus récent</option>
                    <option value="rating">Mieux notés</option>
                  </select>
              </div>
              )}
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Chargement des annonces...</p>
              </div>
            ) : filteredAnnonces.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>Aucun logement trouvé</h3>
                <p>Essayez de modifier vos critères de recherche ou vos filtres.</p>
                <button onClick={handleResetFilters} className="btn-reset">
                  Réinitialiser les filtres
                </button>
            </div>
            ) : (
              <div className="annonces-grid">
                {filteredAnnonces.map(annonce => (
                  <CardAnnonce key={annonce.id} annonce={annonce} />
                ))}
              </div>
            )}
        </div>
      </section>

        {/* Section catégories */}
        <section className="categories-section">
          <div className="container">
            <h2 className="section-title">Parcourir par type</h2>
            <div className="categories-grid">
              <Link
                to="/logements?type=chambre"
                className="category-card"
                onClick={() => setFilters({ ...filters, type: 'chambre' })}
              >
                <div className="category-icon">🛏️</div>
                <h3>Chambres</h3>
                <p>Chambres individuelles dans appartements partagés</p>
              </Link>
              <Link
                to="/logements?type=studio"
                className="category-card"
                onClick={() => setFilters({ ...filters, type: 'studio' })}
              >
                <div className="category-icon">🏢</div>
                <h3>Studios</h3>
                <p>Studios indépendants et meublés</p>
              </Link>
              <Link
                to="/logements?type=appartement"
                className="category-card"
                onClick={() => setFilters({ ...filters, type: 'appartement' })}
              >
                <div className="category-icon">🏘️</div>
                <h3>Appartements</h3>
                <p>Appartements complets pour colocation</p>
              </Link>
              <Link
                to="/logements?type=colocation"
                className="category-card"
                onClick={() => setFilters({ ...filters, type: 'colocation' })}
              >
                <div className="category-icon">🤝</div>
                <h3>Colocations</h3>
                <p>Trouvez vos futurs colocataires</p>
              </Link>
          </div>
        </div>
      </section>

        {/* Section CTA */}
        <section className="cta-section">
          <div className="container cta-content">
            <div className="cta-text">
              <h2>Vous êtes propriétaire ?</h2>
              <p>Publiez votre annonce gratuitement et trouvez des locataires rapidement.</p>
          </div>
            <Link to="/ajouter-annonce" className="cta-button">
              Publier une annonce
            </Link>
        </div>
      </section>
    </main>

      <Footer />
    </div>
  );
}
