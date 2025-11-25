import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CardAnnonce.css';

function CardAnnonce({ annonce }) {
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: Ajouter la logique pour sauvegarder en favoris
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

  return (
    <Link to={`/annonce/${annonce.id || annonce._id}`} className="card-annonce">
      <div className="card-annonce__image-wrapper">
        {!imageError && annonce.images && annonce.images[0] ? (
          <img
            src={annonce.images[0]}
            alt={annonce.titre || 'Logement'}
            className="card-annonce__image"
            onError={handleImageError}
          />
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
            {annonce.rating && (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FF385C">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{annonce.rating.toFixed(1)}</span>
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
          {annonce.nbChambres && (
            <span className="card-annonce__feature">
              🛏️ {annonce.nbChambres} chambre{annonce.nbChambres > 1 ? 's' : ''}
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



