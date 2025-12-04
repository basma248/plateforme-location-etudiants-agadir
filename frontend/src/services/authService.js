const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Connexion d'un utilisateur
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Vérifier le Content-Type avant de parser
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
      let errorMessage = 'Erreur de connexion';
      
      if (isJson) {
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch (e) {
          console.error('Erreur lors du parsing de l\'erreur:', e);
        }
      } else {
        const text = await response.text();
        console.error('Réponse non-JSON reçue:', text.substring(0, 200));
        errorMessage = `Erreur serveur (${response.status}). Vérifiez que le serveur backend est démarré.`;
      }
      
      // Si l'utilisateur est suspendu ou signalé (403), afficher un message spécifique
      if (response.status === 403) {
        try {
          const errorData = await response.json();
          if (errorData.message) {
            // Afficher le message spécifique (suspendu, signalé, etc.)
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Ignore si le parsing échoue
        }
      }
      
      throw new Error(errorMessage);
    }

    if (!isJson) {
      throw new Error('Réponse invalide du serveur. Attendu JSON, reçu autre chose.');
    }

    const data = await response.json();

    // Sauvegarder le token dans le localStorage
    if (data.data && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
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
    // Convertir les noms de champs du frontend vers le backend
    const backendData = {
      nom: userData.nom,
      prenom: userData.prenom,
      nom_utilisateur: userData.nomUtilisateur || userData.nom_utilisateur,
      email: userData.email,
      telephone: userData.telephone,
      password: userData.motDePasse || userData.password,
      password_confirmation: userData.motDePasse || userData.password,
      type_utilisateur: userData.typeUtilisateur || userData.type_utilisateur,
      cin: userData.cin,
      cne: userData.cne,
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(backendData),
    });

    // Vérifier le Content-Type avant de parser
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
      let errorMessage = 'Erreur d\'inscription';
      
      if (isJson) {
        try {
          const error = await response.json();
          if (error.errors) {
            const errorMessages = Object.values(error.errors).flat().join(', ');
            errorMessage = errorMessages || error.message || errorMessage;
          } else if (error.message) {
            errorMessage = error.message;
          }
        } catch (e) {
          console.error('Erreur lors du parsing de l\'erreur:', e);
        }
      } else {
        // Si ce n'est pas du JSON, c'est probablement une page d'erreur HTML
        const text = await response.text();
        console.error('Réponse non-JSON reçue:', text.substring(0, 200));
        errorMessage = `Erreur serveur (${response.status}). Vérifiez que le serveur backend est démarré.`;
      }
      
      throw new Error(errorMessage);
    }

    if (!isJson) {
      throw new Error('Réponse invalide du serveur. Attendu JSON, reçu autre chose.');
    }

    const data = await response.json();
    
    // Sauvegarder le token dans le localStorage
    if (data.data && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
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
 * Met à jour l'utilisateur actuellement connecté dans le localStorage
 */
export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
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
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
      let errorMessage = 'Erreur lors de la demande de réinitialisation';
      
      if (isJson) {
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch (e) {
          console.error('Erreur lors du parsing de l\'erreur:', e);
        }
      }
      
      throw new Error(errorMessage);
    }

    if (!isJson) {
      throw new Error('Réponse invalide du serveur');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    throw error;
  }
};

/**
 * Réinitialisation du mot de passe avec token
 */
export const resetPassword = async (email, token, password, passwordConfirmation) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
      let errorMessage = 'Erreur lors de la réinitialisation';
      
      if (isJson) {
        try {
          const error = await response.json();
          if (error.errors) {
            const errorMessages = Object.values(error.errors).flat().join(', ');
            errorMessage = errorMessages || error.message || errorMessage;
          } else if (error.message) {
            errorMessage = error.message;
          }
        } catch (e) {
          console.error('Erreur lors du parsing de l\'erreur:', e);
        }
      }
      
      throw new Error(errorMessage);
    }

    if (!isJson) {
      throw new Error('Réponse invalide du serveur');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    throw error;
  }
};


