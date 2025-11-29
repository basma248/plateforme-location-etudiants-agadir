import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardAnnonce from '../components/CardAnnonce';
import AdvancedFilters from '../components/AdvancedFilters';
import { getAnnonces } from '../services/annonceService';
import { getCurrentUser, isAuthenticated } from '../services/authService';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
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

  // Vérifier l'utilisateur connecté
  useEffect(() => {
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setShowWelcome(true);
      // Masquer le message après 5 secondes
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, []);

  // Images du carrousel - haute qualité depuis Unsplash
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&q=80',
      title: 'Chambres modernes',
      subtitle: 'Confort et style pour étudiants'
    },
    {
      url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1920&q=80',
      title: 'Studios indépendants',
      subtitle: 'Votre espace personnel'
    },
    {
      url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1920&q=80',
      title: 'Appartements spacieux',
      subtitle: 'Parfait pour la colocation'
    },
    {
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=80',
      title: 'Vue sur la mer',
      subtitle: 'Logements avec vue exceptionnelle'
    }
  ];

  // Statistiques attractives
  const stats = [
    { number: '500+', label: 'Annonces actives', icon: '🏠' },
    { number: '1200+', label: 'Étudiants satisfaits', icon: '👥' },
    { number: '98%', label: 'Taux de satisfaction', icon: '⭐' },
    { number: '24/7', label: 'Support disponible', icon: '💬' }
  ];

  // Témoignages
  const testimonials = [
    {
      name: 'Ahmed B.',
      role: 'Étudiant',
      text: 'J\'ai trouvé mon logement en 2 jours ! Plateforme très intuitive.',
      avatar: '👨‍🎓'
    },
    {
      name: 'Fatima A.',
      role: 'Étudiante',
      text: 'Service excellent, les propriétaires sont vérifiés. Je recommande !',
      avatar: '👩‍🎓'
    },
    {
      name: 'Youssef M.',
      role: 'Étudiant',
      text: 'La meilleure plateforme pour trouver un logement étudiant à Agadir.',
      avatar: '👨‍💼'
    }
  ];

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
      description: 'Chambre spacieuse et lumineuse dans un appartement partagé.',
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
      description: 'Studio entièrement meublé avec cuisine équipée.',
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
      description: 'Bel appartement au 2ème étage avec balcon.',
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
      description: 'Chambre dans colocation sympa avec 2 autres étudiants.',
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
      description: 'Studio récent avec terrasse privée. Vue sur la mer.',
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
      description: 'Chambre dans une belle villa avec jardin.',
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
      rating: 4.5
    }
  ];

  // Carrousel automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadAnnonces = async () => {
      setLoading(true);
      try {
        console.log('Chargement des annonces avec filtres:', filters);
        const data = await getAnnonces(filters);
        console.log('Données reçues (HomePage):', data);
        
        if (data && Array.isArray(data)) {
          console.log('Annonces chargées:', data.length, 'annonces');
          // Vérifier que chaque annonce a un ID
          data.forEach((annonce, index) => {
            if (!annonce.id) {
              console.warn(`Annonce à l'index ${index} n'a pas d'ID:`, annonce);
            }
            console.log(`Annonce ${index}: ID=${annonce.id}, Titre=${annonce.titre}, Images=${annonce.images?.length || 0}, All_images=${annonce.all_images?.length || 0}`);
            if (annonce.images && annonce.images.length > 0) {
              console.log(`  Images URLs:`, annonce.images);
            }
          });
          setAnnonces(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          console.log('Annonces chargées (data.data):', data.data.length, 'annonces');
          setAnnonces(data.data);
        } else if (data && typeof data === 'object') {
          const annoncesArray = data.data || data.items || data.results || [];
          console.log('Annonces chargées (objet):', annoncesArray.length, 'annonces');
          setAnnonces(Array.isArray(annoncesArray) ? annoncesArray : []);
        } else {
          console.warn('Aucune annonce trouvée ou format inattendu');
          setAnnonces([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des annonces:', error);
        console.error('Détails de l\'erreur:', error.message);
        console.error('Stack:', error.stack);
        // NE PAS utiliser les données d'exemple - laisser un tableau vide
        setAnnonces([]);
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
  };


  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  // Filtrer les annonces (filtres simples côté client pour la page d'accueil)
  const filteredAnnonces = Array.isArray(annonces) ? annonces.filter(annonce => {
    // Vérifier que l'annonce a les propriétés nécessaires
    if (!annonce || !annonce.id) return false;
    
    if (filters.type && annonce.type !== filters.type) return false;
    if (filters.zone && !annonce.zone?.toLowerCase().includes(filters.zone.toLowerCase())) return false;
    if (filters.prixMin && annonce.prix < parseInt(filters.prixMin)) return false;
    if (filters.prixMax && annonce.prix > parseInt(filters.prixMax)) return false;
    if (filters.surfaceMin && annonce.surface && annonce.surface < parseInt(filters.surfaceMin)) return false;
    // Gérer à la fois nbChambres (camelCase) et nb_chambres (snake_case)
    const nbChambres = annonce.nbChambres ?? annonce.nb_chambres;
    if (filters.nbChambres && nbChambres !== parseInt(filters.nbChambres)) return false;
    if (filters.meuble !== '' && filters.meuble !== null && annonce.meuble !== (filters.meuble === 'true')) return false;

    return true;
  }) : [];

  return (
    <div className="homepage-wrapper">
      <Navbar />
      
      {/* Message de bienvenue */}
      {showWelcome && user && (
        <div className="welcome-message">
          <div className="welcome-content">
            <span className="welcome-icon">👋</span>
            <span className="welcome-text">
              Bonjour <strong>{user.prenom || user.nom || 'Bienvenue'}</strong> ! Content de vous revoir.
            </span>
            <button className="welcome-close" onClick={() => setShowWelcome(false)}>×</button>
          </div>
        </div>
      )}

      <main className="homepage">
        {/* Hero Section avec Carrousel */}
        <section className="hero-section">
          <div className="hero-carousel">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${image.url})` }}
              >
                <div className="hero-slide-overlay"></div>
                <div className="hero-slide-content">
                  <h2 className="hero-slide-title">{image.title}</h2>
                  <p className="hero-slide-subtitle">{image.subtitle}</p>
                </div>
              </div>
            ))}
            
            {/* Contrôles du carrousel */}
            <button className="carousel-btn carousel-btn-prev" onClick={prevSlide} aria-label="Image précédente">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button className="carousel-btn carousel-btn-next" onClick={nextSlide} aria-label="Image suivante">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>

            {/* Indicateurs */}
            <div className="carousel-indicators">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Aller à l'image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Trouvez votre logement étudiant à Agadir
              </h1>
              <p className="hero-subtitle">
                Des centaines d'annonces vérifiées. Chambres, studios, appartements et colocations.
                Trouvez votre chez-vous en quelques clics.
              </p>
            </div>

            {/* Call to Action */}
            <div className="hero-cta">
              <p className="hero-cta-text">
                Découvrez des centaines de logements adaptés aux étudiants à Agadir
              </p>
              <div className="hero-cta-buttons">
                <Link to="/logements" className="cta-button cta-primary">
                  🔍 Voir tous les logements
                </Link>
                {isAuthenticated() && (
                  <Link to="/ajouter-annonce" className="cta-button cta-secondary">
                    ➕ Publier une annonce
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section Statistiques */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon">{stat.icon}</div>
                  </div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
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

        {/* Section Témoignages */}
        <section className="testimonials-section">
          <div className="container">
            <h2 className="section-title">Ce que disent nos utilisateurs</h2>
            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div className="testimonial-content">
                    <p className="testimonial-text">"{testimonial.text}"</p>
                    <div className="testimonial-author">
                      <strong>{testimonial.name}</strong>
                      <span>{testimonial.role}</span>
                    </div>
                  </div>
                  <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                </div>
              ))}
            </div>
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
