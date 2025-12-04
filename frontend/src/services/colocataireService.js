// Service pour gérer les appels API des colocataires
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Fonction helper pour récupérer le token
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Récupère toutes les demandes de colocataires avec filtres optionnels
 */
export const getColocataires = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Ajouter les filtres aux paramètres de requête
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });

    const url = `${API_BASE_URL}/colocataires${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    // Le backend retourne {success: true, data: {data: [...], current_page, ...}}
    if (data.success && data.data) {
      if (data.data.data && Array.isArray(data.data.data)) {
        return data.data.data;
      }
      if (Array.isArray(data.data)) {
        return data.data;
      }
    }
    
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des colocataires:', error);
    return [];
  }
};

/**
 * Récupère une demande de colocataire par son ID
 */
export const getColocataireById = async (id) => {
  try {
    const url = `${API_BASE_URL}/colocataires/${id}`;
    
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorData;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          errorData = await response.json();
        } catch (e) {
          const errorText = await response.text();
          errorData = { message: errorText };
        }
      } else {
        const errorText = await response.text();
        errorData = { message: errorText || `Erreur HTTP: ${response.status}` };
      }
      
      const errorMessage = errorData.message || `Erreur HTTP: ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    if (data.id) {
      return data;
    }
    
    throw new Error('Structure de données inattendue du serveur');
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande de colocataire:', error);
    throw error;
  }
};

/**
 * Crée une nouvelle demande de colocataire
 */
export const createColocataire = async (colocataireData, token) => {
  try {
    const backendData = {
      titre: colocataireData.titre,
      description: colocataireData.description,
      zone_preferee: colocataireData.zonePreferee || colocataireData.zone_preferee || null,
      budget_max: colocataireData.budgetMax || colocataireData.budget_max || null,
      type_logement: colocataireData.typeLogement || colocataireData.type_logement || null,
      genre: colocataireData.genre || null,
      type_recherche: colocataireData.typeRecherche || colocataireData.type_recherche || null,
      nb_personnes_recherche: colocataireData.nbPersonnesSouhaitees || colocataireData.nb_personnes_souhaitees || null,
      preferences: colocataireData.preferences || null,
      contact_email: colocataireData.contactEmail || colocataireData.contact_email || null,
      contact_telephone: colocataireData.contactTelephone || colocataireData.contact_telephone || null,
    };

    const response = await fetch(`${API_BASE_URL}/colocataires`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(backendData),
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
    return data.data || data;
  } catch (error) {
    console.error('Erreur lors de la création de la demande de colocataire:', error);
    throw error;
  }
};

/**
 * Met à jour une demande de colocataire
 */
export const updateColocataire = async (id, colocataireData, token) => {
  try {
    const backendData = {
      titre: colocataireData.titre,
      description: colocataireData.description,
      zone_preferee: colocataireData.zonePreferee || colocataireData.zone_preferee || null,
      budget_max: colocataireData.budgetMax || colocataireData.budget_max || null,
      type_logement: colocataireData.typeLogement || colocataireData.type_logement || null,
      preferences: colocataireData.preferences || null,
      contact_email: colocataireData.contactEmail || colocataireData.contact_email || null,
      contact_telephone: colocataireData.contactTelephone || colocataireData.contact_telephone || null,
      statut: colocataireData.statut || null,
    };

    const response = await fetch(`${API_BASE_URL}/colocataires/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(backendData),
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
    return data.data || data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la demande de colocataire:', error);
    throw error;
  }
};

/**
 * Supprime une demande de colocataire
 */
export const deleteColocataire = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/colocataires/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de la demande de colocataire:', error);
    throw error;
  }
};

/**
 * Récupère les demandes de colocataire de l'utilisateur connecté
 */
export const getMyColocataires = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/colocataires/me/list`, {
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
    
    if (data.success && data.data) {
      return Array.isArray(data.data) ? data.data : [];
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération de mes demandes de colocataire:', error);
    throw error;
  }
};

/**
 * Contacter un colocataire
 */
export const contactColocataire = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/colocataires/${id}/contact`, {
      method: 'POST',
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
    return data.data || data;
  } catch (error) {
    console.error('Erreur lors du contact du colocataire:', error);
    throw error;
  }
};


