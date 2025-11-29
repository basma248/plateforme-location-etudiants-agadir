import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatModal from '../components/ChatModal/ChatModal';
import { getAnnonceById } from '../services/annonceService';
import { isAuthenticated } from '../services/authService';
import './AnnonceDetail.css';

function AnnonceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // Les données d'exemple ont été supprimées - on utilise uniquement les données du backend

  useEffect(() => {
    const loadAnnonce = async () => {
      setLoading(true);
      try {
        console.log('🔄 Chargement de l\'annonce ID:', id);
        console.log('📡 Appel API en cours...');
        
        const data = await getAnnonceById(id);
        
        console.log('✅ Données reçues du backend:', data);
        console.log('📋 Type de données:', typeof data);
        console.log('📋 Est un objet:', data && typeof data === 'object');
        console.log('📋 A un ID:', data?.id);
        console.log('📋 A un titre:', data?.titre);
        
        if (!data || !data.id) {
          console.error('❌ Données invalides reçues:', data);
          throw new Error('Aucune donnée valide reçue du serveur');
        }

        // Mapper les données du backend vers le format attendu par le frontend
        // Le backend retourne déjà tout dans le bon format, mais on s'assure que tout est présent
        const mappedAnnonce = {
          id: data.id,
          titre: data.titre || 'Sans titre',
          type: data.type,
          zone: data.zone || '',
          adresse: data.adresse || data.zone || '',
          prix: parseFloat(data.prix) || 0,
          surface: data.surface ? parseFloat(data.surface) : null,
          nbChambres: data.nbChambres || data.nb_chambres || 1,
          nb_chambres: data.nb_chambres || data.nbChambres || 1,
          description: data.description || '',
          descriptionLongue: data.descriptionLongue || data.description_longue || data.description || '',
          description_longue: data.description_longue || data.descriptionLongue || data.description || '',
          meuble: data.meuble || false,
          disponibilite: data.disponibilite || '',
          statut: data.statut || 'approuve',
          rating: data.rating ? (typeof data.rating === 'string' ? parseFloat(data.rating) : parseFloat(data.rating)) : null,
          nbAvis: data.nb_avis || 0,
          vues: data.vues || 0,
          // Images: utiliser all_images ou images (doit être un tableau)
          images: Array.isArray(data.all_images) ? data.all_images : 
                 Array.isArray(data.images) ? data.images : 
                 [],
          all_images: Array.isArray(data.all_images) ? data.all_images : 
                     Array.isArray(data.images) ? data.images : 
                     [],
          main_image: data.main_image || (Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : null),
          // Équipements: utiliser equipements_list ou equipements
          equipements: Array.isArray(data.equipements_list) ? data.equipements_list : 
                      Array.isArray(data.equipements) ? data.equipements : 
                      [],
          equipements_list: Array.isArray(data.equipements_list) ? data.equipements_list : 
                           Array.isArray(data.equipements) ? data.equipements : 
                           [],
          // Règles: utiliser regles_list ou regles
          regles: Array.isArray(data.regles_list) ? data.regles_list : 
                 Array.isArray(data.regles) ? data.regles : 
                 [],
          regles_list: Array.isArray(data.regles_list) ? data.regles_list : 
                      Array.isArray(data.regles) ? data.regles : 
                      [],
          // Propriétaire: utiliser les données du backend
          proprietaire: data.proprietaire || (data.user ? {
            id: data.user.id,
            nom: data.user.nom || '',
            prenom: data.user.prenom || '',
            email: data.user.email || '',
            telephone: data.user.telephone || '',
            avatar: data.user.avatar || data.user.profile_image || null,
            verifie: data.user.email_verifie || false,
            nomComplet: data.proprietaire?.nomComplet || `${data.user.prenom || ''} ${data.user.nom || ''}`.trim() || data.user.email || 'Propriétaire'
          } : null),
          // Formatage
          prix_formatted: data.prix_formatted || `${parseFloat(data.prix) || 0} MAD`,
        };
        
        console.log('✅ Annonce mappée avec succès:', {
          id: mappedAnnonce.id,
          titre: mappedAnnonce.titre,
          images_count: mappedAnnonce.images.length,
          equipements_count: mappedAnnonce.equipements.length,
          regles_count: mappedAnnonce.regles.length,
          has_proprietaire: !!mappedAnnonce.proprietaire,
        });
        console.log('📸 Images:', mappedAnnonce.images);
        console.log('👤 Propriétaire:', mappedAnnonce.proprietaire);
        
        // Vérification finale avant de définir l'état
        if (!mappedAnnonce.id || !mappedAnnonce.titre) {
          console.error('❌ Données invalides après mapping:', mappedAnnonce);
          throw new Error('Données de l\'annonce invalides après traitement');
        }
        
        setAnnonce(mappedAnnonce);
        // Réinitialiser l'index de l'image si nécessaire
        if (mappedAnnonce.images && mappedAnnonce.images.length > 0) {
          setCurrentImageIndex(0);
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement de l\'annonce:', error);
        console.error('📋 Détails de l\'erreur:', error.message);
        console.error('🆔 ID utilisé:', id);
        console.error('📝 Type de l\'ID:', typeof id);
        console.error('📊 Statut HTTP:', error.status);
        console.error('📦 Données d\'erreur:', error.data);
        console.error('🔍 Stack:', error.stack);
        
        // Afficher plus d'informations sur l'erreur
        if (error.status === 404 || error.message.includes('404') || error.message.includes('introuvable')) {
          console.error('⚠️ L\'annonce n\'existe pas ou n\'est pas accessible');
          console.error('💡 Vérifications à faire:');
          console.error('   1. Vérifier que l\'annonce existe dans la base de données');
          console.error('   2. Vérifier que l\'annonce a le statut "approuve"');
          console.error('   3. Tester l\'API directement: http://localhost:8000/api/annonces/' + id);
          console.error('   4. Vérifier les logs Laravel: storage/logs/laravel.log');
        } else if (error.status === 500) {
          console.error('⚠️ Erreur serveur - Vérifier les logs Laravel');
        } else if (error.message.includes('JSON')) {
          console.error('⚠️ Erreur de parsing JSON - Le serveur a peut-être retourné une erreur HTML');
        }
        
        // NE PAS utiliser les données d'exemple - laisser l'état null pour afficher l'erreur
        setAnnonce(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log('ID récupéré depuis useParams:', id);
      loadAnnonce();
    } else {
      console.warn('Aucun ID trouvé dans les paramètres de route');
      setLoading(false);
      setAnnonce(null);
    }
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
        <div className="error-container" style={{ padding: '48px 24px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '16px', color: '#222' }}>Annonce introuvable</h2>
          <p style={{ fontSize: '16px', color: '#717171', marginBottom: '8px' }}>
            Cette annonce n'existe pas ou a été supprimée.
          </p>
          <p style={{ fontSize: '14px', color: '#999', marginBottom: '24px' }}>
            ID recherché: <strong>{id}</strong>
          </p>
          <p style={{ fontSize: '13px', color: '#999', marginBottom: '32px', fontStyle: 'italic' }}>
            Vérifiez la console du navigateur (F12) pour plus de détails sur l'erreur.
          </p>
          <Link 
            to="/home" 
            className="btn-back"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#FF385C',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
          >
            Retour à l'accueil
          </Link>
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
                {annonce.rating && typeof annonce.rating === 'number' && !isNaN(annonce.rating) && (
                  <div className="annonce-detail__rating">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF385C">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{annonce.rating.toFixed(1)}</span>
                    {annonce.nbAvis && <span className="nb-avis">({annonce.nbAvis} avis)</span>}
                  </div>
                )}
                {annonce.vues !== undefined && (
                  <div className="annonce-detail__views" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '16px', color: '#717171' }}>
                    <span>👁️</span>
                    <span>{annonce.vues} {annonce.vues === 1 ? 'vue' : 'vues'}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="annonce-detail__price">
              <span className="price-amount">{formatPrice(annonce.prix)}</span>
              <span className="price-period">/mois</span>
            </div>
          </div>

          {/* Galerie d'images - Carrousel */}
          <div className="annonce-detail__gallery">
            {annonce.images && annonce.images.length > 0 ? (
              <>
                <div className="gallery-main">
                  <img
                    src={annonce.images[currentImageIndex]}
                    alt={annonce.titre}
                    className="gallery-main-image"
                  />
                  {annonce.images.length > 1 && (
                    <>
                      <button
                        className="gallery-nav gallery-nav-prev"
                        onClick={() => setCurrentImageIndex((prev) => 
                          prev === 0 ? annonce.images.length - 1 : prev - 1
                        )}
                        aria-label="Image précédente"
                      >
                        ‹
                      </button>
                      <button
                        className="gallery-nav gallery-nav-next"
                        onClick={() => setCurrentImageIndex((prev) => 
                          prev === annonce.images.length - 1 ? 0 : prev + 1
                        )}
                        aria-label="Image suivante"
                      >
                        ›
                      </button>
                      <div className="gallery-counter">
                        {currentImageIndex + 1} / {annonce.images.length}
                      </div>
                    </>
                  )}
                </div>
                {annonce.images.length > 1 && (
                  <div className="gallery-thumbnails">
                    {annonce.images.map((img, index) => (
                      <button
                        key={index}
                        className={`gallery-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                        onMouseEnter={() => setCurrentImageIndex(index)}
                      >
                        <img src={img} alt={`${annonce.titre} ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="gallery-main">
                <div className="gallery-placeholder">
                  <span>🏠</span>
                  <p>Aucune image disponible</p>
                </div>
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
                  {annonce.surface && (
                    <div className="feature-item">
                      <span className="feature-icon">📐</span>
                      <div>
                        <div className="feature-label">Surface</div>
                        <div className="feature-value">{annonce.surface} m²</div>
                      </div>
                    </div>
                  )}
                  {(annonce.nbChambres || annonce.nb_chambres) && (
                    <div className="feature-item">
                      <span className="feature-icon">🛏️</span>
                      <div>
                        <div className="feature-label">Chambres</div>
                        <div className="feature-value">{annonce.nbChambres || annonce.nb_chambres}</div>
                      </div>
                    </div>
                  )}
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
                        {annonce.proprietaire?.nomComplet || 
                         `${annonce.proprietaire?.prenom || ''} ${annonce.proprietaire?.nom || ''}`.trim() || 
                         annonce.proprietaire?.email || 
                         'Propriétaire'}
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
                  {isAuthenticated() ? (
                    <button
                      className="btn-contact"
                      onClick={() => setShowChatModal(true)}
                    >
                      💬 Envoyer un message privé
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="btn-contact"
                    >
                      🔐 Se connecter pour contacter
                    </Link>
                  )}
                  <button
                    className="btn-message"
                    onClick={() => setShowContactModal(true)}
                  >
                    📞 Voir les coordonnées
                  </button>
                </div>

                <div className="contact-info">
                  {annonce.proprietaire?.telephone && (
                    <div className="contact-item">
                      <span className="contact-icon">📞</span>
                      <a href={`tel:${annonce.proprietaire.telephone}`}>
                        {annonce.proprietaire.telephone}
                      </a>
                    </div>
                  )}
                  {annonce.proprietaire?.email && (
                    <div className="contact-item">
                      <span className="contact-icon">✉️</span>
                      <a href={`mailto:${annonce.proprietaire.email}`}>
                        {annonce.proprietaire.email}
                      </a>
                    </div>
                  )}
                </div>
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

      {/* Chat Modal */}
      {showChatModal && annonce && (
        <ChatModal
          annonce={annonce}
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}

export default AnnonceDetail;

