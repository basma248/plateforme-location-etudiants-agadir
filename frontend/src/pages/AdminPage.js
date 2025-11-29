import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { isAdmin } from '../services/authService';
import {
  getDashboardStats,
  getAllAnnonces,
  getAllUsers,
  moderateAnnonce,
  deleteAnnonceAdmin,
  createUser,
  deleteUser,
  toggleUserStatus
} from '../services/adminService';
import './AdminPage.css';

function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  
  // États pour les modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showModerateModal, setShowModerateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [moderateAction, setModerateAction] = useState('');
  const [moderateReason, setModerateReason] = useState('');
  
  // Formulaire nouveau utilisateur
  const [newUser, setNewUser] = useState({
    nom: '',
    email: '',
    password: '',
    telephone: '',
    role: 'user'
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    if (!isAdmin()) {
      navigate('/home');
      return;
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      console.log('Chargement des données admin...');
      const [statsData, annoncesData, usersData] = await Promise.all([
        getDashboardStats(),
        getAllAnnonces(),
        getAllUsers()
      ]);
      
      console.log('Stats reçues:', statsData);
      console.log('Annonces reçues (type):', typeof annoncesData, Array.isArray(annoncesData));
      console.log('Annonces reçues (contenu):', annoncesData);
      console.log('Users reçus (type):', typeof usersData, Array.isArray(usersData));
      console.log('Users reçus (contenu):', usersData);
      
      setStats(statsData);
      // S'assurer que les données sont des tableaux
      const annoncesArray = Array.isArray(annoncesData) ? annoncesData : (annoncesData?.data?.data || annoncesData?.data || []);
      const usersArray = Array.isArray(usersData) ? usersData : (usersData?.data?.data || usersData?.data || []);
      
      console.log('Annonces finales:', annoncesArray);
      console.log('Users finaux:', usersArray);
      
      setAnnonces(annoncesArray);
      setUsers(usersArray);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      alert('Erreur lors du chargement des données: ' + error.message);
      // Initialiser avec des tableaux vides en cas d'erreur
      setAnnonces([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async () => {
    if (!selectedItem || !moderateAction) return;
    
    setLoadingAction(true);
    try {
      await moderateAnnonce(selectedItem.id, moderateAction, moderateReason);
      await loadDashboardData();
      setShowModerateModal(false);
      setSelectedItem(null);
      setModerateAction('');
      setModerateReason('');
      alert('Action effectuée avec succès');
    } catch (error) {
      alert('Erreur lors de la modération: ' + error.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteAnnonce = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.')) return;
    
    setLoadingAction(true);
    try {
      console.log('Suppression de l\'annonce ID:', id);
      await deleteAnnonceAdmin(id);
      // Recharger les données
      await loadDashboardData();
      alert('Annonce supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible et supprimera toutes ses annonces.')) return;
    
    setLoadingAction(true);
    try {
      console.log('Suppression de l\'utilisateur ID:', id);
      await deleteUser(id);
      // Recharger les données
      await loadDashboardData();
      alert('Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setLoadingAction(false);
    }
  };


  const handleToggleUserStatus = async (id, currentStatus) => {
    setLoadingAction(true);
    try {
      await toggleUserStatus(id, !currentStatus);
      await loadDashboardData();
      alert(`Utilisateur ${!currentStatus ? 'suspendu' : 'réactivé'} avec succès`);
    } catch (error) {
      alert('Erreur lors de la modification: ' + error.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      await createUser(newUser);
      await loadDashboardData();
      setShowAddUserModal(false);
      setNewUser({ nom: '', email: '', password: '', telephone: '', role: 'user' });
      alert('Utilisateur créé avec succès');
    } catch (error) {
      alert('Erreur lors de la création: ' + error.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const openModerateModal = (item, action) => {
    setSelectedItem(item);
    setModerateAction(action);
    setShowModerateModal(true);
  };

  if (loading && !stats) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="admin-loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-header">
            <h1>🔐 Administration</h1>
            <p>Gestion de la plateforme de location étudiante</p>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            <button
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button
              className={activeTab === 'annonces' ? 'active' : ''}
              onClick={() => setActiveTab('annonces')}
            >
              🏠 Annonces ({annonces.length})
            </button>
            <button
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => setActiveTab('users')}
            >
              👥 Utilisateurs ({users.length})
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="admin-dashboard">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🏠</div>
                  <div className="stat-content">
                    <h3>{stats?.totalAnnonces || 0}</h3>
                    <p>Annonces totales</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <h3>{stats?.totalUsers || 0}</h3>
                    <p>Utilisateurs</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💬</div>
                  <div className="stat-content">
                    <h3>{stats?.totalMessages || 0}</h3>
                    <p>Messages</p>
                  </div>
                </div>
                <div className="stat-card warning">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-content">
                    <h3>{stats?.annoncesEnAttente || 0}</h3>
                    <p>En attente</p>
                  </div>
                </div>
                <div className="stat-card danger">
                  <div className="stat-icon">⚠️</div>
                  <div className="stat-content">
                    <h3>{stats?.annoncesSignalees || 0}</h3>
                    <p>Annonces signalées</p>
                  </div>
                </div>
                <div className="stat-card warning">
                  <div className="stat-icon">⏸️</div>
                  <div className="stat-content">
                    <h3>{stats?.usersSuspendus || 0}</h3>
                    <p>Utilisateurs suspendus</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-sections">
                <div className="dashboard-section">
                  <h2>Annonces récentes</h2>
                  <div className="recent-list">
                    {annonces.slice(0, 5).map(annonce => (
                      <div key={annonce.id} className="recent-item">
                        <div>
                          <strong>{annonce.titre}</strong>
                          <p>{annonce.zone} - {annonce.prix} DH</p>
                        </div>
                        <button
                          className="btn-small"
                          onClick={() => {
                            setActiveTab('annonces');
                            document.getElementById(`annonce-${annonce.id}`)?.scrollIntoView();
                          }}
                        >
                          Voir
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-section">
                  <h2>Utilisateurs récents</h2>
                  <div className="recent-list">
                    {users.slice(0, 5).map(user => (
                      <div key={user.id} className="recent-item">
                        <div>
                          <strong>{user.nom || user.email}</strong>
                          <p>{user.email}</p>
                        </div>
                        <button
                          className="btn-small"
                          onClick={() => {
                            setActiveTab('users');
                            document.getElementById(`user-${user.id}`)?.scrollIntoView();
                          }}
                        >
                          Voir
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Annonces Tab */}
          {activeTab === 'annonces' && (
            <div className="admin-annonces">
              <div className="section-header">
                <h2>📋 Gestion des annonces</h2>
                <button className="btn-refresh" onClick={loadDashboardData} disabled={loadingAction}>
                  🔄 Actualiser
                </button>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Titre</th>
                      <th>Zone</th>
                      <th>Prix</th>
                      <th>Type</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {annonces.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                          Aucune annonce trouvée
                        </td>
                      </tr>
                    ) : (
                      annonces.map(annonce => (
                        <tr key={annonce.id} id={`annonce-${annonce.id}`}>
                          <td>{annonce.id}</td>
                          <td>
                            <strong>{annonce.titre || 'Sans titre'}</strong>
                            {annonce.description && (
                              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                {annonce.description.substring(0, 50)}...
                              </div>
                            )}
                          </td>
                          <td>{annonce.zone || 'N/A'}</td>
                          <td>{annonce.prix ? `${annonce.prix} DH` : 'N/A'}</td>
                          <td>
                            <span className="badge">{annonce.type || 'N/A'}</span>
                          </td>
                          <td>
                            <span className={`badge ${annonce.statut === 'approuve' ? 'success' : annonce.statut === 'en_attente' ? 'warning' : annonce.statut === 'rejete' ? 'danger' : 'info'}`}>
                              {annonce.statut === 'approuve' ? 'Approuvée' : 
                               annonce.statut === 'en_attente' ? 'En attente' : 
                               annonce.statut === 'rejete' ? 'Rejetée' : 
                               annonce.statut || 'Approuvée'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              {annonce.statut !== 'approuve' && (
                                <button
                                  className="btn-action btn-success"
                                  onClick={() => openModerateModal(annonce, 'approuver')}
                                  disabled={loadingAction}
                                >
                                  ✓ Approuver
                                </button>
                              )}
                              {annonce.statut !== 'rejete' && (
                                <button
                                  className="btn-action btn-warning"
                                  onClick={() => openModerateModal(annonce, 'rejeter')}
                                  disabled={loadingAction}
                                >
                                  ✗ Rejeter
                                </button>
                              )}
                              <button
                                className="btn-action btn-danger"
                                onClick={() => handleDeleteAnnonce(annonce.id)}
                                disabled={loadingAction}
                              >
                                🗑️ Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="admin-users">
              <div className="section-header">
                <h2>👥 Gestion des utilisateurs</h2>
                <div>
                  <button className="btn-primary" onClick={() => setShowAddUserModal(true)}>
                    ➕ Ajouter un utilisateur
                  </button>
                  <button className="btn-refresh" onClick={loadDashboardData} disabled={loadingAction}>
                    🔄 Actualiser
                  </button>
                </div>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Rôle</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    ) : (
                      users.map(user => (
                        <tr key={user.id} id={`user-${user.id}`}>
                          <td>{user.id}</td>
                          <td>
                            <strong>{user.nom || user.prenom || user.nom_utilisateur || 'N/A'}</strong>
                            {user.prenom && user.nom && <div style={{ fontSize: '12px', color: '#666' }}>{user.prenom} {user.nom}</div>}
                          </td>
                          <td>{user.email}</td>
                          <td>{user.telephone || 'N/A'}</td>
                          <td>
                            <span className={`badge ${user.role === 'admin' || user.role === 'administrator' ? 'danger' : 'info'}`}>
                              {user.role || 'user'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${user.suspended ? 'danger' : 'success'}`}>
                              {user.suspended ? 'Suspendu' : 'Actif'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className={`btn-action ${user.suspended ? 'btn-success' : 'btn-warning'}`}
                                onClick={() => handleToggleUserStatus(user.id, user.suspended)}
                                disabled={loadingAction}
                              >
                                {user.suspended ? '✓ Réactiver' : '⏸️ Suspendre'}
                              </button>
                              {user.role !== 'admin' && user.role !== 'administrator' && (
                                <button
                                  className="btn-action btn-danger"
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={loadingAction}
                                >
                                  🗑️ Supprimer
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Ajouter Utilisateur */}
      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ajouter un utilisateur</h2>
              <button className="modal-close" onClick={() => setShowAddUserModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateUser} className="modal-form">
              <div className="form-group">
                <label>Nom complet *</label>
                <input
                  type="text"
                  required
                  value={newUser.nom}
                  onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Mot de passe *</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  value={newUser.telephone}
                  onChange={(e) => setNewUser({ ...newUser, telephone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Rôle *</label>
                <select
                  required
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddUserModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={loadingAction}>
                  {loadingAction ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modération */}
      {showModerateModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowModerateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Modérer l'annonce</h2>
              <button className="modal-close" onClick={() => setShowModerateModal(false)}>×</button>
            </div>
            <div className="modal-form">
              <p><strong>Annonce:</strong> {selectedItem.titre}</p>
              <div className="form-group">
                <label>Action: {moderateAction}</label>
              </div>
              <div className="form-group">
                <label>Raison (optionnelle)</label>
                <textarea
                  value={moderateReason}
                  onChange={(e) => setModerateReason(e.target.value)}
                  rows="3"
                  placeholder="Expliquez la raison de cette action..."
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModerateModal(false)}>
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleModerate}
                  disabled={loadingAction}
                >
                  {loadingAction ? 'Traitement...' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default AdminPage;
