// Service pour gérer les appels API des annonces
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Fonction helper pour récupérer le token
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Récupère toutes les annonces avec filtres optionnels
 */
export const getAnnonces = async (filters = {}) => {
  // Déclarer url en dehors du try pour qu'elle soit accessible dans le catch
  let url;
  
  try {
    const queryParams = new URLSearchParams();
    
    // Convertir les noms de champs du frontend vers le backend
    const fieldMapping = {
      prixMin: 'prix_min',
      prixMax: 'prix_max',
      surfaceMin: 'surface_min',
      surfaceMax: 'surface_max',
      nbChambres: 'nb_chambres',
      sortBy: 'sort_by',
      sortDirection: 'sort_direction'
    };
    
    // Ajouter les filtres aux paramètres de requête
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        const backendKey = fieldMapping[key] || key;
        // Gérer le tri spécial pour prix_desc
        if (key === 'sortBy' && filters[key] === 'prix_desc') {
          queryParams.append('sort_by', 'prix');
          queryParams.append('sort_direction', 'desc');
        } else {
          queryParams.append(backendKey, filters[key]);
        }
      }
    });

    url = `${API_BASE_URL}/annonces${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
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
    console.log('Réponse brute du backend (getAnnonces):', data);
    
    // Le backend retourne {success: true, data: {data: [...], current_page, ...}}
    // Extraire le tableau des annonces
    if (data.success && data.data) {
      // Si c'est un objet paginé Laravel (structure: {success: true, data: {data: [...], current_page: 1, ...}})
      if (data.data.data && Array.isArray(data.data.data)) {
        console.log('Annonces extraites (paginé):', data.data.data.length, 'annonces');
        return data.data.data; // Retourner le tableau des annonces
      }
      // Si c'est directement un tableau (structure: {success: true, data: [...]})
      if (Array.isArray(data.data)) {
        console.log('Annonces extraites (tableau direct):', data.data.length, 'annonces');
        return data.data;
      }
    }
    // Si pas de structure success/data, vérifier si c'est directement un tableau
    if (Array.isArray(data)) {
      console.log('Annonces extraites (tableau direct sans wrapper):', data.length, 'annonces');
      return data;
    }
    // Si c'est un objet avec une propriété data qui est un tableau
    if (data.data && Array.isArray(data.data)) {
      console.log('Annonces extraites (data direct):', data.data.length, 'annonces');
      return data.data;
    }
    // Fallback: retourner un tableau vide si la structure est inattendue
    console.warn('Structure de données inattendue:', data);
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    console.error('URL appelée:', url || 'URL non définie');
    // NE PAS retourner des données d'exemple - retourner un tableau vide
    return [];
  }
};

/**
 * Récupère une annonce par son ID
 */
export const getAnnonceById = async (id) => {
  try {
    const url = `${API_BASE_URL}/annonces/${id}`;
    console.log('Appel API getAnnonceById:', url);
    
    // Récupérer le token si l'utilisateur est connecté
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Ajouter le token si présent (pour permettre l'enregistrement des vues)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔑 Token envoyé avec la requête (premiers caractères):', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ Aucun token trouvé - l\'utilisateur n\'est peut-être pas connecté');
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    console.log('Statut de la réponse:', response.status, response.statusText);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorData;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          errorData = await response.json();
        } catch (e) {
          const errorText = await response.text();
          console.error('Erreur HTTP - Réponse texte:', errorText);
          errorData = { message: errorText };
        }
      } else {
        const errorText = await response.text();
        console.error('Erreur HTTP - Réponse non-JSON:', errorText);
        errorData = { message: errorText || `Erreur HTTP: ${response.status} ${response.statusText}` };
      }
      
      const errorMessage = errorData.message || `Erreur HTTP: ${response.status} ${response.statusText}`;
      console.error('❌ Erreur API:', errorMessage);
      console.error('📋 Détails:', errorData);
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Réponse non-JSON reçue:', text);
      throw new Error('Réponse invalide du serveur (non-JSON)');
    }
    
    const data = await response.json();
    console.log('✅ Données brutes reçues (getAnnonceById):', data);
    
    // Le backend retourne {success: true, data: {...}}
    if (data.success && data.data) {
      console.log('✅ Annonce extraite:', data.data.id, data.data.titre);
      console.log('📸 Images:', data.data.all_images?.length || data.data.images?.length || 0);
      console.log('👤 Propriétaire:', data.data.proprietaire ? 'présent' : 'absent');
      return data.data;
    }
    
    // Si pas de structure success/data, retourner directement
    if (data.id) {
      console.log('✅ Annonce retournée directement:', data.id, data.titre);
      return data;
    }
    
    // Si aucune structure reconnue
    console.warn('⚠️ Structure de données inattendue:', data);
    throw new Error('Structure de données inattendue du serveur');
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'annonce:', error);
    console.error('ID demandé:', id);
    throw error; // Ne pas retourner d'exemple, laisser le composant gérer l'erreur
  }
};

/**
 * Crée une nouvelle annonce
 */
export const createAnnonce = async (annonceData, token, imageFiles = null) => {
  try {
    // Si des fichiers images sont fournis, utiliser FormData
    if (imageFiles && imageFiles.length > 0) {
      const formData = new FormData();
      
      // Ajouter les champs de l'annonce
      formData.append('titre', annonceData.titre);
      formData.append('type', annonceData.type);
      formData.append('zone', annonceData.zone);
      if (annonceData.adresse) formData.append('adresse', annonceData.adresse);
      formData.append('prix', annonceData.prix);
      if (annonceData.surface) formData.append('surface', annonceData.surface);
      formData.append('nb_chambres', annonceData.nbChambres || annonceData.nb_chambres || 1);
      formData.append('description', annonceData.description);
      if (annonceData.descriptionLongue) formData.append('description_longue', annonceData.descriptionLongue);
      // Convertir meuble en booléen pour Laravel (FormData envoie toujours des strings)
      // Envoyer "1" pour true, "0" pour false
      const meubleValue = annonceData.meuble === true || annonceData.meuble === 'true' || annonceData.meuble === 1 || annonceData.meuble === '1';
      formData.append('meuble', meubleValue ? '1' : '0');
      console.log('Meuble envoyé:', meubleValue, '(valeur originale:', annonceData.meuble, ')');
      if (annonceData.disponibilite) formData.append('disponibilite', annonceData.disponibilite);
      
      // Ajouter les fichiers images - utiliser le format correct pour Laravel
      let validImageCount = 0;
      imageFiles.forEach((file, index) => {
        if (file instanceof File) {
          // Vérifier que c'est bien un fichier image
          if (file.type && file.type.startsWith('image/')) {
            // Laravel attend image_files[0], image_files[1], etc.
            formData.append(`image_files[${index}]`, file, file.name);
            validImageCount++;
            console.log(`Fichier ${index} ajouté:`, file.name, file.type, (file.size / 1024).toFixed(2), 'KB');
          } else {
            console.warn(`Fichier ${index} ignoré (pas une image):`, file.name, file.type);
          }
        }
      });
      
      console.log('FormData préparé avec', validImageCount, 'fichiers images valides sur', imageFiles.length, 'fichiers');
      
      // Ajouter les URLs d'images si présentes
      if (annonceData.images && Array.isArray(annonceData.images) && annonceData.images.length > 0) {
        annonceData.images.forEach((url, index) => {
          formData.append(`images[${index}]`, url);
        });
      }
      
      // Ajouter les équipements
      if (annonceData.equipements && Array.isArray(annonceData.equipements)) {
        annonceData.equipements.forEach((eq, index) => {
          formData.append(`equipements[${index}]`, eq);
        });
      }
      
      // Ajouter les règles
      if (annonceData.regles && Array.isArray(annonceData.regles)) {
        annonceData.regles.forEach((regle, index) => {
          formData.append(`regles[${index}]`, regle);
        });
      }

      const response = await fetch(`${API_BASE_URL}/annonces`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement avec le boundary
        },
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        let errorMessage = `Erreur HTTP: ${response.status}`;
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
            if (errorData.errors) {
              const errorMessages = Object.values(errorData.errors).flat().join(', ');
              errorMessage = errorMessages || errorMessage;
            }
          } catch (e) {
            // Ignorer l'erreur de parsing
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.data || data;
    } else {
      // Pas de fichiers, utiliser JSON comme avant
      const backendData = {
        titre: annonceData.titre,
        type: annonceData.type,
        zone: annonceData.zone,
        adresse: annonceData.adresse || null,
        prix: annonceData.prix,
        surface: annonceData.surface || null,
        nb_chambres: annonceData.nbChambres || annonceData.nb_chambres || 1,
        description: annonceData.description,
        description_longue: annonceData.descriptionLongue || annonceData.description_longue || null,
        meuble: annonceData.meuble || false,
        disponibilite: annonceData.disponibilite || null,
        images: annonceData.images || [],
        equipements: annonceData.equipements || [],
        regles: annonceData.regles || [],
      };

      const response = await fetch(`${API_BASE_URL}/annonces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(backendData),
      });

      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
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
        } else {
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText);
        }
        
        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      // Le backend retourne {success: true, data: {...}}
      return data.data || data;
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'annonce:', error);
    throw error;
  }
};

/**
 * Met à jour une annonce
 */
export const updateAnnonce = async (id, annonceData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/annonces/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(annonceData),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    // Le backend retourne {success: true, data: [...]}
    return data.data || data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'annonce:', error);
    throw error;
  }
};

/**
 * Supprime une annonce
 */
export const deleteAnnonce = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/annonces/${id}`, {
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
    console.error('Erreur lors de la suppression de l\'annonce:', error);
    throw error;
  }
};

/**
 * Récupère les favoris de l'utilisateur connecté
 */
export const getFavorites = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/annonces/favorites/list`, {
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
    console.log('Réponse brute getFavorites:', data);
    
    // Le backend retourne {success: true, data: {data: [...], current_page, ...}}
    if (data.success && data.data) {
      // Si c'est un objet paginé Laravel
      if (data.data.data && Array.isArray(data.data.data)) {
        console.log('Favoris extraits (paginé):', data.data.data.length, 'annonces');
        return data.data.data;
      }
      // Si c'est directement un tableau
      if (Array.isArray(data.data)) {
        console.log('Favoris extraits (tableau direct):', data.data.length, 'annonces');
        return data.data;
      }
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    throw error;
  }
};

/**
 * Ajoute/Retire une annonce des favoris
 */
/**
 * Supprime une annonce des favoris de l'utilisateur
 */
export const removeFavorite = async (annonceId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/annonces/${annonceId}/favorite`, {
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
    console.error('Erreur lors de la suppression du favori:', error);
    throw error;
  }
};

export const toggleFavorite = async (annonceId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/annonces/${annonceId}/favorite`, {
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
    
    // Le backend retourne {success: true, favorited: true/false, message: ...}
    if (data.success !== undefined) {
      return {
        favorited: data.favorited,
        message: data.message
      };
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la modification des favoris:', error);
    throw error;
  }
};

// ===== DONNÉES D'EXEMPLE (pour le développement sans backend) =====

const getExampleAnnonces = () => {
  return [
    {
      id: 1,
      titre: 'Chambre moderne près de l\'université',
      zone: 'Universiapolis',
      prix: 1500,
      type: 'chambre',
      surface: 15,
      nbChambres: 1,
      meuble: true,
      description: 'Chambre spacieuse et lumineuse dans un appartement partagé.',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      rating: 4.8
    },
    {
      id: 2,
      titre: 'Studio indépendant Founty',
      zone: 'Founty',
      prix: 2500,
      type: 'studio',
      surface: 25,
      nbChambres: 1,
      meuble: true,
      description: 'Studio entièrement meublé avec cuisine équipée.',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      rating: 4.9
    },
    {
      id: 3,
      titre: 'Appartement 2 chambres Hay Salam',
      zone: 'Hay Salam',
      prix: 3500,
      type: 'appartement',
      surface: 60,
      nbChambres: 2,
      meuble: false,
      description: 'Bel appartement au 2ème étage avec balcon.',
      images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'],
      rating: 4.7
    },
    {
      id: 4,
      titre: 'Colocation étudiante centre-ville',
      zone: 'Centre-ville',
      prix: 1200,
      type: 'colocation',
      surface: 20,
      nbChambres: 1,
      meuble: true,
      description: 'Chambre dans colocation sympa avec 2 autres étudiants.',
      images: ['https://images.unsplash.com/photo-1556912172-45b7abe8b7e8?w=800'],
      rating: 4.6
    },
    {
      id: 5,
      titre: 'Studio moderne avec terrasse',
      zone: 'Anza',
      prix: 2800,
      type: 'studio',
      surface: 30,
      nbChambres: 1,
      meuble: true,
      description: 'Studio récent avec terrasse privée. Vue sur la mer.',
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
      rating: 5.0
    },
    {
      id: 6,
      titre: 'Chambre dans villa étudiante',
      zone: 'Inezgane',
      prix: 1800,
      type: 'chambre',
      surface: 18,
      nbChambres: 1,
      meuble: true,
      description: 'Chambre dans une belle villa avec jardin.',
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
      rating: 4.5
    }
  ];
};

const getExampleAnnonce = (id) => {
  const annonces = getExampleAnnonces();
  const annonce = annonces.find(a => a.id === parseInt(id)) || annonces[0];
  
  return {
    ...annonce,
    descriptionLongue: annonce.description + ' ' + 'Cette magnifique chambre se trouve dans un appartement moderne et bien entretenu. Elle est parfaite pour un étudiant cherchant un logement confortable et bien situé.',
    disponibilite: 'Immédiate',
    adresse: `Rue Mohammed V, ${annonce.zone}, Agadir`,
    equipements: ['Wi-Fi', 'Chauffage', 'Lave-linge', 'Parking', 'Ascenseur'],
    regles: ['Non-fumeur', 'Animaux non autorisés', 'Pas de fêtes'],
    proprietaire: {
      nom: 'Ahmed Benali',
      email: 'ahmed.benali@example.com',
      telephone: '+212 6 12 34 56 78',
      avatar: 'https://i.pravatar.cc/150?img=12',
      verifie: true
    },
    nbAvis: 24
  };
};



