import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatModal from '../components/ChatModal/ChatModal';
import { getConversations } from '../services/messageService';
import { getAnnonceById } from '../services/annonceService';
import { getToken, getCurrentUser } from '../services/authService';
import './MessagesListPage.css';

// Icônes SVG React
const IconMessageCircle = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const IconMapPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconDollarSign = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

function MessagesListPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await getConversations(token);
      
      // Le backend retourne {success: true, data: [...]}
      const conversationsData = response.success ? response.data : (response.data || response || []);
      
      if (Array.isArray(conversationsData)) {
        // Filtrer et trier les conversations (récent en haut, ancien en bas)
        // Ne pas filtrer trop strictement - accepter les conversations avec annonce même si certaines propriétés sont null
        const validConversations = conversationsData
          .filter(conv => {
            // Accepter la conversation si elle a un ID et au moins un titre d'annonce
            return conv && conv.id && (conv.annonce && (conv.annonce.id || conv.annonce.titre));
          })
          .sort((a, b) => {
            // Priorité 1: Conversations avec messages non lus en premier
            const unreadA = a.unread_count || 0;
            const unreadB = b.unread_count || 0;
            if (unreadA > 0 && unreadB === 0) return -1;
            if (unreadA === 0 && unreadB > 0) return 1;
            
            // Priorité 2: Trier par date du dernier message (récent en premier)
            const dateA = a.last_message?.created_at || a.created_at || '';
            const dateB = b.last_message?.created_at || b.created_at || '';
            if (dateA && dateB) {
              return new Date(dateB) - new Date(dateA);
            }
            if (dateA) return -1;
            if (dateB) return 1;
            
            // Priorité 3: Trier par date de création
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
          });
        setConversations(validConversations);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = async (conversation) => {
    try {
      // Charger les détails de l'annonce
      const annonce = await getAnnonceById(conversation.annonce.id);
      setSelectedAnnonce(annonce);
      setSelectedConversation(conversation);
      setShowChatModal(true);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'annonce:', error);
      alert('Erreur lors du chargement de l\'annonce');
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="messages-list-wrapper">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="messages-list-wrapper">
      <Navbar />
      <main className="messages-list-page">
        <div className="container">
          <div className="page-header">
            <h1>
              <IconMessageCircle />
              Mes conversations
            </h1>
            <p>Toutes vos conversations avec les propriétaires et locataires</p>
          </div>

          {conversations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <IconMessageCircle />
              </div>
              <h2>Aucune conversation</h2>
              <p>Vous n'avez pas encore de messages. Contactez un propriétaire pour commencer une conversation.</p>
              <button onClick={() => navigate('/home')} className="btn-primary">
                <IconHome />
                <span>Voir les annonces</span>
              </button>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map(conversation => {
                const otherUser = conversation.other_user || {};
                const annonce = conversation.annonce || {};
                const lastMessage = conversation.last_message || {};
                const unreadCount = conversation.unread_count || 0;
                const annonceImage = annonce.image || (annonce.images && annonce.images[0]) || 'https://via.placeholder.com/150';

                return (
                  <div
                    key={conversation.id}
                    className={`conversation-item ${unreadCount > 0 ? 'has-unread' : ''}`}
                    onClick={() => handleOpenChat(conversation)}
                  >
                    <div className="conversation-annonce-image">
                      <img
                        src={annonceImage}
                        alt={annonce.titre || 'Annonce'}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                    </div>
                    
                    <div className="conversation-content">
                      <div className="conversation-header">
                        <div className="conversation-user">
                          <img
                            src={otherUser.avatar || 'https://i.pravatar.cc/150'}
                            alt={otherUser.nom || 'Utilisateur'}
                            className="user-avatar-small"
                            onError={(e) => {
                              e.target.src = 'https://i.pravatar.cc/150';
                            }}
                          />
                          <div>
                            <h3>
                              {otherUser.prenom && otherUser.nom 
                                ? `${otherUser.prenom} ${otherUser.nom}`
                                : otherUser.nom || otherUser.prenom || 'Utilisateur'}
                            </h3>
                            <p className="annonce-titre">{annonce.titre || 'Annonce'}</p>
                          </div>
                        </div>
                        <div className="conversation-meta">
                          {lastMessage.created_at && (
                            <span className="conversation-time">
                              {formatTime(lastMessage.created_at)}
                            </span>
                          )}
                          {unreadCount > 0 && (
                            <span className="unread-badge">{unreadCount}</span>
                          )}
                        </div>
                      </div>
                      
                      {lastMessage.content && (
                        <p className="conversation-last-message">
                          {lastMessage.content.length > 100 
                            ? `${lastMessage.content.substring(0, 100)}...`
                            : lastMessage.content}
                        </p>
                      )}
                      
                      <div className="conversation-annonce-info">
                        {annonce.zone && (
                          <span className="annonce-zone">
                            <IconMapPin />
                            <span>{annonce.zone}</span>
                          </span>
                        )}
                        {annonce.prix && (
                          <span className="annonce-prix">
                            <IconDollarSign />
                            <span>{annonce.prix} MAD/mois</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Chat Modal */}
      {showChatModal && selectedAnnonce && (
        <ChatModal
          annonce={selectedAnnonce}
          isOpen={showChatModal}
          onClose={() => {
            // Ne fermer que si l'utilisateur clique explicitement sur fermer
            setShowChatModal(false);
            setSelectedAnnonce(null);
            setSelectedConversation(null);
            // Recharger les conversations après fermeture du chat
            setTimeout(() => {
              loadConversations();
            }, 500);
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default MessagesListPage;
