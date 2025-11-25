import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAnnonceById } from '../services/annonceService';
import './AnnonceDetail.css';

function AnnonceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  // Données d'exemple
  const exampleAnnonces = {
    1: {
      id: 1,
      titre: 'Chambre moderne près de l\'université',
      zone: 'Universiapolis',
      prix: 1500,
      type: 'chambre',
      surface: 15,
      nbChambres: 1,
      meuble: true,
      description: 'Chambre spacieuse et lumineuse dans un appartement partagé. Proche de toutes les commodités et des transports. La chambre est entièrement meublée avec un lit, un bureau, une armoire et une étagère. L\'appartement dispose d\'une cuisine équipée, d\'un salon commun et d\'une salle de bain partagée. Internet haut débit inclus. Proche des universités et des transports en commun.',
      descriptionLongue: 'Cette magnifique chambre se trouve dans un appartement moderne et bien entretenu. Elle est parfaite pour un étudiant cherchant un logement confortable et bien situé. L\'appartement est situé au 3ème étage avec ascenseur. Vous partagerez l\'appartement avec 2 autres étudiants sympas et respectueux. La cuisine est entièrement équipée (réfrigérateur, four, micro-ondes, lave-vaisselle). Le salon commun est spacieux avec TV et canapé. La salle de bain est partagée mais toujours propre. Internet fibre optique inclus dans le loyer. Charges comprises (eau, électricité, internet).',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        'https://images.unsplash.com/photo-1556912172-45b7abe8b7e8?w=800'
      ],
      rating: 4.8,
      nbAvis: 24,
      proprietaire: {
        nom: 'Ahmed Benali',
        email: 'ahmed.benali@example.com',
        telephone: '+212 6 12 34 56 78',
        avatar: 'https://i.pravatar.cc/150?img=12',
        verifie: true
      },
      disponibilite: 'Immédiate',
      adresse: 'Rue Mohammed V, Universiapolis, Agadir',
      equipements: ['Wi-Fi', 'Chauffage', 'Lave-linge', 'Parking', 'Ascenseur'],
      regles: ['Non-fumeur', 'Animaux non autorisés', 'Pas de fêtes']
    }
  };

  useEffect(() => {
    const loadAnnonce = async () => {
      setLoading(true);
      try {
        const data = await getAnnonceById(id);
        setAnnonce(data);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'annonce:', error);
        // En cas d'erreur, utiliser les données d'exemple
        setAnnonce(exampleAnnonces[id] || exampleAnnonces[1]);
      } finally {
        setLoading(false);
      }
    };

    loadAnnonce();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTypeLabel = (type) => {
    const types = {
      chambre: 'Chambre',
      studio: 'Studio',
      appartement: 'Appartement',
      colocation: 'Colocation'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="annonce-detail-wrapper">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de l'annonce...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="annonce-detail-wrapper">
        <Navbar />
        <div className="error-container">
          <h2>Annonce introuvable</h2>
          <p>Cette annonce n'existe pas ou a été supprimée.</p>
          <Link to="/home" className="btn-back">Retour à l'accueil</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="annonce-detail-wrapper">
      <Navbar />
      <main className="annonce-detail">
        <div className="container">
          <button onClick={() => navigate(-1)} className="btn-back-link">
            ← Retour
          </button>

          <div className="annonce-detail__header">
            <div>
              <h1 className="annonce-detail__title">{annonce.titre}</h1>
              <div className="annonce-detail__meta">
                <span className="annonce-detail__location">📍 {annonce.adresse || annonce.zone}</span>
                {annonce.rating && (
                  <div className="annonce-detail__rating">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF385C">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{annonce.rating.toFixed(1)}</span>
                    {annonce.nbAvis && <span className="nb-avis">({annonce.nbAvis} avis)</span>}
                  </div>
                )}
              </div>
            </div>
            <div className="annonce-detail__price">
              <span className="price-amount">{formatPrice(annonce.prix)}</span>
              <span className="price-period">/mois</span>
            </div>
          </div>

          {/* Galerie d'images */}
          <div className="annonce-detail__gallery">
            <div className="gallery-main">
              {annonce.images && annonce.images[currentImageIndex] ? (
                <img
                  src={annonce.images[currentImageIndex]}
                  alt={annonce.titre}
                  className="gallery-main-image"
                />
              ) : (
                <div className="gallery-placeholder">
                  <span>🏠</span>
                </div>
              )}
            </div>
            {annonce.images && annonce.images.length > 1 && (
              <div className="gallery-thumbnails">
                {annonce.images.map((img, index) => (
                  <button
                    key={index}
                    className={`gallery-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={img} alt={`${annonce.titre} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="annonce-detail__content">
            <div className="annonce-detail__main">
              {/* Description */}
              <section className="detail-section">
                <h2>Description</h2>
                <p className="description-text">{annonce.descriptionLongue || annonce.description}</p>
              </section>

              {/* Caractéristiques */}
              <section className="detail-section">
                <h2>Caractéristiques</h2>
                <div className="features-grid">
                  <div className="feature-item">
                    <span className="feature-icon">📐</span>
                    <div>
                      <div className="feature-label">Surface</div>
                      <div className="feature-value">{annonce.surface} m²</div>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🛏️</span>
                    <div>
                      <div className="feature-label">Chambres</div>
                      <div className="feature-value">{annonce.nbChambres}</div>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🏷️</span>
                    <div>
                      <div className="feature-label">Type</div>
                      <div className="feature-value">{getTypeLabel(annonce.type)}</div>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <div>
                      <div className="feature-label">Meublé</div>
                      <div className="feature-value">{annonce.meuble ? 'Oui' : 'Non'}</div>
                    </div>
                  </div>
                  {annonce.disponibilite && (
                    <div className="feature-item">
                      <span className="feature-icon">📅</span>
                      <div>
                        <div className="feature-label">Disponibilité</div>
                        <div className="feature-value">{annonce.disponibilite}</div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Équipements */}
              {annonce.equipements && annonce.equipements.length > 0 && (
                <section className="detail-section">
                  <h2>Équipements</h2>
                  <div className="equipements-list">
                    {annonce.equipements.map((eq, index) => (
                      <div key={index} className="equipement-item">
                        <span className="equipement-check">✓</span>
                        {eq}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Règles */}
              {annonce.regles && annonce.regles.length > 0 && (
                <section className="detail-section">
                  <h2>Règles de la maison</h2>
                  <div className="regles-list">
                    {annonce.regles.map((regle, index) => (
                      <div key={index} className="regle-item">
                        {regle}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar avec contact */}
            <aside className="annonce-detail__sidebar">
              <div className="contact-card">
                <div className="contact-card__header">
                  <div className="proprietaire-info">
                    <img
                      src={annonce.proprietaire?.avatar || 'https://i.pravatar.cc/150'}
                      alt={annonce.proprietaire?.nom}
                      className="proprietaire-avatar"
                    />
                    <div>
                      <div className="proprietaire-nom">
                        {annonce.proprietaire?.nom}
                        {annonce.proprietaire?.verifie && (
                          <span className="verifie-badge" title="Propriétaire vérifié">✓</span>
                        )}
                      </div>
                      <div className="proprietaire-role">Propriétaire</div>
                    </div>
                  </div>
                </div>

                <div className="contact-card__price">
                  <span className="price-large">{formatPrice(annonce.prix)}</span>
                  <span className="price-small">/mois</span>
                </div>

                <div className="contact-card__actions">
                  <Link
                    to={`/message/${annonce.id}`}
                    className="btn-contact"
                  >
                    💬 Envoyer un message privé
                  </Link>
                  <button
                    className="btn-message"
                    onClick={() => setShowContactModal(true)}
                  >
                    📞 Voir les coordonnées
                  </button>
                </div>

                {annonce.proprietaire?.telephone && (
                  <div className="contact-info">
                    <div className="contact-item">
                      <span className="contact-icon">📞</span>
                      <a href={`tel:${annonce.proprietaire.telephone}`}>
                        {annonce.proprietaire.telephone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Modal de contact */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowContactModal(false)}>×</button>
            <h2>Contacter le propriétaire</h2>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="contact-name">Votre nom</label>
                <input type="text" id="contact-name" required />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Votre email</label>
                <input type="email" id="contact-email" required />
              </div>
              <div className="form-group">
                <label htmlFor="contact-phone">Votre téléphone</label>
                <input type="tel" id="contact-phone" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  rows="5"
                  placeholder="Bonjour, je suis intéressé(e) par votre annonce..."
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowContactModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default AnnonceDetail;

