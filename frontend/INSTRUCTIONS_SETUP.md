# Instructions de Configuration - Darna Agadir

## 🚀 Démarrage Rapide

### Étape 1: Configuration de la Base de Données MySQL

1. Connectez-vous à MySQL et exécutez:
```sql
CREATE DATABASE plateforme_location_etudiants;
CREATE USER 'plateforme_user'@'localhost' IDENTIFIED BY 'ton_mot_de_passe';
GRANT ALL PRIVILEGES ON plateforme_location_etudiants.* TO 'plateforme_user'@'localhost';
FLUSH PRIVILEGES;
```

### Étape 2: Configuration Backend Laravel

1. **Créer le fichier `.env`** dans `backend-laravel/`:
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

2. **Générer la clé d'application:**
```bash
cd backend-laravel
php artisan key:generate
```

3. **Installer les dépendances:**
```bash
composer install
```

4. **Exécuter les migrations:**
```bash
php artisan migrate
```

5. **Démarrer le serveur:**
```bash
php artisan serve
```
Le serveur sera accessible sur `http://localhost:8000`

### Étape 3: Configuration Frontend React

1. **Installer les dépendances:**
```bash
# À la racine du projet frontend
npm install
```

2. **Démarrer le serveur de développement:**
```bash
npm start
```
Le serveur sera accessible sur `http://localhost:3000`

## ✅ Ce qui a été corrigé

1. ✅ Configuration MySQL dans `config/database.php`
2. ✅ Création de `MessageController` avec toutes les méthodes nécessaires
3. ✅ Création de `AdminController` avec toutes les méthodes nécessaires
4. ✅ Création du modèle `Conversation`
5. ✅ Création des migrations pour `conversations` et `messages`
6. ✅ Activation de toutes les routes API (messages et admin)
7. ✅ Ajout des méthodes `forgotPassword` et `resetPassword` dans `AuthController`
8. ✅ Uniformisation des URLs API dans tous les services frontend
9. ✅ Configuration CORS vérifiée
10. ✅ Ajout de `http-proxy-middleware` dans `package.json`

## 📝 Fichiers Créés/Modifiés

### Backend Laravel
- `app/Http/Controllers/MessageController.php` (nouveau)
- `app/Http/Controllers/AdminController.php` (nouveau)
- `app/Http/Controllers/AuthController.php` (modifié - ajout forgotPassword/resetPassword)
- `app/Models/Conversation.php` (nouveau)
- `routes/api.php` (modifié - routes activées)
- `config/database.php` (modifié - MySQL par défaut)
- `database/migrations/2025_11_28_000001_create_conversations_table.php` (nouveau)
- `database/migrations/2025_11_28_000002_create_messages_table.php` (nouveau)

### Frontend React
- `src/services/messageService.js` (modifié - URL uniformisée)
- `package.json` (modifié - ajout http-proxy-middleware)

## 🔍 Test de Connexion

Une fois les serveurs démarrés, testez la connexion:

1. **Test simple:**
   - Ouvrez `http://localhost:3000` dans votre navigateur
   - Le frontend devrait se charger

2. **Test API:**
   - Ouvrez `http://localhost:8000/api/annonces` dans votre navigateur
   - Vous devriez voir une réponse JSON (probablement vide si pas de données)

3. **Test d'inscription:**
   - Utilisez le formulaire d'inscription dans le frontend
   - Vérifiez les logs du serveur Laravel pour voir les requêtes

## ⚠️ Points Importants

1. **Fichier .env**: Vous DEVEZ créer le fichier `.env` dans `backend-laravel/` manuellement avec la configuration fournie ci-dessus.

2. **Mot de passe MySQL**: Remplacez `ton_mot_de_passe` par votre vrai mot de passe MySQL dans le fichier `.env`.

3. **Ports**: 
   - Backend: `8000`
   - Frontend: `3000`
   - Si ces ports sont occupés, modifiez-les dans les commandes de démarrage.

4. **Proxy**: Le proxy est configuré dans `setupProxy.js` pour rediriger `/api` vers `http://localhost:8000`. Assurez-vous que les deux serveurs tournent.

## 🐛 Dépannage

### Erreur "Class Conversation not found"
- Exécutez: `composer dump-autoload` dans `backend-laravel/`

### Erreur de connexion à la base de données
- Vérifiez que MySQL est démarré
- Vérifiez les credentials dans `.env`
- Vérifiez que la base de données existe

### Erreur CORS
- Vérifiez que le frontend tourne sur `http://localhost:3000`
- Vérifiez `backend-laravel/config/cors.php`

### Erreur 404 sur les routes
- Vérifiez que le serveur Laravel tourne
- Vérifiez `routes/api.php`

## 📚 Documentation

Pour plus de détails, consultez `CONFIGURATION_COMPLETE.md`.

