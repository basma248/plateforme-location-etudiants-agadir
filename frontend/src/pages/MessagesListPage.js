import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getConversations } from '../services/messageService';
import { getToken } from '../services/authService';
import './MessagesListPage.css';

function MessagesListPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const data = await getConversations(token);
        setConversations(data);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        // En cas d'erreur, laisser la liste vide
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [navigate]);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
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
            <h1>Mes messages</h1>
            <p>Toutes vos conversations avec les propriétaires</p>
          </div>

          {conversations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h2>Aucune conversation</h2>
              <p>Vous n'avez pas encore de messages. Contactez un propriétaire pour commencer une conversation.</p>
              <Link to="/home" className="btn-primary">
                Voir les annonces
              </Link>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${conversation.nonLu > 0 ? 'has-unread' : ''}`}
                  onClick={() => navigate(`/message/${conversation.annonceId}`)}
                >
                  <div className="conversation-annonce-image">
                    <img
                      src={conversation.annonce.image}
                      alt={conversation.annonce.titre}
                    />
                  </div>
                  
                  <div className="conversation-content">
                    <div className="conversation-header">
                      <div className="conversation-proprietaire">
                        <img
                          src={conversation.proprietaire.avatar}
                          alt={conversation.proprietaire.nom}
                          className="proprietaire-avatar-small"
                        />
                        <div>
                          <h3>{conversation.proprietaire.nom}</h3>
                          <p className="annonce-titre">{conversation.annonce.titre}</p>
                        </div>
                      </div>
                      <div className="conversation-meta">
                        <span className="conversation-time">
                          {formatTime(conversation.dernierMessage.timestamp)}
                        </span>
                        {conversation.nonLu > 0 && (
                          <span className="unread-badge">{conversation.nonLu}</span>
                        )}
                      </div>
                    </div>
                    
                    <p className="conversation-last-message">
                      {conversation.dernierMessage.sender === 'moi' && (
                        <span className="message-prefix">Vous : </span>
                      )}
                      {conversation.dernierMessage.content}
                    </p>
                    
                    <div className="conversation-annonce-info">
                      <span className="annonce-zone">📍 {conversation.annonce.zone}</span>
                      <span className="annonce-prix">{conversation.annonce.prix} MAD/mois</span>
                    </div>
                  </div>
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

export default MessagesListPage;


