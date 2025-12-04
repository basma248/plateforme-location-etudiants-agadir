# 🚀 Instructions : Démarrer le Backend Laravel

## 📍 Localisation du Backend

Le backend Laravel devrait être dans un dossier comme :
- `backend-laravel`
- `backend`
- Ou à la racine du projet

## 🔍 Trouver le Backend

Cherchez le fichier **`artisan`** - c'est le fichier principal de Laravel.

## 🎯 Méthode 1 : Script automatique (RECOMMANDÉ)

```bash
.\DEMARRER_BACKEND_LARAVEL.bat
```

Ce script va :
1. Trouver automatiquement le backend Laravel
2. Vérifier que PHP est installé
3. Démarrer le serveur sur http://localhost:8000

## 🎯 Méthode 2 : Commande manuelle

1. **Ouvrir un nouveau terminal**
2. **Aller dans le dossier backend** :
   ```bash
   cd C:\Users\Admin\plateforme-location-etudiants-agadir\backend-laravel
   ```
   (Ajustez le chemin selon votre structure)

3. **Démarrer le serveur** :
   ```bash
   php artisan serve
   ```

4. **Vous devriez voir** :
   ```
   Laravel development server started: http://127.0.0.1:8000
   ```

## 🎯 Méthode 3 : Démarrer Frontend + Backend ensemble

```bash
.\DEMARRER_FRONTEND_ET_BACKEND.bat
```

Ce script va :
1. Construire le frontend
2. Démarrer le backend dans un nouveau terminal
3. Démarrer le frontend avec le proxy

## ⚠️ Vérifications

### 1. PHP est installé ?

```bash
php --version
```

**Si ça ne fonctionne pas** :
- Installez PHP : https://www.php.net/downloads.php
- Ou utilisez XAMPP/WAMP qui inclut PHP

### 2. Le backend existe ?

```bash
# Chercher le fichier artisan
dir /s artisan
```

### 3. Les dépendances sont installées ?

Dans le dossier backend :

```bash
composer install
```

## 🔧 Si le backend ne démarre pas

### Erreur : "PHP n'est pas reconnu"

**Solution** : Installez PHP ou ajoutez-le au PATH

### Erreur : "artisan n'existe pas"

**Solution** : Vérifiez que vous êtes dans le bon dossier (celui qui contient `artisan`)

### Erreur : "Port 8000 déjà utilisé"

**Solution** : Utilisez un autre port :
```bash
php artisan serve --port=8001
```

Puis modifiez `serve-with-proxy.js` pour utiliser le port 8001.

## ✅ Vérification que le backend fonctionne

Une fois démarré, ouvrez dans votre navigateur :

```
http://localhost:8000
```

Vous devriez voir la page d'accueil Laravel ou votre API.

## 📝 Ordre de démarrage

1. **D'abord** : Démarrer le backend Laravel
   ```bash
   php artisan serve
   ```

2. **Ensuite** : Démarrer le frontend
   ```bash
   npm run build
   node serve-with-proxy.js
   ```

## 🎯 Solution complète

**Terminal 1 - Backend** :
```bash
cd C:\Users\Admin\plateforme-location-etudiants-agadir\backend-laravel
php artisan serve
```

**Terminal 2 - Frontend** :
```bash
cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend
npm run build
node serve-with-proxy.js
```

**Ou utilisez le script automatique** :
```bash
.\DEMARRER_FRONTEND_ET_BACKEND.bat
```


