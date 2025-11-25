// Service pour gérer les appels API de l'administration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Récupère le token d'authentification
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Récupère les statistiques du dashboard
 */
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    // Retourner des données d'exemple en cas d'erreur
    return {
      totalAnnonces: 45,
      totalUsers: 128,
      totalMessages: 234,
      annoncesEnAttente: 3,
      annoncesSignalees: 2,
      usersSignales: 1,
      recentAnnonces: 5,
      recentUsers: 3
    };
  }
};

/**
 * Récupère toutes les annonces (pour l'admin)
 */
export const getAllAnnonces = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });

    const url = `${API_BASE_URL}/admin/annonces${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    // Retourner des données d'exemple
    return getExampleAnnonces();
  }
};

/**
 * Modère une annonce (approuve, rejette, supprime)
 */
export const moderateAnnonce = async (id, action, reason = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/annonces/${id}/moderate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ action, reason }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la modération:', error);
    throw error;
  }
};

/**
 * Supprime une annonce (admin)
 */
export const deleteAnnonceAdmin = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/annonces/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
};

/**
 * Récupère tous les utilisateurs
 */
export const getAllUsers = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });

    const url = `${API_BASE_URL}/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    // Retourner des données d'exemple
    return getExampleUsers();
  }
};

/**
 * Crée un nouvel utilisateur (admin)
 */
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la création');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw error;
  }
};

/**
 * Supprime un utilisateur (admin)
 */
export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
};

/**
 * Signale un utilisateur
 */
export const reportUser = async (id, reason) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors du signalement:', error);
    throw error;
  }
};

/**
 * Suspend ou active un utilisateur
 */
export const toggleUserStatus = async (id, suspended) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ suspended }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la modification du statut:', error);
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
      statut: 'approuve'
    },
    {
      id: 2,
      titre: 'Studio indépendant Founty',
      zone: 'Founty',
      prix: 2500,
      type: 'studio',
      statut: 'approuve'
    },
    {
      id: 3,
      titre: 'Appartement 2 chambres Hay Salam',
      zone: 'Hay Salam',
      prix: 3500,
      type: 'appartement',
      statut: 'en_attente'
    },
    {
      id: 4,
      titre: 'Colocation étudiante centre-ville',
      zone: 'Centre-ville',
      prix: 1200,
      type: 'colocation',
      statut: 'approuve'
    },
    {
      id: 5,
      titre: 'Studio moderne avec terrasse',
      zone: 'Anza',
      prix: 2800,
      type: 'studio',
      statut: 'signale'
    },
    {
      id: 6,
      titre: 'Chambre dans villa étudiante',
      zone: 'Inezgane',
      prix: 1800,
      type: 'chambre',
      statut: 'en_attente'
    }
  ];
};

const getExampleUsers = () => {
  return [
    {
      id: 1,
      nom: 'Ahmed Benali',
      email: 'ahmed.benali@example.com',
      telephone: '+212 6 12 34 56 78',
      role: 'user',
      suspended: false
    },
    {
      id: 2,
      nom: 'Fatima Alami',
      email: 'fatima.alami@example.com',
      telephone: '+212 6 23 45 67 89',
      role: 'user',
      suspended: false
    },
    {
      id: 3,
      nom: 'Youssef Idrissi',
      email: 'youssef.idrissi@example.com',
      telephone: '+212 6 34 56 78 90',
      role: 'admin',
      suspended: false
    },
    {
      id: 4,
      nom: 'Aicha Tazi',
      email: 'aicha.tazi@example.com',
      telephone: '+212 6 45 67 89 01',
      role: 'user',
      suspended: true
    },
    {
      id: 5,
      nom: 'Mohamed Amrani',
      email: 'mohamed.amrani@example.com',
      telephone: '+212 6 56 78 90 12',
      role: 'user',
      suspended: false
    }
  ];
};

