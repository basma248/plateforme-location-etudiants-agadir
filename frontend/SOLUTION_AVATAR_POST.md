# SOLUTION DÉFINITIVE - UPLOAD AVATAR

## Problème identifié

PHP/Laravel a des **problèmes connus** avec les requêtes **PUT** et **multipart/form-data**. Le fichier n'était jamais reçu par le backend, même si le `Content-Type` et `Content-Length` étaient corrects.

## Solution appliquée

### 1. Nouvel endpoint POST dédié

Création d'un endpoint **POST** séparé uniquement pour l'upload de l'avatar :
- **Route** : `POST /api/users/me/avatar`
- **Méthode** : `UserController::uploadAvatar()`

### 2. Modification du frontend

Le frontend utilise maintenant :
- **POST** `/api/users/me/avatar` pour l'upload de l'avatar
- **PUT** `/api/users/me` pour la mise à jour des autres champs (nom, prénom, email, téléphone)

### 3. Avantages

- ✅ **POST fonctionne parfaitement** avec `multipart/form-data`
- ✅ **Séparation des responsabilités** : upload de fichier vs mise à jour de données
- ✅ **Meilleure pratique** : endpoints dédiés pour chaque action

## Fichiers modifiés

### Backend
- `backend-laravel/routes/api.php` : Ajout de la route `POST /users/me/avatar`
- `backend-laravel/app/Http/Controllers/UserController.php` : Nouvelle méthode `uploadAvatar()`

### Frontend
- `src/services/userService.js` : Utilise maintenant `POST /users/me/avatar` pour l'upload

## Test

1. **Redémarrer le serveur React** (si nécessaire) :
   ```bash
   npm start
   ```

2. **Tester l'upload** :
   - Aller sur la page de profil
   - Sélectionner une photo
   - Cliquer sur "Enregistrer les modifications"
   - Vérifier dans la console du navigateur :
     ```
     ✅ Upload de l'avatar via endpoint POST dédié
     ⚠️ BYPASS PROXY - Utilisation directe du backend: http://localhost:8000/api
     URL complète: http://localhost:8000/api/users/me/avatar
     Méthode: POST (endpoint dédié pour l'avatar)
     ✅ Avatar uploadé avec succès
     ```

3. **Vérifier les logs Laravel** :
   ```powershell
   Get-Content backend-laravel\storage\logs\laravel.log -Tail 100 | Select-String -Pattern "uploadAvatar|AVATAR UPLOADÉ" -Context 2
   ```

   Vous devriez voir :
   ```
   === DÉBUT uploadAvatar (POST) ===
   ✅ Fichier avatar détecté, début de l'upload...
   === AVATAR UPLOADÉ ===
   ```

## Pourquoi ça fonctionne maintenant

- **POST** est la méthode HTTP standard pour l'upload de fichiers
- **PUT** avec `multipart/form-data` est mal supporté par PHP/Laravel
- L'endpoint dédié évite les conflits avec la mise à jour des autres champs

## Si le problème persiste

1. Vérifier que le serveur React a été redémarré
2. Vérifier la console du navigateur pour les erreurs CORS
3. Vérifier les logs Laravel pour voir si le fichier est reçu
4. Vérifier que le lien symbolique `storage` existe :
   ```bash
   cd backend-laravel
   php artisan storage:link
   ```

