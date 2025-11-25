# 🚀 Guide de Démarrage Rapide - Tout en Un

## 📋 Vue d'ensemble

Ce guide vous accompagne pour mettre en place **toute l'application** en 4 étapes simples.

---

## ✅ ÉTAPE 1 : Créer la Base de Données MySQL

### Méthode Simple (Recommandée)

1. **Ouvrir MySQL Workbench** (ou ligne de commande MySQL)

2. **Exécuter le script** :
   - Ouvrir le fichier : `database/schema.sql`
   - Exécuter tout le script (F9 ou bouton ⚡)

3. **Vérifier** :
   ```sql
   USE plateforme_location_etudiants;
   SHOW TABLES;
   ```
   Vous devriez voir **13 tables**.

### Méthode Ligne de Commande

```bash
# Windows (CMD)
mysql -u root -p < database\schema.sql

# Linux/Mac
mysql -u root -p < database/schema.sql
```

**✅ Résultat attendu :** Base de données créée avec 13 tables.

---

## ✅ ÉTAPE 2 : Configurer le Backend

### 1. Installer Node.js (si pas déjà fait)

Télécharger depuis : https://nodejs.org/

### 2. Créer le dossier backend (si pas déjà fait)

```bash
cd C:\Users\Admin\plateforme-location-etudiants-agadir
mkdir backend
cd backend
```

### 3. Initialiser le projet

```bash
npm init -y
```

### 4. Installer les dépendances

```bash
npm install express mysql2 bcrypt jsonwebtoken cors dotenv
npm install --save-dev nodemon
```

### 5. Créer le fichier `.env`

Créer un fichier `.env` dans le dossier `backend/` avec ce contenu :

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=plateforme_location_etudiants
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
JWT_SECRET=mon_secret_jwt_tres_securise_123456
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**⚠️ Important :** Remplacez `votre_mot_de_passe_mysql` par votre vrai mot de passe MySQL.

### 6. Copier les fichiers de configuration

Les fichiers suivants ont déjà été créés :
- `backend/config/database.js` ✅
- `backend/scripts/createAdmin.js` ✅
- `backend/test-connection.js` ✅

### 7. Tester la connexion

```bash
node test-connection.js
```

**✅ Résultat attendu :**
```
✅ Connexion à la base de données réussie !
✅ 13 tables trouvées
```

---

## ✅ ÉTAPE 3 : Créer l'Utilisateur Admin

### Exécuter le script

```bash
node scripts/createAdmin.js
```

**✅ Résultat attendu :**
```
✅ Utilisateur admin créé avec succès !
📧 Email: admin@plateforme.ma
🔑 Mot de passe: admin123
```

**⚠️ Important :** Notez ces identifiants, vous en aurez besoin pour vous connecter.

---

## ✅ ÉTAPE 4 : Tester les Endpoints

### Créer un serveur de test simple

Créer `backend/server.js` :

```javascript
const express = require('express');
const cors = require('cors');
const { testConnection, query } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Plateforme Location Étudiants Agadir',
    status: 'running'
  });
});

// Test de connexion DB
app.get('/api/test-db', async (req, res) => {
  const isConnected = await testConnection();
  res.json({ 
    status: isConnected ? 'connected' : 'disconnected',
    message: isConnected ? 'Base de données connectée' : 'Erreur de connexion'
  });
});

// Test: Récupérer les utilisateurs
app.get('/api/test-users', async (req, res) => {
  try {
    const users = await query('SELECT id, nom, email, role FROM users LIMIT 10');
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Démarrer le serveur
app.listen(PORT, async () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  await testConnection();
});
```

### Démarrer le serveur

```bash
node server.js
```

### Tester avec le navigateur

Ouvrir dans votre navigateur :
- http://localhost:5000/
- http://localhost:5000/api/test-db
- http://localhost:5000/api/test-users

### Tester avec cURL (optionnel)

```bash
# Test 1
curl http://localhost:5000/

# Test 2
curl http://localhost:5000/api/test-db

# Test 3
curl http://localhost:5000/api/test-users
```

**✅ Résultat attendu :** Réponses JSON avec les données.

---

## 📝 Checklist Finale

Vérifiez que tout fonctionne :

- [ ] ✅ Base de données créée (13 tables)
- [ ] ✅ Backend configuré (dépendances installées)
- [ ] ✅ Fichier `.env` créé et configuré
- [ ] ✅ Connexion DB testée et réussie
- [ ] ✅ Utilisateur admin créé
- [ ] ✅ Serveur démarre sans erreur
- [ ] ✅ Endpoints répondent correctement

---

## 🎉 Félicitations !

Votre backend est maintenant **prêt** ! Vous pouvez :

1. ✅ Créer les routes API complètes
2. ✅ Implémenter l'authentification
3. ✅ Connecter le frontend
4. ✅ Tester l'application complète

---

## 📚 Prochaines Étapes

Consultez les fichiers suivants pour continuer :

- `database/GUIDE_COMPLET.md` - Guide détaillé pas à pas
- `backend/README.md` - Documentation du backend
- `API_ENDPOINTS.md` - Liste des endpoints à implémenter

---

## 🐛 Besoin d'Aide ?

### Erreur: "Cannot find module"
```bash
# Réinstaller les dépendances
npm install
```

### Erreur: "Access denied"
- Vérifiez le mot de passe MySQL dans `.env`
- Vérifiez que MySQL est démarré

### Erreur: "Database doesn't exist"
- Exécutez `database/schema.sql` pour créer la base

---

## 🚀 C'est Parti !

Vous êtes maintenant prêt à développer votre application complète ! 🎊


