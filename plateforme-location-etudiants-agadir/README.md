# Plateforme Location Étudiants Agadir

## Description
Ce projet est une plateforme dédiée à la gestion de logements pour étudiants à Agadir. Elle permet aux utilisateurs de se connecter, de s'inscrire et de récupérer leur mot de passe via une interface conviviale.

## Structure du Projet
Le projet est structuré comme suit :

```
plateforme-location-etudiants-agadir
├── public
│   └── index.html          # Fichier HTML principal
├── src
│   ├── index.js           # Point d'entrée de l'application React
│   ├── App.js             # Composant principal de l'application
│   ├── routes
│   │   └── AppRoutes.js   # Logique de routage de l'application
│   ├── pages
│   │   ├── AuthEntry.jsx  # Page d'entrée d'authentification
│   │   ├── Login.jsx      # Page de connexion
│   │   ├── Register.jsx   # Page d'inscription
│   │   └── ForgotPassword.jsx # Page de récupération de mot de passe
│   ├── components
│   │   ├── AuthCard.jsx    # Composant pour structurer les formulaires d'authentification
│   │   └── Header.jsx      # Composant d'en-tête de l'application
│   ├── context
│   │   └── AuthContext.jsx # Contexte d'authentification
│   ├── hooks
│   │   └── useAuth.js      # Hook personnalisé pour l'authentification
│   ├── styles
│   │   └── auth.css        # Styles CSS pour les pages d'authentification
│   └── utils
│       └── navigation.js    # Utilitaires pour la navigation
├── package.json            # Fichier de configuration npm
├── .gitignore              # Fichiers à ignorer par Git
└── README.md               # Documentation du projet
```

## Installation
1. Clonez le dépôt :
   ```bash
   git clone <url-du-dépôt>
   ```
2. Accédez au répertoire du projet :
   ```bash
   cd plateforme-location-etudiants-agadir
   ```
3. Installez les dépendances :
   ```bash
   npm install
   ```

## Démarrage
Pour démarrer l'application en mode développement, utilisez la commande suivante :
```bash
npm start
```
L'application sera accessible à l'adresse `http://localhost:3000`.

## Fonctionnalités
- Authentification des utilisateurs (connexion, inscription, récupération de mot de passe).
- Interface utilisateur réactive et conviviale.
- Gestion des sessions utilisateur.

## Contribuer
Les contributions sont les bienvenues ! Veuillez soumettre une demande de tirage pour toute amélioration ou correction de bogue.

## License
Ce projet est sous licence MIT.