import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProfilPage.css';

function ProfilPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profil');
  const [user, setUser] = useState({
    nom: 'Ahmed Benali',
    email: 'ahmed.benali@example.com',
    telephone: '+212 6 12 34 56 78',
    avatar: 'https://i.pravatar.cc/150?img=12',
    dateInscription: '2024-01-15',
    annoncesPubliees: 5,
    annoncesFavorites: 12
  });

  const [formData, setFormData] = useState({
    nom: user.nom,
    email: user.email,
    telephone: user.telephone,
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmerMotDePasse: ''
  });

  const [loading, setLoading] = useState(false);
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => {
    // TODO: Charger les données réelles depuis l'API
    // Simuler le chargement des annonces
    setAnnonces([
      {
        id: 1,
        titre: 'Chambre moderne près de l\'université',
        zone: 'Universiapolis',
        prix: 1500,
        type: 'chambre',
        statut: 'active',
        vues: 245,
        contacts: 12
      },
      {
        id: 2,
        titre: 'Studio indépendant Founty',
        zone: 'Founty',
        prix: 2500,
        type: 'studio',
        statut: 'active',
        vues: 189,
        contacts: 8
      }
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfil = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Appel API pour mettre à jour le profil
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (formData.nouveauMotDePasse !== formData.confirmerMotDePasse) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Appel API pour changer le mot de passe
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Mot de passe modifié avec succès !');
      setFormData(prev => ({
        ...prev,
        ancienMotDePasse: '',
        nouveauMotDePasse: '',
        confirmerMotDePasse: ''
      }));
    } catch (error) {
      alert('Erreur lors de la modification du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profil-wrapper">
      <Navbar />
      <main className="profil-page">
        <div className="container">
          <div className="profil-header">
            <div className="avatar-section">
              <div className="avatar-container">
                <img src={user.avatar} alt={user.nom} className="avatar" />
                <label className="avatar-edit">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </label>
              </div>
              <h1>{user.nom}</h1>
              <p className="user-email">{user.email}</p>
              <p className="user-stats">
                Membre depuis {new Date(user.dateInscription).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-value">{user.annoncesPubliees}</div>
                <div className="stat-label">Annonces publiées</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❤️</div>
                <div className="stat-value">{user.annoncesFavorites}</div>
                <div className="stat-label">Favoris</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👁️</div>
                <div className="stat-value">{annonces.reduce((sum, a) => sum + a.vues, 0)}</div>
                <div className="stat-label">Vues totales</div>
              </div>
            </div>
          </div>

          <div className="profil-tabs">
            <button
              className={`tab-button ${activeTab === 'profil' ? 'active' : ''}`}
              onClick={() => setActiveTab('profil')}
            >
              Mon profil
            </button>
            <button
              className={`tab-button ${activeTab === 'annonces' ? 'active' : ''}`}
              onClick={() => setActiveTab('annonces')}
            >
              Mes annonces
            </button>
            <button
              className={`tab-button ${activeTab === 'securite' ? 'active' : ''}`}
              onClick={() => setActiveTab('securite')}
            >
              Sécurité
            </button>
          </div>

          <div className="profil-content">
            {activeTab === 'profil' && (
              <div className="tab-content">
                <h2>Informations personnelles</h2>
                <form onSubmit={handleUpdateProfil} className="profil-form">
                  <div className="form-group">
                    <label htmlFor="nom">Nom complet</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="telephone">Téléphone</label>
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'annonces' && (
              <div className="tab-content">
                <div className="annonces-header">
                  <h2>Mes annonces</h2>
                  <button
                    className="btn-primary"
                    onClick={() => navigate('/ajouter-annonce')}
                  >
                    + Publier une annonce
                  </button>
                </div>

                {annonces.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>Aucune annonce publiée</h3>
                    <p>Commencez par publier votre première annonce</p>
                    <button
                      className="btn-primary"
                      onClick={() => navigate('/ajouter-annonce')}
                    >
                      Publier une annonce
                    </button>
                  </div>
                ) : (
                  <div className="annonces-list">
                    {annonces.map(annonce => (
                      <div key={annonce.id} className="annonce-item">
                        <div className="annonce-info">
                          <h3>{annonce.titre}</h3>
                          <p className="annonce-location">📍 {annonce.zone}</p>
                          <div className="annonce-meta">
                            <span className="annonce-prix">{annonce.prix} MAD/mois</span>
                            <span className="annonce-type">{annonce.type}</span>
                            <span className={`annonce-statut ${annonce.statut}`}>
                              {annonce.statut === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="annonce-stats">
                            <span>👁️ {annonce.vues} vues</span>
                            <span>💬 {annonce.contacts} contacts</span>
                          </div>
                        </div>
                        <div className="annonce-actions">
                          <button
                            className="btn-secondary"
                            onClick={() => navigate(`/annonce/${annonce.id}`)}
                          >
                            Voir
                          </button>
                          <button className="btn-secondary">Modifier</button>
                          <button className="btn-danger">Supprimer</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'securite' && (
              <div className="tab-content">
                <h2>Changer le mot de passe</h2>
                <form onSubmit={handleUpdatePassword} className="profil-form">
                  <div className="form-group">
                    <label htmlFor="ancienMotDePasse">Ancien mot de passe</label>
                    <input
                      type="password"
                      id="ancienMotDePasse"
                      name="ancienMotDePasse"
                      value={formData.ancienMotDePasse}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="nouveauMotDePasse">Nouveau mot de passe</label>
                    <input
                      type="password"
                      id="nouveauMotDePasse"
                      name="nouveauMotDePasse"
                      value={formData.nouveauMotDePasse}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmerMotDePasse">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      id="confirmerMotDePasse"
                      name="confirmerMotDePasse"
                      value={formData.confirmerMotDePasse}
                      onChange={handleInputChange}
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Modification...' : 'Modifier le mot de passe'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProfilPage;
