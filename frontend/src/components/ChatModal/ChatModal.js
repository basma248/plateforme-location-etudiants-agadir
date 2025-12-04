import React, { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '../../services/messageService';
import { getToken, getCurrentUser } from '../../services/authService';
import './ChatModal.css';

function ChatModal({ annonce, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const refreshIntervalRef = useRef(null);
  const currentUser = getCurrentUser();

  // Charger les messages au montage et quand l'annonce change
  useEffect(() => {
    if (isOpen && annonce && annonce.id) {
      // Charger les messages immédiatement
      loadMessages(true);
      
      // Recharger les messages toutes les 3 secondes pour avoir les nouveaux messages
      refreshIntervalRef.current = setInterval(() => {
        // Ne charger que si le modal est toujours ouvert
        if (isOpen && annonce && annonce.id) {
          loadMessages(false); // Ne pas afficher le loading lors du refresh
        }
      }, 3000);
      
      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
      };
    } else if (!isOpen) {
      // Nettoyer seulement quand le modal se ferme explicitement
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      // Ne pas vider les messages immédiatement, les garder pour la prochaine ouverture
      // setMessages([]);
      setNewMessage('');
      setError(null);
    }
  }, [isOpen, annonce]);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadMessages = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setError('Vous devez être connecté pour voir les messages');
        return;
      }

      const response = await getMessages(annonce.id, token);
      
      // Le backend retourne {success: true, data: [...]}
      const messagesData = response.success ? response.data : (response.data || response || []);
      
      if (Array.isArray(messagesData)) {
        // Mapper les messages pour le format attendu
        const formattedMessages = messagesData.map(msg => {
          const sender = msg.sender || {};
          const isMine = msg.sender_id === currentUser?.id;
          
          return {
            id: msg.id,
            content: msg.content,
            sender_id: msg.sender_id,
            sender: {
              id: sender.id || msg.sender_id,
              nom: sender.nom || 'Utilisateur',
              prenom: sender.prenom || '',
              avatar: sender.avatar || null,
            },
            created_at: msg.created_at,
            lu: msg.lu || false,
            isMine: isMine,
          };
        });
        
        // Toujours mettre à jour les messages pour avoir les nouveaux messages
        // Ne pas vider les messages si on a déjà des messages affichés
        setMessages(prev => {
          // Si on a déjà des messages, on les met à jour
          // Sinon, on utilise les nouveaux messages
          if (prev.length > 0 && formattedMessages.length === 0) {
            // Garder les messages existants si on reçoit un tableau vide (probablement une erreur temporaire)
            return prev;
          }
          return formattedMessages;
        });
      } else {
        // Si pas de messages, garder les messages existants (ne pas les vider)
        // Sauf si c'est le premier chargement
        if (showLoading && messages.length === 0) {
          setMessages([]);
        }
      }
    } catch (err) {
      console.error('Erreur lors du chargement des messages:', err);
      // Ne pas afficher d'erreur si c'est juste un refresh silencieux
      if (showLoading) {
        setError('Erreur lors du chargement des messages');
        // Ne pas vider les messages en cas d'erreur, garder ceux qu'on a déjà
        if (messages.length === 0) {
          setMessages([]);
        }
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) {
      return;
    }

    const token = getToken();
    if (!token) {
      setError('Vous devez être connecté pour envoyer un message');
      return;
    }

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);
    setError(null);

    // Ajouter le message optimistiquement à l'interface
    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      sender_id: currentUser?.id,
      sender: {
        id: currentUser?.id,
        nom: currentUser?.nom || 'Vous',
        prenom: currentUser?.prenom || '',
        avatar: currentUser?.avatar || null,
      },
      created_at: new Date().toISOString(),
      lu: false,
      isMine: true,
      isTemporary: true,
    };
    
    setMessages(prev => [...prev, tempMessage]);
    scrollToBottom();

    try {
      const response = await sendMessage(annonce.id, messageContent, token);
      
      // Le backend retourne {success: true, data: {...}}
      const newMsg = response.success ? response.data : response;
      
      if (newMsg) {
        // Remplacer le message temporaire par le vrai message
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== tempMessage.id);
          const formattedMessage = {
            id: newMsg.id,
            content: newMsg.content,
            sender_id: newMsg.sender_id,
            sender: newMsg.sender || {
              id: newMsg.sender_id,
              nom: currentUser?.nom || 'Vous',
              prenom: currentUser?.prenom || '',
              avatar: currentUser?.avatar || null,
            },
            created_at: newMsg.created_at || new Date().toISOString(),
            lu: false,
            isMine: true,
          };
          return [...filtered, formattedMessage];
        });
        
        // Recharger les messages après un court délai pour avoir les données complètes
        setTimeout(() => {
          loadMessages(false);
        }, 500);
      }
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError(err.message || 'Erreur lors de l\'envoi du message');
      // Retirer le message temporaire en cas d'erreur
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      setNewMessage(messageContent); // Remettre le message dans l'input
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
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
    } catch (e) {
      return '';
    }
  };

  if (!isOpen) return null;

  const proprietaire = annonce?.proprietaire || annonce?.user;
  const proprietaireName = proprietaire?.nomComplet || 
                          `${proprietaire?.prenom || ''} ${proprietaire?.nom || ''}`.trim() || 
                          proprietaire?.email || 
                          'Propriétaire';

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="chat-modal-header">
          <div className="chat-header-info">
            <img
              src={proprietaire?.avatar || proprietaire?.profile_image || 'https://i.pravatar.cc/150'}
              alt={proprietaireName}
              className="chat-header-avatar"
              onError={(e) => {
                e.target.src = 'https://i.pravatar.cc/150';
              }}
            />
            <div className="chat-header-details">
              <h3 className="chat-header-name">
                {proprietaireName}
                {proprietaire?.verifie && (
                  <span className="chat-verified-badge" title="Vérifié">✓</span>
                )}
              </h3>
              <p className="chat-header-annonce">
                {annonce?.titre || 'Annonce'}
              </p>
            </div>
          </div>
          <button className="chat-close-btn" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages" ref={messagesContainerRef}>
          {loading && messages.length === 0 ? (
            <div className="chat-loading">
              <div className="chat-spinner"></div>
              <p>Chargement des messages...</p>
            </div>
          ) : error && messages.length === 0 ? (
            <div className="chat-error">
              <p>{error}</p>
              <button onClick={() => loadMessages()} className="chat-retry-btn">
                Réessayer
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="chat-empty">
              <p>💬 Aucun message pour le moment</p>
              <p className="chat-empty-hint">
                Commencez la conversation en envoyant un message ci-dessous
              </p>
            </div>
          ) : (
            <>
              {messages.length === 0 ? (
                <div className="chat-empty">
                  <p>💬 Aucun message pour le moment</p>
                  <p className="chat-empty-hint">
                    Commencez la conversation en envoyant un message ci-dessous
                  </p>
                </div>
              ) : (
                messages.map((message, index) => {
                // Grouper les messages consécutifs du même expéditeur
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const showAvatar = !message.isMine && (!prevMessage || prevMessage.sender_id !== message.sender_id || prevMessage.isMine);
                const showTime = !prevMessage || 
                  Math.abs(new Date(message.created_at) - new Date(prevMessage.created_at)) > 300000; // 5 minutes
                
                return (
                  <div
                    key={message.id}
                    className={`chat-message ${message.isMine ? 'chat-message-mine' : 'chat-message-other'} ${message.isTemporary ? 'chat-message-temporary' : ''}`}
                  >
                    {showAvatar && !message.isMine && (
                      <img
                        src={message.sender?.avatar || 'https://i.pravatar.cc/150'}
                        alt={message.sender?.nom || 'Utilisateur'}
                        className="chat-message-avatar"
                        onError={(e) => {
                          e.target.src = 'https://i.pravatar.cc/150';
                        }}
                      />
                    )}
                    {!message.isMine && !showAvatar && (
                      <div className="chat-message-avatar-spacer"></div>
                    )}
                    <div className="chat-message-content">
                      <div className="chat-message-bubble">
                        <p className="chat-message-text">{message.content}</p>
                        {showTime && (
                          <span className="chat-message-time">
                            {formatTime(message.created_at)}
                            {message.isMine && message.lu && (
                              <span className="chat-message-read">✓✓</span>
                            )}
                            {message.isMine && !message.lu && (
                              <span className="chat-message-sent">✓</span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
                })
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          {error && (
            <div className="chat-input-error">
              {error}
            </div>
          )}
          <div className="chat-input-wrapper">
            <input
              type="text"
              className="chat-input"
              placeholder="Tapez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!newMessage.trim() || sending}
            >
              {sending ? (
                <span className="chat-send-spinner"></span>
              ) : (
                '📤'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatModal;
