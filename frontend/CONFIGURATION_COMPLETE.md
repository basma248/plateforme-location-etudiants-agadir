# Configuration Complète - Darna Agadir

## ✅ Modifications Effectuées

### 1. Backend Laravel

#### Configuration de la Base de Données
- ✅ Configuration MySQL mise à jour dans `config/database.php`
- ⚠️ **IMPORTANT**: Créer le fichier `.env` dans `backend-laravel/` avec la configuration suivante:

```env
APP_NAME="Darna Agadir"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=plateforme_location_etudiants
DB_USERNAME=plateforme_user
DB_PASSWORD=ton_mot_de_passe
```

**Pour générer la clé d'application:**
```bash
cd backend-laravel
php artisan key:generate
```

#### Contrôleurs Créés
- ✅ `MessageController.php` - Gestion des messages et conversations
- ✅ `AdminController.php` - Gestion administrative

#### Modèles Créés
- ✅ `Conversation.php` - Modèle pour les conversations

#### Migrations Créées
- ✅ `2025_11_28_000001_create_conversations_table.php`
- ✅ `2025_11_28_000002_create_messages_table.php`

#### Routes API Activées
- ✅ Routes de messages: `/api/messages/*`
- ✅ Routes d'administration: `/api/admin/*`
- ✅ Méthodes `forgotPassword` et `resetPassword` ajoutées à `AuthController`

### 2. Frontend React

#### Services Mis à Jour
- ✅ `messageService.js` - URL API uniformisée avec les autres services
- ✅ Tous les services utilisent maintenant `/api` (via proxy) ou `REACT_APP_API_URL`

#### Configuration Proxy
- ✅ `setupProxy.js` configuré pour rediriger `/api` vers `http://localhost:8000`

### 3. CORS
- ✅ Configuration CORS vérifiée dans `backend-laravel/config/cors.php`
- ✅ Autorise les requêtes depuis `http://localhost:3000` et `http://127.0.0.1:3000`

## 📋 Étapes de Configuration

### 1. Configuration de la Base de Données

1. Créer la base de données MySQL:
```sql
CREATE DATABASE plateforme_location_etudiants;
CREATE USER 'plateforme_user'@'localhost' IDENTIFIED BY 'ton_mot_de_passe';
GRANT ALL PRIVILEGES ON plateforme_location_etudiants.* TO 'plateforme_user'@'localhost';
FLUSH PRIVILEGES;
```

2. Créer le fichier `.env` dans `backend-laravel/` (voir configuration ci-dessus)

3. Générer la clé d'application:
```bash
cd backend-laravel
php artisan key:generate
```

4. Exécuter les migrations:
```bash
php artisan migrate
```

### 2. Installation des Dépendances

#### Backend
```bash
cd backend-laravel
composer install
```

#### Frontend
```bash
# À la racine du projet frontend
npm install

# Installer http-proxy-middleware si nécessaire
npm install --save-dev http-proxy-middleware
```

### 3. Démarrage des Serveurs

#### Backend Laravel
```bash
cd backend-laravel
php artisan serve
# Le serveur sera accessible sur http://localhost:8000
```

#### Frontend React
```bash
# À la racine du projet frontend
npm start
# Le serveur sera accessible sur http://localhost:3000
```

## 🔍 Vérification de la Connexion

### Test des Endpoints API

1. **Test de connexion basique:**
```bash
curl http://localhost:8000/api/auth/login
```

2. **Test avec données:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "User",
    "nom_utilisateur": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "type_utilisateur": "etudiant",
    "cin": "AB123456"
  }'
```

## 📝 Notes Importantes

1. **Fichier .env**: Le fichier `.env` pour Laravel doit être créé manuellement car il est dans `.gitignore`. Utilisez la configuration fournie ci-dessus.

2. **Proxy React**: Le proxy est configuré dans `setupProxy.js`. Assurez-vous que `http-proxy-middleware` est installé.

3. **CORS**: La configuration CORS est déjà en place. Si vous avez des problèmes, vérifiez que le frontend tourne sur le port 3000.

4. **Sanctum**: L'authentification utilise Laravel Sanctum. Les tokens sont gérés automatiquement.

5. **Migrations**: N'oubliez pas d'exécuter les migrations pour créer les tables `conversations` et `messages`.

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifiez que MySQL est démarré
- Vérifiez les credentials dans `.env`
- Vérifiez que la base de données existe

### Erreur CORS
- Vérifiez que le frontend tourne sur `http://localhost:3000`
- Vérifiez la configuration dans `backend-laravel/config/cors.php`

### Erreur 404 sur les routes API
- Vérifiez que le serveur Laravel tourne sur le port 8000
- Vérifiez que les routes sont bien définies dans `routes/api.php`

### Erreur de proxy
- Vérifiez que `http-proxy-middleware` est installé
- Vérifiez la configuration dans `setupProxy.js`

## 📚 Structure des Routes API

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `POST /api/auth/forgot-password` - Mot de passe oublié
- `POST /api/auth/reset-password` - Réinitialisation
- `POST /api/auth/logout` - Déconnexion (protégé)
- `GET /api/auth/user` - Utilisateur actuel (protégé)

### Annonces
- `GET /api/annonces` - Liste des annonces (public)
- `GET /api/annonces/{id}` - Détails d'une annonce (public)
- `POST /api/annonces` - Créer une annonce (protégé)
- `PUT /api/annonces/{id}` - Modifier une annonce (protégé)
- `DELETE /api/annonces/{id}` - Supprimer une annonce (protégé)

### Messages
- `GET /api/messages/conversations` - Liste des conversations (protégé)
- `GET /api/messages/annonce/{annonceId}` - Messages d'une annonce (protégé)
- `POST /api/messages` - Envoyer un message (protégé)

### Administration
- `GET /api/admin/stats` - Statistiques (admin)
- `GET /api/admin/annonces` - Toutes les annonces (admin)
- `POST /api/admin/annonces/{id}/moderate` - Modérer une annonce (admin)
- `GET /api/admin/users` - Tous les utilisateurs (admin)
- Et plus...

