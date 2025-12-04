import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatModal from '../components/ChatModal/ChatModal';
import { getAnnonceById } from '../services/annonceService';
import { isAuthenticated } from '../services/authService';
import './AnnonceDetail.css';

// Icônes SVG React
const IconArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M19 12H5M12 19l-7-7 7-7"></path>
  </svg>
);

const IconMapPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const IconHome = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconRuler = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21.3 8.7l-5.6-5.6c-.4-.4-1-.4-1.4 0L2.7 15.1c-.4.4-.4 1 0 1.4l5.6 5.6c.4.4 1 .4 1.4 0l11.6-11.6c.4-.4.4-1 0-1.4z"></path>
    <line x1="7" y1="17" x2="7.01" y2="17"></line>
  </svg>
);

const IconBed = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 4v16M2 8h18M2 12h18M6 8v8"></path>
  </svg>
);

const IconTag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconMessageCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconCheckCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
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

function AnnonceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showChatModal, setShowChatModal] = useState(false);

  // Les données d'exemple ont été supprimées - on utilise uniquement les données du backend

  useEffect(() => {
    let reloadTimer = null;
    
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
        console.log('📋 Description:', data?.description);
        console.log('📋 Description longue (camelCase):', data?.descriptionLongue);
        console.log('📋 Description longue (snake_case):', data?.description_longue);
        
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
            avatar: (() => {
              // Utiliser l'avatar du propriétaire si disponible, sinon celui de user
              let avatarUrl = data.proprietaire?.avatar || data.user.avatar || data.user.profile_image || null;
              // Si l'avatar est une URL relative, le convertir en URL absolue
              if (avatarUrl && !avatarUrl.startsWith('http://') && !avatarUrl.startsWith('https://')) {
                const apiBaseUrl = process.env.REACT_APP_API_URL || '/api';
                const baseUrl = apiBaseUrl.replace('/api', '');
                avatarUrl = baseUrl + (avatarUrl.startsWith('/') ? avatarUrl : '/' + avatarUrl);
              }
              return avatarUrl;
            })(),
            verifie: data.proprietaire?.verifie || data.user.email_verifie || false,
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
        
        // Recharger les données après un court délai pour obtenir le nombre de vues mis à jour
        // Le backend incrémente les vues lors de la première requête, on recharge après 1000ms
        reloadTimer = setTimeout(async () => {
          try {
            const updatedData = await getAnnonceById(id);
            if (updatedData && updatedData.id && updatedData.vues !== undefined) {
              setAnnonce(prev => prev ? {
                ...prev,
                vues: updatedData.vues || 0
              } : null);
            }
          } catch (error) {
            console.warn('⚠️ Erreur lors du rechargement des vues:', error);
          }
        }, 1000);
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
      loadAnnonce();
    } else {
      setLoading(false);
      setAnnonce(null);
    }
    
    // Nettoyer le timer si le composant est démonté ou si l'ID change
    return () => {
      if (reloadTimer) {
        clearTimeout(reloadTimer);
      }
    };
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
            <IconArrowLeft />
            <span>Retour</span>
          </button>

          <div className="annonce-detail__header">
            <div>
              <h1 className="annonce-detail__title">{annonce.titre}</h1>
              <div className="annonce-detail__meta">
                <span className="annonce-detail__location">
                  <IconMapPin />
                  <span>{annonce.adresse || annonce.zone}</span>
                </span>
                {annonce.rating && typeof annonce.rating === 'number' && !isNaN(annonce.rating) && (
                  <div className="annonce-detail__rating">
                    <IconStar />
                    <span>{annonce.rating.toFixed(1)}</span>
                    {annonce.nbAvis && <span className="nb-avis">({annonce.nbAvis} avis)</span>}
                  </div>
                )}
                {annonce.vues !== undefined && annonce.vues > 0 && (
                  <div className="annonce-detail__views">
                    <IconEye />
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
                        <IconChevronLeft />
                      </button>
                      <button
                        className="gallery-nav gallery-nav-next"
                        onClick={() => setCurrentImageIndex((prev) => 
                          prev === annonce.images.length - 1 ? 0 : prev + 1
                        )}
                        aria-label="Image suivante"
                      >
                        <IconChevronRight />
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
                  <IconHome />
                  <p>Aucune image disponible</p>
                </div>
              </div>
            )}
          </div>

          <div className="annonce-detail__content">
            <div className="annonce-detail__main">
              {/* Description courte */}
              {annonce.description && (
                <section className="detail-section">
                  <h2>Description</h2>
                  <div className="description-text description-short">
                    {annonce.description}
                  </div>
                </section>
              )}

              {/* Description détaillée */}
              {(annonce.descriptionLongue || annonce.description_longue) && (
                <section className="detail-section">
                  <h2>Description détaillée</h2>
                  <div className="description-text description-long">
                    {annonce.descriptionLongue || annonce.description_longue}
                  </div>
                </section>
              )}

              {/* Caractéristiques */}
              <section className="detail-section">
                <h2>Caractéristiques</h2>
                <div className="features-grid">
                  {annonce.surface && (
                    <div className="feature-item">
                      <div className="feature-icon">
                        <IconRuler />
                      </div>
                      <div>
                        <div className="feature-label">Surface</div>
                        <div className="feature-value">{annonce.surface} m²</div>
                      </div>
                    </div>
                  )}
                  {(annonce.nbChambres || annonce.nb_chambres) && (
                    <div className="feature-item">
                      <div className="feature-icon">
                        <IconBed />
                      </div>
                      <div>
                        <div className="feature-label">Chambres</div>
                        <div className="feature-value">{annonce.nbChambres || annonce.nb_chambres}</div>
                      </div>
                    </div>
                  )}
                  <div className="feature-item">
                    <div className="feature-icon">
                      <IconTag />
                    </div>
                    <div>
                      <div className="feature-label">Type</div>
                      <div className="feature-value">{getTypeLabel(annonce.type)}</div>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <IconCheck />
                    </div>
                    <div>
                      <div className="feature-label">Meublé</div>
                      <div className="feature-value">{annonce.meuble ? 'Oui' : 'Non'}</div>
                    </div>
                  </div>
                  {annonce.disponibilite && (
                    <div className="feature-item">
                      <div className="feature-icon">
                        <IconCalendar />
                      </div>
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
                        <span className="equipement-check">
                          <IconCheck />
                        </span>
                        <span>{eq}</span>
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
                      src={annonce.proprietaire?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(annonce.proprietaire?.nomComplet || annonce.proprietaire?.email || 'U') + '&color=7F9CF5&background=EBF4FF'}
                      alt={annonce.proprietaire?.nomComplet || annonce.proprietaire?.nom || 'Propriétaire'}
                      className="proprietaire-avatar"
                      onError={(e) => {
                        // Si l'image ne charge pas, utiliser l'avatar par défaut
                        e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(annonce.proprietaire?.nomComplet || annonce.proprietaire?.email || 'U') + '&color=7F9CF5&background=EBF4FF';
                      }}
                    />
                    <div>
                      <div className="proprietaire-nom">
                        {annonce.proprietaire?.nomComplet || 
                         `${annonce.proprietaire?.prenom || ''} ${annonce.proprietaire?.nom || ''}`.trim() || 
                         annonce.proprietaire?.email || 
                         'Propriétaire'}
                        {annonce.proprietaire?.verifie && (
                          <span className="verifie-badge" title="Propriétaire vérifié">
                            <IconCheckCircle />
                          </span>
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
                      <IconMessageCircle />
                      <span>Contacter</span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="btn-contact"
                    >
                      <IconLock />
                      <span>Se connecter pour contacter</span>
                    </Link>
                  )}
                </div>

                <div className="contact-info">
                  {annonce.proprietaire?.telephone && (
                    <div className="contact-item">
                      <span className="contact-icon">
                        <IconPhone />
                      </span>
                      <a href={`tel:${annonce.proprietaire.telephone}`}>
                        {annonce.proprietaire.telephone}
                      </a>
                    </div>
                  )}
                  {annonce.proprietaire?.email && (
                    <div className="contact-item">
                      <span className="contact-icon">
                        <IconMail />
                      </span>
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

