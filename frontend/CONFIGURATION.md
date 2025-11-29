# Configuration Frontend-Backend - Darna Agadir

## 📋 Problèmes corrigés

### 1. Routes API
- ✅ **GET /annonces** et **GET /annonces/{id}** sont maintenant publiques (consultation sans authentification)
- ✅ Les routes de modification (POST, PUT, DELETE) restent protégées par `auth:sanctum`

### 2. Authentification
- ✅ Correction de la méthode `login()` dans `AuthController` pour utiliser le champ `mot_de_passe` au lieu de `password`
- ✅ Correction du format de réponse dans `authService.js` pour correspondre au backend (`data.data.token`)
- ✅ Conversion automatique des noms de champs frontend → backend dans `register()`:
  - `nomUtilisateur` → `nom_utilisateur`
  - `motDePasse` → `password`
  - `typeUtilisateur` → `type_utilisateur`

### 3. Format de réponse
- ✅ Correction de `annonceService.js` pour extraire `data.data` des réponses du backend
- ✅ Gestion de la pagination pour les listes d'annonces

### 4. Filtres
- ✅ Conversion automatique des noms de champs dans les filtres:
  - `prixMin` → `prix_min`
  - `prixMax` → `prix_max`
  - `surfaceMin` → `surface_min`
  - `nbChambres` → `nb_chambres`

### 5. Configuration Base de Données
- ✅ Création du fichier `.env.example` avec la configuration MySQL fournie

## 🚀 Installation et Configuration

### Backend (Laravel)

1. **Créer le fichier `.env`** dans `backend-laravel/`:
   ```bash
   cd backend-laravel
   cp .env.example .env
   ```

2. **Modifier le fichier `.env`** avec vos informations de base de données:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=plateforme_location_etudiants
   DB_USERNAME=plateforme_user
   DB_PASSWORD=ton_mot_de_passe
   ```

3. **Générer la clé d'application**:
   ```bash
   php artisan key:generate
   ```

4. **Exécuter les migrations**:
   ```bash
   php artisan migrate
   ```

5. **Démarrer le serveur Laravel**:
   ```bash
   php artisan serve
   ```
   Le serveur sera accessible sur `http://localhost:8000`

### Frontend (React)

1. **Créer le fichier `.env`** à la racine du projet frontend:
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   ```

2. **Installer les dépendances** (si nécessaire):
   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement**:
   ```bash
   npm start
   ```
   Le frontend sera accessible sur `http://localhost:3000`

## 🔧 Configuration CORS

La configuration CORS est déjà configurée dans `backend-laravel/config/cors.php`:
- Origines autorisées: `http://localhost:3000` et `http://127.0.0.1:3000`
- Méthodes autorisées: Toutes (`*`)
- Headers autorisés: Tous (`*`)
- Credentials: Activés

## 📡 Endpoints API

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/forgot-password` - Mot de passe oublié
- `POST /api/auth/logout` - Déconnexion (protégé)
- `GET /api/auth/user` - Utilisateur connecté (protégé)

### Annonces
- `GET /api/annonces` - Liste des annonces (public)
- `GET /api/annonces/{id}` - Détails d'une annonce (public)
- `POST /api/annonces` - Créer une annonce (protégé)
- `PUT /api/annonces/{id}` - Modifier une annonce (protégé)
- `DELETE /api/annonces/{id}` - Supprimer une annonce (protégé)
- `POST /api/annonces/{id}/favorite` - Ajouter/Retirer des favoris (protégé)
- `GET /api/annonces/favorites/list` - Liste des favoris (protégé)

## 🔐 Authentification

L'authentification utilise Laravel Sanctum avec des tokens Bearer.

### Format de réponse Login/Register
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": 1,
      "nom": "Benali",
      "prenom": "Ahmed",
      "email": "ahmed@example.com",
      "role": "user"
    },
    "token": "1|xxxxxxxxxxxx",
    "token_type": "Bearer"
  }
}
```

### Utilisation du token
Tous les appels API protégés doivent inclure le header:
```
Authorization: Bearer <token>
```

Le token est stocké dans `localStorage` avec la clé `token`.

## ⚠️ Notes importantes

1. **Mot de passe**: Le backend utilise le champ `mot_de_passe` au lieu de `password`. La méthode `getAuthPassword()` dans le modèle `User` gère cette conversion.

2. **Format de réponse**: Le backend retourne toujours `{success: true/false, data: {...}, message: "..."}`. Les services frontend extraient automatiquement `data.data` quand nécessaire.

3. **Pagination**: Les listes d'annonces retournent un objet paginé Laravel avec la structure:
   ```json
   {
     "data": [...],
     "current_page": 1,
     "per_page": 12,
     "total": 50,
     ...
   }
   ```

4. **Filtres**: Les filtres doivent utiliser les noms de champs du backend (snake_case). Le service `annonceService.js` convertit automatiquement les noms camelCase du frontend.

## 🐛 Dépannage

### Erreur CORS
Si vous rencontrez des erreurs CORS:
1. Vérifiez que le frontend tourne sur `http://localhost:3000`
2. Vérifiez la configuration dans `backend-laravel/config/cors.php`
3. Videz le cache Laravel: `php artisan config:clear`

### Erreur de connexion à la base de données
1. Vérifiez que MySQL est démarré
2. Vérifiez les credentials dans `.env`
3. Testez la connexion: `php artisan tinker` puis `DB::connection()->getPdo();`

### Erreur d'authentification
1. Vérifiez que le token est bien envoyé dans les headers
2. Vérifiez que le token n'est pas expiré
3. Vérifiez que Sanctum est bien configuré: `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`

