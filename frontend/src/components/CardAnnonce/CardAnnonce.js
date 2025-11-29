import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toggleFavorite } from '../../services/annonceService';
import { getToken, isAuthenticated } from '../../services/authService';
import './CardAnnonce.css';

function CardAnnonce({ annonce }) {
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
                  ‹
                </button>
                <button
                  className="card-annonce__nav-btn card-annonce__nav-next"
                  onClick={nextImage}
                  aria-label="Image suivante"
                >
                  ›
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
            <span className="card-annonce__placeholder-icon">🏠</span>
          </div>
        )}
        <button
          className={`card-annonce__favorite ${isFavorite ? 'is-active' : ''}`}
          onClick={handleFavorite}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={isFavorite ? '#FF385C' : 'none'}
            stroke={isFavorite ? '#FF385C' : 'currentColor'}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
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
          📍 {annonce.zone || annonce.ville || 'Agadir'}
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
              📐 {annonce.surface}m²
            </span>
          )}
          {(annonce.nbChambres || annonce.nb_chambres) && (
            <span className="card-annonce__feature">
              🛏️ {annonce.nbChambres || annonce.nb_chambres} chambre{(annonce.nbChambres || annonce.nb_chambres) > 1 ? 's' : ''}
            </span>
          )}
          {annonce.meuble && (
            <span className="card-annonce__feature">
              ✓ Meublé
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
              // Navigation vers la page de contact sera gérée par le parent
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



