import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toggleFavorite } from '../../services/annonceService';
import { getToken, isAuthenticated } from '../../services/authService';
import './CardAnnonce.css';

// Icônes SVG React
const IconLocation = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconRuler = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21.3 8.7l-5.6-5.6c-.4-.4-1-.4-1.4 0L2.7 15.3c-.4.4-.4 1 0 1.4l5.6 5.6c.4.4 1 .4 1.4 0L21.3 10c.4-.3.4-1 0-1.3z"></path>
    <line x1="14.5" y1="9.5" x2="19.5" y2="14.5"></line>
  </svg>
);

const IconBed = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 4v16"></path>
    <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
    <path d="M2 12h18"></path>
    <path d="M6 8V4"></path>
    <path d="M6 12v4"></path>
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconHeart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconHome = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const IconChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

function CardAnnonce({ annonce }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  // Vérifier l'état initial des favoris
  useEffect(() => {
    // Vérifier si l'annonce est dans les favoris de l'utilisateur
    if (isAuthenticated()) {
      // Utiliser is_favorite si disponible, sinon false
      const favoriteState = annonce.is_favorite !== undefined ? annonce.is_favorite : false;
      setIsFavorite(favoriteState);
      console.log(`[CardAnnonce ${annonce.id}] État favori initial:`, favoriteState);
    } else {
      setIsFavorite(false);
    }
  }, [annonce.id, annonce.is_favorite]);

  // Récupérer toutes les images disponibles
  useEffect(() => {
    const allImages = [];
    
    // Essayer de récupérer les images depuis différentes sources
    if (annonce.all_images && Array.isArray(annonce.all_images) && annonce.all_images.length > 0) {
      // Filtrer les URLs valides et s'assurer qu'elles sont complètes
      const validImages = annonce.all_images
        .filter(img => img && typeof img === 'string' && img.trim() !== '')
        .map(img => {
          // Si l'URL ne commence pas par http/https, ajouter le domaine si nécessaire
          if (!img.startsWith('http://') && !img.startsWith('https://')) {
            // Si c'est un chemin relatif /storage/, ajouter le domaine
            if (img.startsWith('/storage/')) {
              return `http://localhost:8000${img}`;
            } else if (img.startsWith('storage/')) {
              return `http://localhost:8000/${img}`;
            }
          }
          return img;
        });
      allImages.push(...validImages);
    } else if (annonce.images && Array.isArray(annonce.images) && annonce.images.length > 0) {
      const validImages = annonce.images
        .filter(img => img && typeof img === 'string' && img.trim() !== '')
        .map(img => {
          if (!img.startsWith('http://') && !img.startsWith('https://')) {
            if (img.startsWith('/storage/')) {
              return `http://localhost:8000${img}`;
            } else if (img.startsWith('storage/')) {
              return `http://localhost:8000/${img}`;
            }
          }
          return img;
        });
      allImages.push(...validImages);
    } else if (annonce.main_image && typeof annonce.main_image === 'string' && annonce.main_image.trim() !== '') {
      let mainImg = annonce.main_image;
      if (!mainImg.startsWith('http://') && !mainImg.startsWith('https://')) {
        if (mainImg.startsWith('/storage/')) {
          mainImg = `http://localhost:8000${mainImg}`;
        } else if (mainImg.startsWith('storage/')) {
          mainImg = `http://localhost:8000/${mainImg}`;
        }
      }
      allImages.push(mainImg);
    }
    
    console.log(`[CardAnnonce ${annonce.id}] Images trouvées:`, {
      all_images: annonce.all_images?.length || 0,
      images: annonce.images?.length || 0,
      main_image: annonce.main_image ? 'présent' : 'absent',
      total_valid: allImages.length,
      urls: allImages
    });
    
    setImages(allImages);
    setCurrentImageIndex(0);
    setImageError(false); // Réinitialiser l'erreur d'image
  }, [annonce]);

  const handleImageError = (e) => {
    console.error(`[CardAnnonce ${annonce.id}] Erreur de chargement d'image:`, {
      src: e.target.src,
      currentIndex: currentImageIndex,
      totalImages: images.length
    });
    
    // Si ce n'est pas la dernière image, essayer la suivante
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setImageError(true);
    }
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const goToImage = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      alert('Vous devez être connecté pour ajouter aux favoris');
      return;
    }

    if (isLoadingFavorite) return;

    setIsLoadingFavorite(true);
    const previousState = isFavorite;
    
    // Optimistic update
    setIsFavorite(!isFavorite);

    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token non disponible');
      }

      console.log(`[CardAnnonce ${annonce.id}] Toggle favorite - État actuel:`, previousState);
      const result = await toggleFavorite(annonce.id, token);
      console.log(`[CardAnnonce ${annonce.id}] Toggle favorite - Résultat:`, result);
      
      // Mettre à jour l'état avec la réponse du serveur
      const newFavoriteState = result.favorited !== undefined ? result.favorited : !previousState;
      setIsFavorite(newFavoriteState);
      
      // Mettre à jour aussi l'objet annonce pour que le changement persiste
      if (annonce) {
        annonce.is_favorite = newFavoriteState;
      }
    } catch (error) {
      console.error('Erreur lors de la modification des favoris:', error);
      // Revenir à l'état précédent en cas d'erreur
      setIsFavorite(previousState);
      alert(error.message || 'Erreur lors de la modification des favoris');
    } finally {
      setIsLoadingFavorite(false);
    }
  };

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

  const formatRating = (rating) => {
    if (rating === null || rating === undefined || rating === '') {
      return null;
    }
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    if (isNaN(numRating) || numRating === 0) {
      return null;
    }
    return numRating.toFixed(1);
  };

  // S'assurer que l'ID est présent
  const annonceId = annonce.id || annonce._id;
  if (!annonceId) {
    console.error('Annonce sans ID:', annonce);
  }

  return (
    <Link to={`/annonce/${annonceId}`} className="card-annonce" onClick={(e) => {
      if (!annonceId) {
        e.preventDefault();
        console.error('Impossible de naviguer: annonce sans ID');
      } else {
        console.log('Navigation vers annonce ID:', annonceId);
      }
    }}>
      <div className="card-annonce__image-wrapper">
        {!imageError && images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={annonce.titre || 'Logement'}
              className="card-annonce__image"
              onError={handleImageError}
            />
            {images.length > 1 && (
              <>
                <button
                  className="card-annonce__nav-btn card-annonce__nav-prev"
                  onClick={prevImage}
                  aria-label="Image précédente"
                >
                  <IconChevronLeft />
                </button>
                <button
                  className="card-annonce__nav-btn card-annonce__nav-next"
                  onClick={nextImage}
                  aria-label="Image suivante"
                >
                  <IconChevronRight />
                </button>
                <div className="card-annonce__image-counter">
                  {currentImageIndex + 1} / {images.length}
                </div>
                <div className="card-annonce__image-dots">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`card-annonce__dot ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={(e) => goToImage(index, e)}
                      aria-label={`Aller à l'image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="card-annonce__image-placeholder">
            <IconHome />
          </div>
        )}
        <button
          className={`card-annonce__favorite ${isFavorite ? 'is-active' : ''}`}
          onClick={handleFavorite}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <IconHeart />
        </button>
        {annonce.type && (
          <div className="card-annonce__badge">
            {getTypeLabel(annonce.type)}
          </div>
        )}
      </div>

      <div className="card-annonce__content">
        <div className="card-annonce__header">
          <h3 className="card-annonce__title">{annonce.titre || 'Sans titre'}</h3>
          <div className="card-annonce__rating">
            {formatRating(annonce.rating) && (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FF385C">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{formatRating(annonce.rating)}</span>
              </>
            )}
          </div>
        </div>

        <p className="card-annonce__location">
          <IconLocation />
          {annonce.zone || annonce.ville || 'Agadir'}
        </p>

        {annonce.description && (
          <p className="card-annonce__description">
            {annonce.description.length > 100
              ? `${annonce.description.substring(0, 100)}...`
              : annonce.description}
          </p>
        )}

        <div className="card-annonce__features">
          {annonce.surface && (
            <span className="card-annonce__feature">
              <IconRuler />
              {annonce.surface}m²
            </span>
          )}
          {(annonce.nbChambres || annonce.nb_chambres) && (
            <span className="card-annonce__feature">
              <IconBed />
              {annonce.nbChambres || annonce.nb_chambres} chambre{(annonce.nbChambres || annonce.nb_chambres) > 1 ? 's' : ''}
            </span>
          )}
          {annonce.meuble && (
            <span className="card-annonce__feature">
              <IconCheck />
              Meublé
            </span>
          )}
        </div>

        <div className="card-annonce__footer">
          <div className="card-annonce__price">
            <span className="card-annonce__price-amount">
              {formatPrice(annonce.prix || annonce.budget || 0)}
            </span>
            <span className="card-annonce__price-period">/mois</span>
          </div>
          <button
            className="card-annonce__contact-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Rediriger vers la page de détail de l'annonce où l'utilisateur pourra ouvrir le chat
              navigate(`/annonce/${annonce.id}`);
            }}
          >
            Contacter
          </button>
        </div>
      </div>
    </Link>
  );
}

export default CardAnnonce;



