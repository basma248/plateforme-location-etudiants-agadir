import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardAnnonce from '../components/CardAnnonce';
import { getViewedAnnonces, removeViewedAnnonce } from '../services/userService';
import { getToken, isAuthenticated } from '../services/authService';
import './VuesPage.css';

function VuesPage() {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadViewedAnnonces();
  }, [navigate]);

  const loadViewedAnnonces = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('Chargement des annonces vues...');
      const data = await getViewedAnnonces();
      console.log('Annonces vues reçues:', data);
      
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
      console.error('Erreur lors du chargement des annonces vues:', error);
      setError(error.message || 'Erreur lors du chargement des annonces vues');
      setAnnonces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveView = async (annonceId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Voulez-vous vraiment retirer cette annonce de vos vues ?')) {
      return;
    }

    try {
      await removeViewedAnnonce(annonceId);
      // Retirer l'annonce de la liste localement
      setAnnonces(prev => prev.filter(a => a.id !== annonceId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue'));
    }
  };

  if (loading) {
    return (
      <div className="vues-wrapper">
        <Navbar />
        <main className="vues-page">
          <div className="container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Chargement de vos annonces consultées...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="vues-wrapper">
      <Navbar />
      <main className="vues-page">
        <div className="container">
          <div className="page-header">
            <h1>👁️ Annonces consultées</h1>
            <p>Les annonces que vous avez visitées</p>
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={loadViewedAnnonces} className="btn-primary">
                Réessayer
              </button>
            </div>
          )}

          {!error && annonces.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👁️</div>
              <h2>Aucune annonce consultée</h2>
              <p>Vous n'avez pas encore consulté d'annonces.</p>
              <button onClick={() => navigate('/logements')} className="btn-primary">
                Voir les annonces
              </button>
            </div>
          ) : (
            <div className="annonces-grid">
              {annonces.map(annonce => (
                <div key={annonce.id} className="annonce-item-wrapper">
                  <button
                    className="remove-btn"
                    onClick={(e) => handleRemoveView(annonce.id, e)}
                    title="Retirer de mes vues"
                  >
                    ✕
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

export default VuesPage;

