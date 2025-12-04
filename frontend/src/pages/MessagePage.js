import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMessages, sendMessage } from '../services/messageService';
import { getAnnonceById } from '../services/annonceService';
import { getToken } from '../services/authService';
import './MessagePage.css';

// Icônes SVG React
const IconArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M19 12H5M12 19l-7-7 7-7"></path>
  </svg>
);

const IconMapPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconDollarSign = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const IconMessageCircle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconSend = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const IconLightbulb = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21h6"></path>
    <path d="M12 3a6 6 0 0 0 6 6c0 2.22-1.21 4.16-3 5.2v1.8a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1.8C7.21 13.16 6 11.22 6 9a6 6 0 0 1 6-6z"></path>
  </svg>
);

const IconCheckCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

function MessagePage() {
  const { annonceId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showFirstMessageForm, setShowFirstMessageForm] = useState(false);
  const [firstMessage, setFirstMessage] = useState({
    sujet: '',
    message: '',
    telephone: '',
    dateVisite: ''
  });

  // Données d'exemple
  const exampleAnnonce = {
    id: annonceId || 1,
    titre: 'Chambre moderne près de l\'université',
    zone: 'Universiapolis',
    prix: 1500,
    type: 'chambre',
    surface: 15,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    proprietaire: {
      nom: 'Ahmed Benali',
      avatar: 'https://i.pravatar.cc/150?img=12',
      verifie: true
    }
  };

  // Fonction pour charger les messages (mémorisée avec useCallback)
  const loadMessages = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const messagesResponse = await getMessages(annonceId, token).catch(() => ({ success: true, data: [] }));
      const messagesData = messagesResponse?.data || messagesResponse || [];
      
      if (messagesData && Array.isArray(messagesData) && messagesData.length > 0) {
        setMessages(messagesData);
        setShowFirstMessageForm(false);
      } else {
        setMessages([]);
        setShowFirstMessageForm(true);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  }, [annonceId, navigate]);

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        // Charger l'annonce et les messages
        const [annonceData, messagesResponse] = await Promise.all([
          getAnnonceById(annonceId),
          getMessages(annonceId, token).catch(() => ({ success: true, data: [] })) // Si pas de messages, retourner structure vide
        ]);

        setAnnonce(annonceData);
        
        // Extraire les messages de la réponse (le backend retourne {success: true, data: [...]})
        const messagesData = messagesResponse?.data || messagesResponse || [];
        
        if (messagesData && Array.isArray(messagesData) && messagesData.length > 0) {
          setMessages(messagesData);
          setShowFirstMessageForm(false);
        } else {
          setMessages([]);
          setShowFirstMessageForm(true);
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        // En cas d'erreur, utiliser les données d'exemple
        setAnnonce(exampleAnnonce);
        setShowFirstMessageForm(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [annonceId, navigate]);

  // Rafraîchissement automatique des messages toutes les 3 secondes (chat en temps réel)
  useEffect(() => {
    // Ne pas rafraîchir si on est en train d'envoyer un message ou si le formulaire de premier message est affiché
    if (sending || showFirstMessageForm || loading) {
      return;
    }

    const token = getToken();
    if (!token) {
      return;
    }

    // Rafraîchir les messages toutes les 3 secondes
    const interval = setInterval(() => {
      loadMessages();
    }, 3000); // 3 secondes

    // Nettoyer l'intervalle quand le composant est démonté ou quand les dépendances changent
    return () => clearInterval(interval);
  }, [annonceId, sending, showFirstMessageForm, loading, loadMessages]);

  // Scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendFirstMessage = async (e) => {
    e.preventDefault();
    
    if (!firstMessage.message.trim()) {
      alert('Veuillez écrire un message');
      return;
    }

    setSending(true);

    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const extraData = {
        ...(firstMessage.sujet && { sujet: firstMessage.sujet }),
        ...(firstMessage.telephone && { telephone: firstMessage.telephone }),
        ...(firstMessage.dateVisite && { dateVisite: firstMessage.dateVisite })
      };

      await sendMessage(parseInt(annonceId), firstMessage.message, token, extraData);
      
      // Recharger les messages immédiatement
      await loadMessages();
      setShowFirstMessageForm(false);
      setFirstMessage({ sujet: '', message: '', telephone: '', dateVisite: '' });
    } catch (error) {
      alert('Erreur lors de l\'envoi du message: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setSending(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);

    try {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      await sendMessage(parseInt(annonceId), message, token);
      
      // Recharger les messages immédiatement après l'envoi
      await loadMessages();
      setMessage('');
    } catch (error) {
      alert('Erreur lors de l\'envoi du message: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setSending(false);
    }
  };

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
      <div className="message-page-wrapper">
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
    <div className="message-page-wrapper">
      <Navbar />
      <main className="message-page">
        <div className="container">
          <button onClick={() => navigate(-1)} className="btn-back-link">
            <IconArrowLeft />
            <span>Retour</span>
          </button>

          <div className="message-header">
            <div className="message-header__left">
              <Link to={`/annonce/${annonceId}`} className="message-header__link">
                <div className="annonce-preview">
                  {annonce?.images && annonce.images[0] && (
                    <img 
                      src={annonce.images[0]} 
                      alt={annonce.titre}
                      className="annonce-preview-image"
                    />
                  )}
                  <div className="annonce-preview-info">
                    <h1>{annonce?.titre}</h1>
                    <p className="annonce-preview-location">
                      <IconMapPin />
                      <span>{annonce?.zone}</span>
                    </p>
                    <p className="annonce-preview-prix">
                      <IconDollarSign />
                      <span>{annonce?.prix} MAD/mois</span>
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="message-header__right">
              <div className="proprietaire-card">
                <img
                  src={annonce?.proprietaire?.avatar || 'https://i.pravatar.cc/150'}
                  alt={annonce?.proprietaire?.nom}
                  className="proprietaire-avatar"
                />
                <div>
                  <div className="proprietaire-nom">
                    {annonce?.proprietaire?.nom}
                    {annonce?.proprietaire?.verifie && (
                      <span className="verifie-badge" title="Propriétaire vérifié">
                        <IconCheckCircle />
                      </span>
                    )}
                  </div>
                  <p className="proprietaire-role">Propriétaire</p>
                </div>
              </div>
            </div>
          </div>

          {showFirstMessageForm ? (
            <div className="first-message-form-container">
              <div className="first-message-form-card">
                <h2>Envoyer un message au propriétaire</h2>
                <p className="form-description">
                  Présentez-vous et expliquez votre intérêt pour ce logement. 
                  Plus votre message est détaillé, plus vous avez de chances d'obtenir une réponse positive.
                </p>

                <form onSubmit={handleSendFirstMessage} className="first-message-form">
                  <div className="form-group">
                    <label htmlFor="sujet">Sujet du message</label>
                    <select
                      id="sujet"
                      name="sujet"
                      value={firstMessage.sujet}
                      onChange={(e) => setFirstMessage({ ...firstMessage, sujet: e.target.value })}
                    >
                      <option value="">Sélectionner un sujet</option>
                      <option value="interesse">Je suis intéressé(e) par votre annonce</option>
                      <option value="visite">Demande de visite</option>
                      <option value="info">Demande d'informations</option>
                      <option value="disponibilite">Vérifier la disponibilité</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="first-message">Votre message *</label>
                    <textarea
                      id="first-message"
                      name="message"
                      value={firstMessage.message}
                      onChange={(e) => setFirstMessage({ ...firstMessage, message: e.target.value })}
                      rows="8"
                      placeholder="Bonjour,

Je suis étudiant(e) et je suis très intéressé(e) par votre annonce. 

[Présentez-vous brièvement : votre nom, votre situation d'étudiant, votre université/école]

[Expliquez pourquoi ce logement vous intéresse]

[Proposez une visite ou demandez des informations complémentaires]

Merci et à bientôt !"
                      required
                    />
                    <small className="form-hint">
                      <IconLightbulb />
                      <span>Astuce : Mentionnez votre situation d'étudiant, votre université, 
                      et pourquoi ce logement vous intéresse pour augmenter vos chances.</span>
                    </small>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="telephone">Votre téléphone (optionnel)</label>
                      <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={firstMessage.telephone}
                        onChange={(e) => setFirstMessage({ ...firstMessage, telephone: e.target.value })}
                        placeholder="+212 6 12 34 56 78"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="dateVisite">Date de visite souhaitée (optionnel)</label>
                      <input
                        type="date"
                        id="dateVisite"
                        name="dateVisite"
                        value={firstMessage.dateVisite}
                        onChange={(e) => setFirstMessage({ ...firstMessage, dateVisite: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => navigate(-1)}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="btn-send"
                      disabled={sending || !firstMessage.message.trim()}
                    >
                      {sending ? 'Envoi en cours...' : 'Envoyer le message'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className="message-container">
                <div className="messages-list" ref={messagesEndRef}>
                  {messages.length === 0 ? (
                    <div className="empty-messages">
                      <div className="empty-icon-wrapper">
                        <IconMessageCircle />
                      </div>
                      <p>Aucun message pour le moment</p>
                      <p className="empty-hint">Envoyez un message pour commencer la conversation</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`message-item ${msg.sender === 'moi' ? 'message-sent' : 'message-received'}`}
                      >
                        {msg.sender === 'proprietaire' && (
                          <img
                            src={msg.sender_data?.avatar || annonce?.proprietaire?.avatar || 'https://i.pravatar.cc/150'}
                            alt={msg.sender_data?.nom || annonce?.proprietaire?.nom || 'Propriétaire'}
                            className="message-avatar"
                            onError={(e) => {
                              e.target.src = 'https://i.pravatar.cc/150';
                            }}
                          />
                        )}
                        <div className="message-content">
                          {msg.sujet && (
                            <div className="message-sujet">
                              <strong>Sujet :</strong> {
                                msg.sujet === 'interesse' ? 'Je suis intéressé(e) par votre annonce' :
                                msg.sujet === 'visite' ? 'Demande de visite' :
                                msg.sujet === 'info' ? 'Demande d\'informations' :
                                msg.sujet === 'disponibilite' ? 'Vérifier la disponibilité' :
                                msg.sujet
                              }
                            </div>
                          )}
                          <p>{msg.content}</p>
                          {(msg.telephone || msg.dateVisite) && (
                            <div className="message-extra-info">
                              {msg.telephone && (
                                <span className="extra-info-item">
                                  <IconPhone />
                                  <span>{msg.telephone}</span>
                                </span>
                              )}
                              {msg.dateVisite && (
                                <span className="extra-info-item">
                                  <IconCalendar />
                                  <span>Visite souhaitée : {new Date(msg.dateVisite).toLocaleDateString('fr-FR')}</span>
                                </span>
                              )}
                            </div>
                          )}
                          <span className="message-time">{formatTime(msg.timestamp)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form className="message-form" onSubmit={handleSendMessage}>
                  <div className="message-input-wrapper">
                    <textarea
                      className="message-input"
                      placeholder="Tapez votre message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows="3"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.shiftKey === false) {
                          e.preventDefault();
                          if (message.trim()) {
                            handleSendMessage(e);
                          }
                        }
                      }}
                    />
                    <button 
                      type="submit" 
                      className="message-send-btn" 
                      disabled={!message.trim() || sending}
                    >
                      {sending ? (
                        <span>Envoi...</span>
                      ) : (
                        <>
                          <IconSend />
                          <span>Envoyer</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="message-info">
                <div className="info-card">
                  <div className="info-card-header">
                    <IconLightbulb />
                    <h3>Conseils pour une bonne communication</h3>
                  </div>
                  <ul>
                    <li>Présentez-vous clairement (nom, situation d'étudiant, université)</li>
                    <li>Soyez poli et respectueux</li>
                    <li>Mentionnez pourquoi ce logement vous intéresse</li>
                    <li>Proposez des créneaux pour une visite</li>
                    <li>Répondez rapidement aux messages</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MessagePage;
