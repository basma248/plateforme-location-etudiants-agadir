// Service pour gérer les messages privés
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Récupère les messages d'une conversation
 */
export const getMessages = async (annonceId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/annonce/${annonceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    // Retourner des messages d'exemple pour le développement
    return getExampleMessages(annonceId);
  }
};

/**
 * Envoie un message
 */
export const sendMessage = async (annonceId, content, token, extraData = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        annonceId,
        content,
        ...extraData, // sujet, telephone, dateVisite
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    throw error;
  }
};

/**
 * Récupère toutes les conversations de l'utilisateur
 */
export const getConversations = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    throw error;
  }
};

// ===== DONNÉES D'EXEMPLE =====

const getExampleMessages = (annonceId) => {
  return [
    {
      id: 1,
      sender: 'proprietaire',
      content: 'Bonjour ! Merci pour votre intérêt. La chambre est toujours disponible. Souhaitez-vous organiser une visite ?',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 2,
      sender: 'moi',
      content: 'Bonjour, oui je serais intéressé(e). Quand serait-il possible de visiter ?',
      timestamp: new Date(Date.now() - 1800000),
    }
  ];
};


