import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AproposPage.css';

function AproposPage() {
  return (
    <div className="apropos-wrapper">
      <Navbar />
      <main className="apropos-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-wrapper">
              <div className="hero-logo-container">
                <div className="hero-logo-frame">
                  <img 
                    src="/logo.png" 
                    alt="Darna Agadir Logo" 
                    className="hero-logo"
                  />
                  <div className="logo-glow-effect"></div>
                </div>
              </div>
              <div className="hero-badge">
                <span className="badge-icon">ℹ</span>
                <span>À propos de nous</span>
              </div>
              <h1 className="hero-title">
                <span className="title-main">Darna Agadir</span>
              </h1>
              <p className="hero-description">
                La plateforme de référence pour trouver votre logement étudiant idéal à Agadir
              </p>
              <div className="hero-divider"></div>
            </div>
          </div>
        </section>

        {/* Notre Histoire */}
        <section className="story-section">
          <div className="container">
            <div className="story-content">
              <div className="story-image-wrapper">
                <div className="story-image-container">
                  <img 
                    src="/notre-histoire.jpg" 
                    alt="Notre Histoire - Darna Agadir"
                    className="story-image"
                    loading="lazy"
                    onError={(e) => {
                      // Afficher le placeholder si l'image ne charge pas
                      e.target.style.display = 'none';
                      const placeholder = e.target.parentElement.querySelector('.story-image-placeholder');
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="story-image-placeholder">
                    <div className="placeholder-content">
                      <div className="placeholder-icon">🏠</div>
                      <div className="placeholder-text">
                        <h3>Notre Histoire</h3>
                        <p>Darna Agadir</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="image-overlay"></div>
                <div className="image-decoration"></div>
              </div>
              <div className="story-text">
                <span className="section-label">Notre Histoire</span>
                <h2 className="section-title">Une plateforme née d'un besoin réel</h2>
                <div className="story-description-wrapper">
                  <p className="section-description">
                    Darna Agadir a été créé en 2025 pour répondre à un défi majeur auquel font face 
                    les étudiants à Agadir : trouver un logement adapté, sûr et abordable. 
                    En tant qu'anciens étudiants, nous avons vécu les difficultés de la recherche 
                    de logement dans une nouvelle ville.
                  </p>
                  <p className="section-description">
                    Notre mission est de simplifier cette recherche en connectant directement 
                    les étudiants avec des propriétaires de confiance et des colocataires compatibles. 
                    Nous croyons que chaque étudiant mérite un logement de qualité qui favorise 
                    sa réussite académique.
                  </p>
                </div>
                <div className="story-stats">
                  <div className="stat-box">
                    <div className="stat-icon-small">📅</div>
                    <div className="stat-value">2025</div>
                    <div className="stat-label">Année de création</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-icon-small">📍</div>
                    <div className="stat-value">Agadir</div>
                    <div className="stat-label">Notre ville</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notre Mission */}
        <section className="mission-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Notre Mission</span>
              <h2 className="section-title">Ce qui nous anime</h2>
            </div>
            <div className="mission-grid">
              <div className="mission-card">
                <div className="mission-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3>Faciliter l'accès au logement</h3>
                <p>
                  Rendre la recherche de logement simple, rapide et efficace pour tous les étudiants 
                  d'Agadir, qu'ils soient locaux ou venant d'autres villes.
                </p>
              </div>
              <div className="mission-card">
                <div className="mission-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3>Construire une communauté</h3>
                <p>
                  Créer un réseau solidaire d'étudiants et de propriétaires qui partagent 
                  les mêmes valeurs de respect, de confiance et d'entraide.
                </p>
              </div>
              <div className="mission-card">
                <div className="mission-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3>Garantir la sécurité</h3>
                <p>
                  Assurer un environnement sécurisé en vérifiant les annonces, modérant 
                  le contenu et protégeant les données personnelles de nos utilisateurs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Nos Valeurs */}
        <section className="values-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Nos Valeurs</span>
              <h2 className="section-title">Les principes qui nous guident</h2>
            </div>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3>Sécurité</h3>
                <p>
                  Nous vérifions chaque annonce et modérons activement le contenu pour garantir 
                  une expérience sécurisée et fiable pour tous nos utilisateurs.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <h3>Gratuité</h3>
                <p>
                  Notre plateforme est entièrement gratuite pour les étudiants. 
                  Aucun frais caché, aucun abonnement requis. C'est notre engagement.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3>Communauté</h3>
                <p>
                  Nous favorisons une communauté étudiante solidaire où chacun peut trouver 
                  sa place et créer des liens durables avec ses colocataires.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
                <h3>Efficacité</h3>
                <p>
                  Des outils de recherche avancés et des filtres intelligents pour trouver 
                  rapidement le logement qui correspond exactement à vos besoins.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistiques */}
        <section className="stats-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">En Chiffres</span>
              <h2 className="section-title">Notre impact</h2>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="stat-number">500+</div>
                <div className="stat-label">Annonces actives</div>
                <p className="stat-description">Logements disponibles dans toute la ville</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="stat-number">2000+</div>
                <div className="stat-label">Étudiants inscrits</div>
                <p className="stat-description">Membres actifs de notre communauté</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="stat-number">150+</div>
                <div className="stat-label">Logements trouvés</div>
                <p className="stat-description">Étudiants qui ont trouvé leur logement</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction</div>
                <p className="stat-description">Taux de satisfaction de nos utilisateurs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="how-it-works-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Comment ça marche</span>
              <h2 className="section-title">Trouvez votre logement en 4 étapes</h2>
            </div>
            <div className="steps-container">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-image-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80" 
                    alt="Créer un compte"
                    className="step-image"
                  />
                </div>
                <h3>Créez un compte</h3>
                <p>
                  Inscrivez-vous gratuitement en quelques clics. C'est simple, rapide et sécurisé. 
                  Votre compte vous permettra de sauvegarder vos recherches et contacter les propriétaires.
                </p>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-image-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80" 
                    alt="Rechercher"
                    className="step-image"
                  />
                </div>
                <h3>Recherchez</h3>
                <p>
                  Utilisez nos filtres avancés pour trouver le logement qui correspond à vos critères : 
                  zone, prix, type, équipements. Notre moteur de recherche intelligent vous fait gagner du temps.
                </p>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-image-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&q=80" 
                    alt="Contacter"
                    className="step-image"
                  />
                </div>
                <h3>Contactez</h3>
                <p>
                  Contactez directement les propriétaires via notre messagerie privée sécurisée. 
                  Posez vos questions, organisez une visite et négociez en toute confiance.
                </p>
              </div>
              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-image-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80" 
                    alt="Visiter"
                    className="step-image"
                  />
                </div>
                <h3>Visitez et emménagez</h3>
                <p>
                  Organisez une visite et trouvez votre nouveau chez-vous en toute simplicité. 
                  Une fois le logement choisi, vous pouvez emménager sereinement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pourquoi nous choisir */}
        <section className="why-us-section">
          <div className="container">
            <div className="why-us-content">
              <div className="why-us-text">
                <span className="section-label">Pourquoi nous choisir</span>
                <h2 className="section-title">Une plateforme pensée pour vous</h2>
                <div className="benefits-list">
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div className="benefit-content">
                      <h4>100% Gratuit</h4>
                      <p>Aucun frais, aucun abonnement. Tout est gratuit pour les étudiants.</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div className="benefit-content">
                      <h4>Annonces vérifiées</h4>
                      <p>Toutes les annonces sont vérifiées et modérées avant publication.</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div className="benefit-content">
                      <h4>Recherche avancée</h4>
                      <p>Filtres intelligents pour trouver rapidement le logement idéal.</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div className="benefit-content">
                      <h4>Support dédié</h4>
                      <p>Une équipe à votre écoute pour répondre à toutes vos questions.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="why-us-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" 
                  alt="Équipe Darna Agadir"
                  className="why-us-image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-background"></div>
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Prêt à commencer ?</h2>
              <p className="cta-description">
                Rejoignez notre communauté et trouvez votre logement idéal à Agadir
              </p>
              <div className="cta-buttons">
                <Link to="/home" className="cta-button cta-primary">
                  <span>Voir les annonces</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link to="/register" className="cta-button cta-secondary">
                  <span>Créer un compte</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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

export default AproposPage;
