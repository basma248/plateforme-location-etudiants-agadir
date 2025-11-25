import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMessages, sendMessage } from '../services/messageService';
import { getAnnonceById } from '../services/annonceService';
import { getToken } from '../services/authService';
import './MessagePage.css';

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
        const [annonceData, messagesData] = await Promise.all([
          getAnnonceById(annonceId),
          getMessages(annonceId, token).catch(() => []) // Si pas de messages, retourner array vide
        ]);

        setAnnonce(annonceData);
        
        if (messagesData && messagesData.length > 0) {
          setMessages(messagesData);
          setShowFirstMessageForm(false);
        } else {
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
      
      // Recharger les messages
      const messagesData = await getMessages(annonceId, token);
      setMessages(messagesData);
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
      
      // Recharger les messages pour avoir la réponse du serveur
      const messagesData = await getMessages(annonceId, token);
      setMessages(messagesData);
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
            ← Retour
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
                    <p className="annonce-preview-location">📍 {annonce?.zone}</p>
                    <p className="annonce-preview-prix">{annonce?.prix} MAD/mois</p>
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
                      <span className="verifie-badge" title="Propriétaire vérifié">✓</span>
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
                      💡 Astuce : Mentionnez votre situation d'étudiant, votre université, 
                      et pourquoi ce logement vous intéresse pour augmenter vos chances.
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
                      <div className="empty-icon">💬</div>
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
                            src={annonce?.proprietaire?.avatar || 'https://i.pravatar.cc/150'}
                            alt={annonce?.proprietaire?.nom}
                            className="message-avatar"
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
                              {msg.telephone && <span>📞 {msg.telephone}</span>}
                              {msg.dateVisite && <span>📅 Visite souhaitée : {new Date(msg.dateVisite).toLocaleDateString('fr-FR')}</span>}
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
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                          </svg>
                          Envoyer
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="message-info">
                <div className="info-card">
                  <h3>💡 Conseils pour une bonne communication</h3>
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
