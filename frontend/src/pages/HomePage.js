import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardAnnonce from '../components/CardAnnonce';
import { getAnnonces } from '../services/annonceService';
import { getCurrentUser, isAuthenticated } from '../services/authService';
import './HomePage.css';

// Icônes SVG React
const IconHome = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconUsers = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const IconChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const IconChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const IconStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
  </svg>
);

const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const IconZap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const IconHeart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const IconCheckCircle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default function HomePage() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [filters] = useState({
    type: '',
    zone: '',
    prixMin: '',
    prixMax: '',
    surfaceMin: '',
    nbChambres: '',
    meuble: '',
    disponibilite: ''
  });

  const logementsCarouselRef = useRef(null);
  const colocationCarouselRef = useRef(null);

  // Vérifier l'utilisateur connecté
  useEffect(() => {
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, []);

  // Images du carrousel hero
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

  // Statistiques
  const stats = [
    { number: '500+', label: 'Annonces actives', icon: <IconHome /> },
    { number: '1200+', label: 'Étudiants satisfaits', icon: <IconUsers /> },
    { number: '98%', label: 'Taux de satisfaction', icon: <IconStar /> }
  ];

  // Features
  const features = [
    {
      icon: <IconShield />,
      title: 'Annonces vérifiées',
      description: 'Toutes les annonces sont vérifiées pour garantir votre sécurité'
    },
    {
      icon: <IconZap />,
      title: 'Recherche rapide',
      description: 'Trouvez votre logement idéal en quelques clics'
    },
    {
      icon: <IconHeart />,
      title: '100% Gratuit',
      description: 'Aucun frais caché, service entièrement gratuit pour les étudiants'
    }
  ];

  // Témoignages
  const testimonials = [
    {
      name: 'Ahmed Benali',
      role: 'Étudiant en Informatique',
      text: 'J\'ai trouvé mon logement en 2 jours ! La plateforme est très intuitive et les propriétaires sont sérieux. Je recommande vivement.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=1',
      location: 'Agadir'
    },
    {
      name: 'Fatima Alami',
      role: 'Étudiante en Médecine',
      text: 'Service excellent ! Les annonces sont vérifiées et j\'ai pu trouver une chambre proche de mon université. Très satisfaite de mon expérience.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=2',
      location: 'Agadir'
    },
    {
      name: 'Youssef Moussa',
      role: 'Étudiant en Commerce',
      text: 'La meilleure plateforme pour trouver un logement étudiant à Agadir. Interface moderne, recherche facile et résultats rapides.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=3',
      location: 'Agadir'
    }
  ];

  // Carrousel automatique hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Charger les annonces
  useEffect(() => {
    const loadAnnonces = async () => {
      setLoading(true);
      try {
        const data = await getAnnonces(filters);
        
        if (data && Array.isArray(data)) {
          setAnnonces(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          setAnnonces(data.data);
        } else if (data && typeof data === 'object') {
          const annoncesArray = data.data || data.items || data.results || [];
          setAnnonces(Array.isArray(annoncesArray) ? annoncesArray : []);
        } else {
          setAnnonces([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des annonces:', error);
        setAnnonces([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnnonces();
  }, [filters]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  // Séparer les annonces par type
  const logementsAnnonces = Array.isArray(annonces) ? annonces.filter(annonce => {
    if (!annonce || !annonce.id) return false;
    return annonce.type && ['chambre', 'studio', 'appartement'].includes(annonce.type);
  }).slice(0, 12) : [];

  const colocationAnnonces = Array.isArray(annonces) ? annonces.filter(annonce => {
    if (!annonce || !annonce.id) return false;
    return annonce.type === 'colocation';
  }).slice(0, 12) : [];

  // Fonctions de scroll pour les carrousels
  const scrollLogements = (direction) => {
    if (!logementsCarouselRef.current) return;
    const scrollAmount = 400;
    const currentScroll = logementsCarouselRef.current.scrollLeft;
    const newScroll = direction === 'next' 
      ? Math.min(currentScroll + scrollAmount, logementsCarouselRef.current.scrollWidth - logementsCarouselRef.current.clientWidth)
      : Math.max(currentScroll - scrollAmount, 0);
    logementsCarouselRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
  };

  const scrollColocation = (direction) => {
    if (!colocationCarouselRef.current) return;
    const scrollAmount = 400;
    const currentScroll = colocationCarouselRef.current.scrollLeft;
    const newScroll = direction === 'next' 
      ? Math.min(currentScroll + scrollAmount, colocationCarouselRef.current.scrollWidth - colocationCarouselRef.current.clientWidth)
      : Math.max(currentScroll - scrollAmount, 0);
    colocationCarouselRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
  };

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
              <IconChevronLeft />
            </button>
            <button className="carousel-btn carousel-btn-next" onClick={nextSlide} aria-label="Image suivante">
              <IconChevronRight />
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
          </div>
        </section>

        {/* Section Statistiques */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon-wrapper">
                    {stat.icon}
                  </div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Features */}
        <section className="features-section">
          <div className="container">
            <div className="section-header-modern">
              <h2 className="section-title-modern">Pourquoi choisir Darna Agadir ?</h2>
              <p className="section-subtitle-modern">Une plateforme conçue spécialement pour les étudiants</p>
            </div>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon-wrapper">
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Carrousel des Logements */}
        <section className="annonces-carousel-section logements-section">
          <div className="container">
            <div className="carousel-section-header">
              <div className="carousel-title-wrapper">
                <div className="section-badge">Logements</div>
                <h2 className="carousel-section-title">
                  <IconHome />
                  Logements disponibles
                </h2>
                <p className="carousel-section-subtitle">Chambres, studios et appartements pour étudiants</p>
              </div>
              <Link to="/logements" className="view-all-link">
                Voir tout
                <IconChevronRight />
              </Link>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Chargement des logements...</p>
              </div>
            ) : logementsAnnonces.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏠</div>
                <h3>Aucun logement disponible</h3>
                <p>De nouvelles annonces seront bientôt disponibles.</p>
              </div>
            ) : (
              <div className="carousel-wrapper">
                <button 
                  className="carousel-nav-btn carousel-nav-prev" 
                  onClick={() => scrollLogements('prev')}
                  aria-label="Précédent"
                >
                  <IconChevronLeft />
                </button>
                <div className="logements-carousel-container annonces-carousel" ref={logementsCarouselRef}>
                  {logementsAnnonces.map(annonce => (
                    <CardAnnonce key={annonce.id} annonce={annonce} />
                  ))}
                </div>
                <button 
                  className="carousel-nav-btn carousel-nav-next" 
                  onClick={() => scrollLogements('next')}
                  aria-label="Suivant"
                >
                  <IconChevronRight />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Carrousel des Colocations */}
        <section className="annonces-carousel-section colocation-section">
          <div className="container">
            <div className="carousel-section-header">
              <div className="carousel-title-wrapper">
                <div className="section-badge section-badge-colocation">Colocations</div>
                <h2 className="carousel-section-title">
                  <IconUsers />
                  Colocations
                </h2>
                <p className="carousel-section-subtitle">Trouvez votre colocataire ou proposez votre logement</p>
              </div>
              <Link to="/colocation" className="view-all-link">
                Voir tout
                <IconChevronRight />
              </Link>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Chargement des colocations...</p>
              </div>
            ) : colocationAnnonces.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🤝</div>
                <h3>Aucune colocation disponible</h3>
                <p>De nouvelles annonces de colocation seront bientôt disponibles.</p>
              </div>
            ) : (
              <div className="carousel-wrapper">
                <button 
                  className="carousel-nav-btn carousel-nav-prev" 
                  onClick={() => scrollColocation('prev')}
                  aria-label="Précédent"
                >
                  <IconChevronLeft />
                </button>
                <div className="colocation-carousel-container annonces-carousel" ref={colocationCarouselRef}>
                  {colocationAnnonces.map(annonce => (
                    <CardAnnonce key={annonce.id} annonce={annonce} />
                  ))}
                </div>
                <button 
                  className="carousel-nav-btn carousel-nav-next" 
                  onClick={() => scrollColocation('next')}
                  aria-label="Suivant"
                >
                  <IconChevronRight />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Section Témoignages */}
        <section className="testimonials-section">
          <div className="container">
            <div className="testimonials-header">
              <div className="testimonials-header-content">
                <h2 className="testimonials-title">
                  Ce que disent nos utilisateurs
                </h2>
                <p className="testimonials-subtitle">
                  Des milliers d'étudiants nous font confiance
                </p>
              </div>
              <div className="testimonials-stats">
                <div className="testimonial-stat-item">
                  <div className="stat-icon-testimonial">
                    <IconUsers />
                  </div>
                  <div className="stat-content-testimonial">
                    <div className="stat-number-testimonial">2000+</div>
                    <div className="stat-label-testimonial">Étudiants satisfaits</div>
                  </div>
                </div>
                <div className="testimonial-stat-item">
                  <div className="stat-icon-testimonial">
                    <IconStar />
                  </div>
                  <div className="stat-content-testimonial">
                    <div className="stat-number-testimonial">4.9/5</div>
                    <div className="stat-label-testimonial">Note moyenne</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-card-header">
                    <div className="testimonial-avatar-wrapper">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="testimonial-avatar"
                      />
                      <div className="testimonial-avatar-badge">
                        <IconCheckCircle />
                      </div>
                    </div>
                    <div className="testimonial-header-info">
                      <h3 className="testimonial-name">{testimonial.name}</h3>
                      <p className="testimonial-role">{testimonial.role}</p>
                      <p className="testimonial-location">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="testimonial-stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <IconStar key={i} />
                    ))}
                  </div>
                  <div className="testimonial-quote-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                    </svg>
                  </div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section CTA */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <div className="cta-text-wrapper">
                <div className="cta-badge">Propriétaire</div>
                <h2 className="cta-title">Vous êtes propriétaire ?</h2>
                <p className="cta-description">
                  Publiez votre annonce gratuitement et trouvez des locataires rapidement. 
                  Choisissez le type d'annonce qui vous convient.
                </p>
              </div>
              <div className="cta-buttons-wrapper">
                <Link to="/ajouter-annonce?type=logement" className="cta-button cta-button-logement">
                  <div className="cta-button-icon">
                    <IconHome />
                  </div>
                  <div className="cta-button-content">
                    <span className="cta-button-title">Publier un logement</span>
                    <span className="cta-button-subtitle">Chambre, Studio, Appartement</span>
                  </div>
                  <IconChevronRight />
                </Link>
                <Link to="/ajouter-annonce?type=colocation" className="cta-button cta-button-colocation">
                  <div className="cta-button-icon">
                    <IconUsers />
                  </div>
                  <div className="cta-button-content">
                    <span className="cta-button-title">Publier une colocation</span>
                    <span className="cta-button-subtitle">Trouvez vos colocataires</span>
                  </div>
                  <IconChevronRight />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
