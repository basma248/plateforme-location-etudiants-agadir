// Service pour gérer les appels API des annonces
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Récupère toutes les annonces avec filtres optionnels
 */
export const getAnnonces = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Ajouter les filtres aux paramètres de requête
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });

    const url = `${API_BASE_URL}/annonces${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
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
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    // Retourner des données d'exemple en cas d'erreur (pour le développement)
    return getExampleAnnonces();
  }
};

/**
 * Récupère une annonce par son ID
 */
export const getAnnonceById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/annonces/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'annonce:', error);
    // Retourner une annonce d'exemple
    return getExampleAnnonce(id);
  }
};

/**
 * Crée une nouvelle annonce
 */
export const createAnnonce = async (annonceData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/annonces`, {
      method: 'POST',
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
    return data;
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
    return data;
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



