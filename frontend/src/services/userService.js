// Service pour gérer les appels API du profil utilisateur
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Fonction helper pour récupérer le token
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Récupère le profil de l'utilisateur connecté
 */
export const getProfile = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Non authentifié');
    }

    const url = `${API_BASE_URL}/users/me`;
    console.log('Appel API getProfile:', url);
    console.log('Token présent:', !!token);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Réponse getProfile - Status:', response.status, response.statusText);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = `Erreur HTTP: ${response.status} ${response.statusText}`;
      let errorData = null;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('Erreur détaillée:', errorData);
        } catch (e) {
          console.error('Erreur lors du parsing de l\'erreur JSON:', e);
        }
      } else {
        const text = await response.text();
        console.error('Réponse non-JSON:', text.substring(0, 200));
        errorMessage = text.substring(0, 100) || errorMessage;
      }
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    const data = await response.json();
    console.log('Données brutes reçues (getProfile):', data);
    
    // Le backend retourne {success: true, data: {...}}
    if (data.success && data.data) {
      console.log('Profil extrait avec succès');
      return data.data;
    }
    
    // Si pas de structure success/data, retourner directement
    if (data.id || data.email) {
      console.log('Profil retourné directement');
      return data;
    }
    
    console.warn('Structure de données inattendue:', data);
    throw new Error('Structure de données inattendue du serveur');
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    console.error('URL appelée:', `${API_BASE_URL}/users/me`);
    throw error;
  }
};

/**
 * Met à jour le profil de l'utilisateur connecté
 */
export const updateProfile = async (profileData, avatarFile = null) => {
  try {
    console.log('=== updateProfile appelé ===');
    console.log('avatarFile:', avatarFile);
    console.log('avatarFile instanceof File:', avatarFile instanceof File);
    
    const token = getToken();
    if (!token) {
      throw new Error('Non authentifié');
    }

    let response;
    
    // Si un fichier avatar est fourni, utiliser l'endpoint POST dédié
    if (avatarFile && avatarFile instanceof File) {
      console.log('✅ Upload de l\'avatar via endpoint POST dédié');
      console.log('Nom du fichier:', avatarFile.name);
      console.log('Taille du fichier:', avatarFile.size, 'bytes');
      console.log('Type MIME:', avatarFile.type);
      
      const formData = new FormData();
      formData.append('avatar', avatarFile, avatarFile.name);
      
      console.log('=== VÉRIFICATION FORMDATA ===');
      console.log('FormData a "avatar":', formData.has('avatar'));
      
      // Utiliser directement l'URL du backend pour éviter les problèmes de proxy
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      const apiUrl = `${backendUrl}/api`;
      console.log('⚠️ BYPASS PROXY - Utilisation directe du backend:', apiUrl);
      console.log('URL complète:', `${apiUrl}/users/me/avatar`);
      console.log('Méthode: POST (endpoint dédié pour l\'avatar)');
      console.log('Token présent:', !!token);

      // Upload de l'avatar via POST
      const avatarResponse = await fetch(`${apiUrl}/users/me/avatar`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          // IMPORTANT: Ne PAS définir Content-Type pour FormData
        },
        body: formData,
      });
      
      console.log('Réponse upload avatar - Status:', avatarResponse.status);
      
      if (!avatarResponse.ok) {
        const errorData = await avatarResponse.json();
        throw new Error(errorData.message || 'Erreur lors de l\'upload de l\'avatar');
      }
      
      const avatarData = await avatarResponse.json();
      console.log('✅ Avatar uploadé avec succès:', avatarData);
      
      // Si d'autres champs doivent être mis à jour, faire un PUT séparé
      const hasOtherFields = profileData.nom || profileData.prenom || profileData.email || profileData.telephone;
      if (hasOtherFields) {
        console.log('Mise à jour des autres champs du profil...');
        response = await fetch(`${API_BASE_URL}/users/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        });
      } else {
        // Si seulement l'avatar a été uploadé, retourner directement les données
        if (avatarData.success && avatarData.data) {
          return avatarData.data;
        }
        // Sinon, simuler une réponse pour le reste du code
        response = {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: avatarData.data || avatarData
          })
        };
      }
    } else {
      // Sinon, utiliser JSON
      console.log('Utilisation de JSON (pas de fichier avatar)');
      response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      console.log('Réponse reçue - Status:', response.status);
    }

    if (!response.ok) {
      console.error('Erreur HTTP:', response.status, response.statusText);
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
    
    // Le backend retourne {success: true, data: {...}}
    if (data.success && data.data) {
      return data.data;
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

/**
 * Change le mot de passe de l'utilisateur connecté
 */
/**
 * Supprime l'avatar de l'utilisateur connecté
 */
export const deleteAvatar = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Non authentifié');
    }

    const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
      method: 'DELETE',
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
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avatar:', error);
    throw error;
  }
};

export const updatePassword = async (ancienMotDePasse, nouveauMotDePasse) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Non authentifié');
    }

    const response = await fetch(`${API_BASE_URL}/users/me/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ancienMotDePasse,
        nouveauMotDePasse,
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
    console.error('Erreur lors de la modification du mot de passe:', error);
    throw error;
  }
};

/**
 * Récupère les annonces de l'utilisateur connecté
 */
export const getMyAnnonces = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Non authentifié');
    }

    const response = await fetch(`${API_BASE_URL}/users/me/annonces`, {
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
    
    // Le backend retourne {success: true, data: [...]}
    if (data.success && data.data) {
      return data.data;
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    throw error;
  }
};

/**
 * Récupère les annonces consultées (vues) par l'utilisateur connecté
 */
export const getViewedAnnonces = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Non authentifié');
    }

    const response = await fetch(`${API_BASE_URL}/users/me/views`, {
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
    
    // Le backend retourne {success: true, data: [...]}
    if (data.success && data.data) {
      return data.data;
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces vues:', error);
    throw error;
  }
};

/**
 * Supprime une annonce de la liste des vues de l'utilisateur
 */
export const removeViewedAnnonce = async (annonceId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Non authentifié');
    }

    const response = await fetch(`${API_BASE_URL}/users/me/views/${annonceId}`, {
      method: 'DELETE',
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
    console.error('Erreur lors de la suppression de la vue:', error);
    throw error;
  }
};

