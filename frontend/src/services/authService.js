// Service pour gérer l'authentification
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Connexion d'un utilisateur
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur de connexion');
    }

    const data = await response.json();
    
    // Sauvegarder le token dans le localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur d\'inscription');
    }

    const data = await response.json();
    
    // Sauvegarder le token dans le localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw error;
  }
};

/**
 * Déconnexion
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Récupère l'utilisateur actuellement connecté
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

/**
 * Récupère le token d'authentification
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Vérifie si l'utilisateur est connecté
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Vérifie si l'utilisateur est administrateur
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && (user.role === 'admin' || user.role === 'administrator');
};

/**
 * Demande de réinitialisation de mot de passe
 */
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la demande');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    throw error;
  }
};


