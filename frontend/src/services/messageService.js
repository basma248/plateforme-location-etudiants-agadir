// Service pour gérer les messages privés
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Récupère les messages d'une conversation
 */
export const getMessages = async (annonceId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/annonce/${annonceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = `Erreur HTTP: ${response.status}`;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Ignore parsing error
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    throw error;
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
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        annonceId,
        content,
        ...extraData, // sujet, telephone, dateVisite
      }),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = `Erreur HTTP: ${response.status}`;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          if (errorData.errors) {
            const errorMessages = Object.values(errorData.errors).flat().join(', ');
            errorMessage = errorMessages || errorData.message || errorMessage;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          console.error('Erreur lors du parsing de l\'erreur:', e);
        }
      }
      
      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
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
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = `Erreur HTTP: ${response.status}`;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Ignore parsing error
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Réponse brute getConversations:', data);
    
    // Le backend retourne {success: true, data: [...]}
    // Retourner la structure complète pour que le composant puisse extraire les données
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    // Retourner une structure vide plutôt que de throw pour éviter de casser l'interface
    return {
      success: false,
      data: [],
      message: error.message || 'Erreur lors de la récupération des conversations'
    };
  }
};

