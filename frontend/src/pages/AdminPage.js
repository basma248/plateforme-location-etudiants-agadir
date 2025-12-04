import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { isAdmin } from '../services/authService';

// Icônes SVG React
const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconMessage = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconAlert = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const IconPause = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const IconRefresh = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
import {
  getDashboardStats,
  getAllAnnonces,
  getAllUsers,
  moderateAnnonce,
  deleteAnnonceAdmin,
  createUser,
  deleteUser,
  toggleUserStatus,
  getContactMessages,
  markContactMessageAsRead,
  markContactMessageAsTreated,
  deleteContactMessage
} from '../services/adminService';
import './AdminPage.css';

function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [users, setUsers] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [selectedStatCard, setSelectedStatCard] = useState(null);
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
      const [statsData, annoncesData, usersData, messagesData] = await Promise.all([
        getDashboardStats(),
        getAllAnnonces(),
        getAllUsers(),
        getContactMessages().catch(err => {
          console.warn('Erreur lors du chargement des messages de contact:', err);
          return [];
        })
      ]);
      
      console.log('Stats reçues:', statsData);
      console.log('Annonces reçues (type):', typeof annoncesData, Array.isArray(annoncesData));
      console.log('Annonces reçues (contenu):', annoncesData);
      console.log('Users reçus (type):', typeof usersData, Array.isArray(usersData));
      console.log('Users reçus (contenu):', usersData);
      console.log('Messages de contact reçus:', messagesData);
      
      setStats(statsData);
      // S'assurer que les données sont des tableaux
      const annoncesArray = Array.isArray(annoncesData) ? annoncesData : (annoncesData?.data?.data || annoncesData?.data || []);
      const usersArray = Array.isArray(usersData) ? usersData : (usersData?.data?.data || usersData?.data || []);
      const messagesArray = Array.isArray(messagesData) ? messagesData : [];
      
      console.log('Annonces finales:', annoncesArray);
      console.log('Users finaux:', usersArray);
      console.log('Messages finaux:', messagesArray);
      
      setAnnonces(annoncesArray);
      setUsers(usersArray);
      setContactMessages(messagesArray);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      alert('Erreur lors du chargement des données: ' + error.message);
      // Initialiser avec des tableaux vides en cas d'erreur
      setAnnonces([]);
      setUsers([]);
      setContactMessages([]);
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
            <h1>
              <IconLock />
              Administration
            </h1>
            <p>Gestion de la plateforme de location étudiante</p>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            <button
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              <IconDashboard />
              Dashboard
            </button>
            <button
              className={activeTab === 'annonces' ? 'active' : ''}
              onClick={() => setActiveTab('annonces')}
            >
              <IconHome />
              Annonces ({annonces.length})
            </button>
            <button
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => setActiveTab('users')}
            >
              <IconUsers />
              Utilisateurs ({users.length})
            </button>
            <button
              className={activeTab === 'messages' ? 'active' : ''}
              onClick={() => setActiveTab('messages')}
            >
              <IconMail />
              Messages ({contactMessages.length})
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="admin-dashboard">
              <div className="stats-grid">
                <div 
                  className={`stat-card stat-card-primary ${selectedStatCard === 'annonces' ? 'active' : ''}`}
                  onClick={() => setSelectedStatCard(selectedStatCard === 'annonces' ? null : 'annonces')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stat-icon">
                    <IconHome />
                  </div>
                  <div className="stat-content">
                    <h3>{stats?.totalAnnonces || 0}</h3>
                    <p>Annonces totales</p>
                  </div>
                </div>
                <div 
                  className={`stat-card stat-card-secondary ${selectedStatCard === 'users' ? 'active' : ''}`}
                  onClick={() => setSelectedStatCard(selectedStatCard === 'users' ? null : 'users')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stat-icon">
                    <IconUsers />
                  </div>
                  <div className="stat-content">
                    <h3>{stats?.totalUsers || 0}</h3>
                    <p>Utilisateurs</p>
                  </div>
                </div>
                <div 
                  className={`stat-card stat-card-messages ${selectedStatCard === 'messages' ? 'active' : ''}`}
                  onClick={() => setSelectedStatCard(selectedStatCard === 'messages' ? null : 'messages')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stat-icon">
                    <IconMail />
                  </div>
                  <div className="stat-content">
                    <h3>{contactMessages.filter(msg => !msg.lu).length}</h3>
                    <p>Messages non lus</p>
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
                <h2>Gestion des annonces</h2>
                <button className="btn-refresh" onClick={loadDashboardData} disabled={loadingAction}>
                  <IconRefresh />
                  Actualiser
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
                                  <IconCheck />
                                  Approuver
                                </button>
                              )}
                              {annonce.statut !== 'rejete' && (
                                <button
                                  className="btn-action btn-warning"
                                  onClick={() => openModerateModal(annonce, 'rejeter')}
                                  disabled={loadingAction}
                                >
                                  <IconX />
                                  Rejeter
                                </button>
                              )}
                              <button
                                className="btn-action btn-danger"
                                onClick={() => handleDeleteAnnonce(annonce.id)}
                                disabled={loadingAction}
                              >
                                <IconTrash />
                                Supprimer
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
                <h2>
                  <IconUsers />
                  Gestion des utilisateurs
                </h2>
                <div>
                  <button className="btn-primary" onClick={() => setShowAddUserModal(true)}>
                    <IconPlus />
                    Ajouter un utilisateur
                  </button>
                  <button className="btn-refresh" onClick={loadDashboardData} disabled={loadingAction}>
                    <IconRefresh />
                    Actualiser
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
                                {user.suspended ? (
                                  <>
                                    <IconCheck />
                                    Réactiver
                                  </>
                                ) : (
                                  <>
                                    <IconPause />
                                    Suspendre
                                  </>
                                )}
                              </button>
                              {user.role !== 'admin' && user.role !== 'administrator' && (
                                <button
                                  className="btn-action btn-danger"
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={loadingAction}
                                >
                                  <IconTrash />
                                  Supprimer
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

          {/* Messages de Contact Tab */}
          {activeTab === 'messages' && (
            <div className="admin-messages">
              <div className="section-header">
                <h2>
                  <IconMail />
                  Messages de contact
                </h2>
                <button className="btn-refresh" onClick={loadDashboardData} disabled={loadingAction}>
                  <IconRefresh />
                  Actualiser
                </button>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Type</th>
                      <th>Sujet</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactMessages.length === 0 ? (
                      <tr>
                        <td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>
                          Aucun message de contact trouvé
                        </td>
                      </tr>
                    ) : (
                      contactMessages.map(message => (
                        <tr 
                          key={message.id} 
                          id={`message-${message.id}`}
                          style={{ 
                            backgroundColor: !message.lu ? '#fff9e6' : 'transparent',
                            opacity: message.traite ? 0.7 : 1
                          }}
                        >
                          <td>{message.id}</td>
                          <td><strong>{message.nom}</strong></td>
                          <td>{message.email}</td>
                          <td>{message.telephone || 'N/A'}</td>
                          <td>
                            <span className="badge">
                              {message.type === 'question' ? 'Question' :
                               message.type === 'reclamation' ? 'Réclamation' :
                               message.type === 'contrainte' ? 'Contrainte' :
                               message.type === 'suggestion' ? 'Suggestion' :
                               message.type === 'annonce' ? 'Annonce' :
                               message.type === 'technique' ? 'Technique' :
                               message.type || 'Autre'}
                            </span>
                          </td>
                          <td>
                            <strong>{message.sujet}</strong>
                          </td>
                          <td>
                            <div style={{ maxWidth: '300px', fontSize: '12px', color: '#666' }}>
                              {message.message && message.message.length > 100 
                                ? `${message.message.substring(0, 100)}...` 
                                : message.message}
                            </div>
                          </td>
                          <td>
                            {message.created_at 
                              ? new Date(message.created_at).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'N/A'}
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span className={`badge ${message.lu ? 'success' : 'warning'}`}>
                                {message.lu ? (
                                  <>
                                    <IconCheck style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                                    Lu
                                  </>
                                ) : (
                                  '● Non lu'
                                )}
                              </span>
                              {message.traite && (
                                <span className="badge success">
                                  <IconCheck style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                                  Traité
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              {!message.lu && (
                                <button
                                  className="btn-action btn-info"
                                  onClick={async () => {
                                    setLoadingAction(true);
                                    try {
                                      await markContactMessageAsRead(message.id);
                                      // Mettre à jour localement le message comme lu
                                      setContactMessages(prevMessages => 
                                        prevMessages.map(msg => 
                                          msg.id === message.id ? { ...msg, lu: true } : msg
                                        )
                                      );
                                      alert('Message marqué comme lu');
                                    } catch (error) {
                                      alert('Erreur: ' + error.message);
                                    } finally {
                                      setLoadingAction(false);
                                    }
                                  }}
                                  disabled={loadingAction}
                                  title="Marquer comme lu"
                                >
                                  <IconEye />
                                  Lu
                                </button>
                              )}
                              {!message.traite && (
                                <button
                                  className="btn-action btn-success"
                                  onClick={async () => {
                                    setLoadingAction(true);
                                    try {
                                      await markContactMessageAsTreated(message.id);
                                      await loadDashboardData();
                                      alert('Message marqué comme traité');
                                    } catch (error) {
                                      alert('Erreur: ' + error.message);
                                    } finally {
                                      setLoadingAction(false);
                                    }
                                  }}
                                  disabled={loadingAction}
                                  title="Marquer comme traité"
                                >
                                  <IconCheck />
                                  Traité
                                </button>
                              )}
                              <button
                                className="btn-action btn-danger"
                                onClick={async () => {
                                  if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
                                  setLoadingAction(true);
                                  try {
                                    await deleteContactMessage(message.id);
                                    await loadDashboardData();
                                    alert('Message supprimé avec succès');
                                  } catch (error) {
                                    alert('Erreur: ' + error.message);
                                  } finally {
                                    setLoadingAction(false);
                                  }
                                }}
                                disabled={loadingAction}
                                title="Supprimer"
                              >
                                <IconTrash />
                              </button>
                              <button
                                className="btn-action btn-info"
                                onClick={() => {
                                  const fullMessage = `Nom: ${message.nom}\nEmail: ${message.email}\nTéléphone: ${message.telephone || 'N/A'}\nType: ${message.type}\nSujet: ${message.sujet}\n\nMessage:\n${message.message}`;
                                  alert(fullMessage);
                                }}
                                title="Voir le message complet"
                              >
                                <IconEye />
                                Voir
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
