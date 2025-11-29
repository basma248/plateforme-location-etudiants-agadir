import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getProfile, updateProfile, updatePassword, getMyAnnonces, deleteAvatar } from '../services/userService';
import { getToken, getCurrentUser, setCurrentUser } from '../services/authService';
import './ProfilPage.css';

function ProfilPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profil');
  const [user, setUser] = useState({
    nom: '',
    prenom: '',
    nomComplet: '',
    email: '',
    telephone: '',
    avatar: null,
    dateInscription: null,
    annoncesPubliees: 0,
    annoncesFavorites: 0,
    vuesTotales: 0
  });

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmerMotDePasse: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarKey, setAvatarKey] = useState(0); // Pour forcer le rechargement de l'image

  // Charger les données du profil au montage
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('Chargement du profil...');
      const profileData = await getProfile();
      console.log('Données du profil reçues:', profileData);
      
      if (!profileData) {
        throw new Error('Aucune donnée reçue du serveur');
      }

      console.log('=== CHARGEMENT DU PROFIL ===');
      console.log('Avatar reçu du serveur:', profileData.avatar);
      console.log('Toutes les données:', profileData);
      
      setUser(profileData);
      setFormData({
        nom: profileData.nom || '',
        prenom: profileData.prenom || '',
        email: profileData.email || '',
        telephone: profileData.telephone || '',
        ancienMotDePasse: '',
        nouveauMotDePasse: '',
        confirmerMotDePasse: ''
      });
      
      // Toujours définir l'avatar preview avec la valeur du serveur
      if (profileData.avatar) {
        console.log('Définition de avatarPreview avec:', profileData.avatar);
        // S'assurer que l'URL est complète (commence par http:// ou https://)
        let avatarUrl = profileData.avatar;
        if (avatarUrl && !avatarUrl.startsWith('http://') && !avatarUrl.startsWith('https://')) {
          // Si l'URL est relative, la convertir en absolue
          const apiBaseUrl = process.env.REACT_APP_API_URL || '/api';
          const baseUrl = apiBaseUrl.replace('/api', '');
          avatarUrl = baseUrl + (avatarUrl.startsWith('/') ? avatarUrl : '/' + avatarUrl);
        }
        setAvatarPreview(avatarUrl);
        // Réinitialiser avatarKey pour forcer le rechargement
        setAvatarKey(prev => prev + 1);
      } else {
        console.log('Aucun avatar reçu du serveur');
        setAvatarPreview(null);
      }
      
      // Mettre à jour aussi le localStorage avec les données du serveur
      const currentUser = getCurrentUser();
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          ...profileData
        });
        console.log('localStorage mis à jour avec avatar:', profileData.avatar);
      }

      // Charger les annonces de l'utilisateur
      try {
        const annoncesData = await getMyAnnonces();
        console.log('Annonces reçues:', annoncesData);
        setAnnonces(Array.isArray(annoncesData) ? annoncesData : []);
      } catch (annoncesError) {
        console.error('Erreur lors du chargement des annonces:', annoncesError);
        setAnnonces([]); // Continuer même si les annonces ne se chargent pas
      }
    } catch (error) {
      console.error('Erreur complète lors du chargement du profil:', error);
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      console.error('Status:', error.status);
      
      let errorMessage = 'Erreur lors du chargement du profil. ';
      
      if (error.status === 401) {
        errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
        // Rediriger vers la page de connexion
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (error.status === 404) {
        errorMessage = 'Le serveur n\'a pas été trouvé. Vérifiez que le backend est démarré.';
      } else if (error.status === 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        console.error('Erreur 500 - Détails:', error);
      } else if (error.message && error.message.includes('fetch')) {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend Laravel est démarré (php artisan serve).';
      } else if (error.message) {
        errorMessage += error.message;
      } else if (error.status) {
        errorMessage += `Erreur HTTP ${error.status}`;
      } else {
        errorMessage += 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
      }
      
      setError(errorMessage);
      // Ne pas afficher d'alert si c'est une redirection vers login
      if (error.status !== 401) {
        alert(errorMessage + '\n\nVérifiez la console du navigateur (F12) pour plus de détails.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale: 5MB');
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Le fichier doit être une image');
        return;
      }

      setAvatarFile(file);
      
      // Créer une prévisualisation temporaire (blob URL) pour l'affichage immédiat
      // Mais après l'upload, on utilisera l'URL du serveur
      const reader = new FileReader();
      reader.onloadend = () => {
        // Prévisualisation temporaire uniquement
        setAvatarPreview(reader.result);
        console.log('Prévisualisation temporaire créée (blob URL)');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfil = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    console.log('=== DÉBUT handleUpdateProfil ===');
    console.log('avatarFile:', avatarFile);
    console.log('avatarFile type:', avatarFile ? typeof avatarFile : 'NULL');
    console.log('avatarFile instanceof File:', avatarFile instanceof File);
    
    // Vérification critique : s'assurer que avatarFile est bien un File
    if (avatarFile && !(avatarFile instanceof File)) {
      console.error('❌ ERREUR: avatarFile n\'est pas un objet File!');
      console.error('Type réel:', typeof avatarFile);
      console.error('Valeur:', avatarFile);
      alert('Erreur: Le fichier sélectionné n\'est pas valide. Veuillez sélectionner à nouveau la photo.');
      setSaving(false);
      return;
    }
    
    try {
      const profileData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
      };

      console.log('Appel de updateProfile avec:', { profileData, hasAvatarFile: !!avatarFile });
      if (avatarFile) {
        console.log('Détails du fichier à envoyer:');
        console.log('  - Nom:', avatarFile.name);
        console.log('  - Taille:', avatarFile.size, 'bytes');
        console.log('  - Type:', avatarFile.type);
        console.log('  - Dernière modification:', avatarFile.lastModified);
      }
      const updatedProfile = await updateProfile(profileData, avatarFile);
      
      console.log('=== PROFIL MIS À JOUR ===');
      console.log('Avatar reçu dans updatedProfile:', updatedProfile.avatar);
      console.log('Toutes les données:', updatedProfile);
      
      // Si l'avatar a été uploadé, utiliser directement la réponse de updateProfile
      // Sinon, recharger le profil depuis le serveur pour avoir les données les plus récentes
      let freshProfile;
      if (avatarFile && updatedProfile.avatar) {
        console.log('Avatar uploadé, utilisation de la réponse directe');
        freshProfile = updatedProfile;
      } else {
        console.log('Rechargement du profil depuis le serveur...');
        freshProfile = await getProfile();
      }
      console.log('Profil frais reçu:', freshProfile);
      console.log('Avatar dans profil frais:', freshProfile.avatar);
      
      // TOUJOURS mettre à jour l'avatar preview avec la valeur du serveur
      let avatarUrl = null;
      if (freshProfile.avatar) {
        console.log('Mise à jour de avatarPreview avec avatar du serveur:', freshProfile.avatar);
        // Utiliser l'URL du serveur (pas le blob temporaire)
        // S'assurer que l'URL est complète (commence par http:// ou https://)
        avatarUrl = freshProfile.avatar;
        if (avatarUrl && !avatarUrl.startsWith('http://') && !avatarUrl.startsWith('https://')) {
          // Si l'URL est relative, la convertir en absolue
          const apiBaseUrl = process.env.REACT_APP_API_URL || '/api';
          const baseUrl = apiBaseUrl.replace('/api', '');
          avatarUrl = baseUrl + (avatarUrl.startsWith('/') ? avatarUrl : '/' + avatarUrl);
        }
        console.log('Avatar URL formatée:', avatarUrl);
      } else {
        console.log('Aucun avatar dans la réponse du serveur, réinitialisation');
        avatarUrl = null;
      }
      
      // Mettre à jour l'utilisateur dans le state avec les données fraîches (incluant l'avatar formaté)
      const updatedUser = {
        ...freshProfile,
        nomComplet: freshProfile.nomComplet || `${freshProfile.prenom} ${freshProfile.nom}`.trim(),
        avatar: avatarUrl || null
      };
      console.log('Mise à jour du state user avec avatar:', updatedUser.avatar);
      
      // Mettre à jour le state de manière synchrone pour forcer le re-render
      setUser(updatedUser);
      
      // Mettre à jour avatarPreview avec l'URL formatée (sans cache-busting ici, on le fait dans le render)
      setAvatarPreview(avatarUrl);
      
      // Incrémenter avatarKey pour forcer le rechargement de l'image
      setAvatarKey(prev => prev + 1);
      
      // Mettre à jour le localStorage avec l'avatar du serveur
      const currentUser = getCurrentUser();
      if (currentUser) {
        const updatedLocalStorageUser = {
          ...currentUser,
          ...freshProfile,
          avatar: freshProfile.avatar || null
        };
        setCurrentUser(updatedLocalStorageUser);
        console.log('localStorage mis à jour avec avatar du serveur:', updatedLocalStorageUser.avatar);
      }

      // Réinitialiser l'avatar file si uploadé
      if (avatarFile) {
        setAvatarFile(null);
      }

      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert(error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  // Fonction pour supprimer l'avatar
  const handleDeleteAvatar = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) {
      return;
    }

    try {
      console.log('Suppression de l\'avatar...');
      await deleteAvatar();
      
      // Mettre à jour le state
      setUser(prev => ({ ...prev, avatar: null }));
      setAvatarPreview(null);
      
      // Mettre à jour le localStorage
      const currentUser = getCurrentUser();
      if (currentUser) {
        setCurrentUser({ ...currentUser, avatar: null });
      }
      
      console.log('✅ Avatar supprimé avec succès');
      alert('Photo de profil supprimée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'avatar:', error);
      alert(error.message || 'Erreur lors de la suppression de la photo de profil');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (!formData.ancienMotDePasse || !formData.nouveauMotDePasse) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (formData.nouveauMotDePasse.length < 6) {
      alert('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    if (formData.nouveauMotDePasse !== formData.confirmerMotDePasse) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    setSaving(true);
    
    try {
      await updatePassword(formData.ancienMotDePasse, formData.nouveauMotDePasse);
      alert('Mot de passe modifié avec succès !');
      setFormData(prev => ({
        ...prev,
        ancienMotDePasse: '',
        nouveauMotDePasse: '',
        confirmerMotDePasse: ''
      }));
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert(error.message || 'Erreur lors de la modification du mot de passe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profil-wrapper">
        <Navbar />
        <main className="profil-page">
          <div className="container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Chargement du profil...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !user.email) {
    return (
      <div className="profil-wrapper">
        <Navbar />
        <main className="profil-page">
          <div className="container">
            <div className="empty-state">
              <div className="empty-icon">⚠️</div>
              <h2>Erreur de chargement</h2>
              <p>{error}</p>
              <button onClick={loadProfile} className="btn-primary">
                Réessayer
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profil-wrapper">
      <Navbar />
      <main className="profil-page">
        <div className="container">
          <div className="profil-header">
            <div className="avatar-section">
              <div className="avatar-container">
                <img 
                  src={(() => {
                    // Déterminer l'URL de l'avatar à utiliser
                    let avatarSrc = null;
                    
                    // Priorité 1: avatarPreview si c'est une URL serveur (pas un blob)
                    if (avatarPreview && (avatarPreview.startsWith('http://') || avatarPreview.startsWith('https://'))) {
                      avatarSrc = avatarPreview;
                    }
                    // Priorité 2: user.avatar (URL du serveur depuis le state)
                    else if (user.avatar) {
                      avatarSrc = user.avatar;
                    }
                    // Priorité 3: avatarPreview si c'est un blob temporaire (pendant l'upload)
                    else if (avatarPreview) {
                      avatarSrc = avatarPreview;
                    }
                    // Priorité 4: Avatar par défaut généré
                    else {
                      avatarSrc = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.nomComplet || user.email || 'U') + '&color=7F9CF5&background=EBF4FF';
                    }
                    
                    // Ajouter un paramètre de cache-busting si c'est une URL serveur (pour forcer le rechargement)
                    if (avatarSrc && (avatarSrc.startsWith('http://') || avatarSrc.startsWith('https://'))) {
                      const separator = avatarSrc.includes('?') ? '&' : '?';
                      avatarSrc = avatarSrc + separator + 't=' + Date.now();
                    }
                    
                    return avatarSrc;
                  })()}
                  alt={user.nomComplet || user.email} 
                  className="avatar" 
                  key={`avatar-${user.id}-${avatarKey}-${user.avatar || 'default'}`} // Force le rechargement si l'avatar change
                  onError={(e) => {
                    // Si l'image ne charge pas, utiliser l'avatar par défaut
                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.nomComplet || user.email || 'U') + '&color=7F9CF5&background=EBF4FF';
                  }}
                />
                <div className="avatar-actions">
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
                  {user.avatar && (
                    <button
                      className="avatar-delete"
                      onClick={handleDeleteAvatar}
                      title="Supprimer l'avatar"
                      type="button"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <h1>{user.nomComplet || user.nom || user.email || 'Utilisateur'}</h1>
              <p className="user-email">{user.email}</p>
              {user.dateInscription && (
                <p className="user-stats">
                  Membre depuis {new Date(user.dateInscription).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>

            <div className="stats-grid">
              <div 
                className="stat-card stat-card-clickable" 
                onClick={() => setActiveTab('annonces')}
                title="Voir mes annonces"
              >
                <div className="stat-icon">📝</div>
                <div className="stat-value">{user.annoncesPubliees}</div>
                <div className="stat-label">Annonces publiées</div>
              </div>
              <div 
                className="stat-card stat-card-clickable" 
                onClick={() => navigate('/favoris')}
                title="Voir mes favoris"
              >
                <div className="stat-icon">❤️</div>
                <div className="stat-value">{user.annoncesFavorites}</div>
                <div className="stat-label">Favoris</div>
              </div>
              <div 
                className="stat-card stat-card-clickable" 
                onClick={() => navigate('/vues')}
                title="Voir les annonces consultées"
              >
                <div className="stat-icon">👁️</div>
                <div className="stat-value">{user.vuesTotales || annonces.reduce((sum, a) => sum + (a.vues || 0), 0)}</div>
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
                    <label htmlFor="prenom">Prénom</label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="nom">Nom</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
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
                      required
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
                      placeholder="+212 6 12 34 56 78"
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={saving || loading}>
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
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

                  <button type="submit" className="btn-primary" disabled={saving || loading}>
                    {saving ? 'Modification...' : 'Modifier le mot de passe'}
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
