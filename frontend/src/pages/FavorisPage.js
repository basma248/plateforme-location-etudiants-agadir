import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardAnnonce from '../components/CardAnnonce';
import { getFavorites, removeFavorite } from '../services/annonceService';
import { getToken, isAuthenticated } from '../services/authService';
import './FavorisPage.css';

// Icônes SVG React
const IconHeart = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

function FavorisPage() {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadFavorites();
  }, [navigate]);

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('Chargement des favoris...');
      const data = await getFavorites(token);
      console.log('Favoris reçus:', data);
      
      if (data && Array.isArray(data)) {
        setAnnonces(data);
      } else if (data && data.data && Array.isArray(data.data)) {
        // Si c'est paginé
        if (data.data.data && Array.isArray(data.data.data)) {
          setAnnonces(data.data.data);
        } else {
          setAnnonces(data.data);
        }
      } else {
        setAnnonces([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      setError(error.message || 'Erreur lors du chargement des favoris');
      setAnnonces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (annonceId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Voulez-vous vraiment retirer cette annonce de vos favoris ?')) {
      return;
    }

    try {
      const token = getToken();
      await removeFavorite(annonceId, token);
      // Retirer l'annonce de la liste localement
      setAnnonces(prev => prev.filter(a => a.id !== annonceId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue'));
    }
  };

  if (loading) {
    return (
      <div className="favoris-wrapper">
        <Navbar />
        <main className="favoris-page">
          <div className="container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Chargement de vos favoris...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="favoris-wrapper">
      <Navbar />
      <main className="favoris-page">
        <div className="container">
          <div className="page-header">
            <h1>
              <IconHeart />
              Mes favoris
            </h1>
            <p>Vos annonces favorites sauvegardées</p>
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={loadFavorites} className="btn-primary">
                Réessayer
              </button>
            </div>
          )}

          {!error && annonces.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <IconHeart />
              </div>
              <h2>Aucun favori</h2>
              <p>Vous n'avez pas encore ajouté d'annonces à vos favoris.</p>
              <button onClick={() => navigate('/logements')} className="btn-primary">
                <IconHome />
                <span>Voir les annonces</span>
              </button>
            </div>
          ) : (
            <div className="annonces-grid">
              {annonces.map(annonce => (
                <div key={annonce.id} className="annonce-item-wrapper">
                  <button
                    className="remove-btn"
                    onClick={(e) => handleRemoveFavorite(annonce.id, e)}
                    title="Retirer de mes favoris"
                  >
                    <IconX />
                  </button>
                  <CardAnnonce annonce={annonce} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default FavorisPage;

