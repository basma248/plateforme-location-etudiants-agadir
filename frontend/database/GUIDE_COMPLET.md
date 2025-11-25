# 📘 Guide Complet - Installation et Configuration

## 🎯 Objectif
Ce guide vous accompagne étape par étape pour :
1. ✅ Créer la base de données MySQL
2. ✅ Créer un utilisateur admin
3. ✅ Configurer le backend
4. ✅ Tester les endpoints

---

## 📋 ÉTAPE 1 : Exécuter schema.sql

### Option A : Via Terminal/CMD (Windows)

```bash
# 1. Ouvrir CMD ou PowerShell
# 2. Naviguer vers le dossier du projet
cd C:\Users\Admin\plateforme-location-etudiants-agadir

# 3. Se connecter à MySQL et exécuter le script
mysql -u root -p < database\schema.sql

# Entrer votre mot de passe MySQL quand demandé
```

### Option B : Via MySQL en ligne de commande

```bash
# 1. Ouvrir MySQL
mysql -u root -p

# 2. Dans MySQL, exécuter :
source database/schema.sql

# Ou copier-coller le contenu du fichier
```

### Option C : Via MySQL Workbench (Recommandé pour débutants)

1. **Ouvrir MySQL Workbench**
2. **Se connecter** à votre serveur MySQL (localhost)
3. **Ouvrir le fichier** : `database/schema.sql`
4. **Sélectionner tout** (Ctrl+A)
5. **Exécuter** (⚡ bouton ou F9)

### ✅ Vérification

```sql
-- Dans MySQL, exécuter :
USE plateforme_location_etudiants;
SHOW TABLES;

-- Vous devriez voir 13 tables :
-- admin_actions, annonce_avis, annonce_equipements, annonce_images,
-- annonce_regles, annonce_reports, annonces, conversations, messages,
-- password_reset_tokens, user_favorites, user_reports, users
```

---

## 👤 ÉTAPE 2 : Créer un Utilisateur Admin

### Méthode 1 : Via Node.js (Recommandé)

Créez un fichier `backend/scripts/createAdmin.js` :

```javascript
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function createAdmin() {
  // Configuration de la connexion
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'votre_mot_de_passe_mysql',
    database: 'plateforme_location_etudiants'
  });

  // Données de l'admin
  const adminData = {
    nom: 'Admin',
    prenom: 'Système',
    email: 'admin@plateforme.ma',
    telephone: '+212 6 00 00 00 00',
    nom_utilisateur: 'admin',
    mot_de_passe: 'admin123', // À changer en production !
    type_utilisateur: 'loueur',
    role: 'admin',
    email_verifie: true
  };

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(adminData.mot_de_passe, 10);

  // Insérer dans la base de données
  try {
    const [result] = await connection.execute(
      `INSERT INTO users (
        nom, prenom, email, telephone, nom_utilisateur, 
        mot_de_passe, type_utilisateur, role, email_verifie
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        adminData.nom,
        adminData.prenom,
        adminData.email,
        adminData.telephone,
        adminData.nom_utilisateur,
        hashedPassword,
        adminData.type_utilisateur,
        adminData.role,
        adminData.email_verifie
      ]
    );

    console.log('✅ Utilisateur admin créé avec succès !');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Mot de passe:', adminData.mot_de_passe);
    console.log('⚠️  N\'oubliez pas de changer le mot de passe en production !');

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('⚠️  L\'utilisateur admin existe déjà.');
    } else {
      console.error('❌ Erreur:', error.message);
    }
  }

  await connection.end();
}

// Exécuter
createAdmin();
```

**Exécuter le script :**
```bash
cd backend
node scripts/createAdmin.js
```

### Méthode 2 : Via SQL Direct (Si vous avez déjà un hash bcrypt)

```sql
USE plateforme_location_etudiants;

-- Remplacez 'VOTRE_HASH_BCRYPT' par un hash généré avec bcrypt
-- Pour générer un hash, utilisez Node.js :
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('admin123', 10);
-- console.log(hash);

INSERT INTO users (
    nom, prenom, email, telephone, nom_utilisateur, 
    mot_de_passe, type_utilisateur, role, email_verifie
) VALUES (
    'Admin', 'Système', 'admin@plateforme.ma', '+212 6 00 00 00 00',
    'admin', '$2b$10$VOTRE_HASH_BCRYPT_ICI', 'loueur', 'admin', TRUE
);
```

### Méthode 3 : Via l'Application (Après création du backend)

1. Créer un compte normal via `/auth/register`
2. Modifier le rôle en admin dans MySQL :

```sql
UPDATE users SET role = 'admin' WHERE email = 'votre-email@example.com';
```

---

## ⚙️ ÉTAPE 3 : Configurer la Connexion Backend

### Pour Node.js/Express

#### 1. Installer les dépendances

```bash
cd backend
npm install mysql2 bcrypt jsonwebtoken dotenv
```

#### 2. Créer le fichier `.env`

```env
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=plateforme_location_etudiants
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise_changez_moi
JWT_EXPIRES_IN=7d

# API
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:3000
```

#### 3. Créer le fichier de configuration `backend/config/database.js`

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'plateforme_location_etudiants',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test de connexion
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion à la base de données réussie !');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};
```

#### 4. Créer le fichier principal `backend/server.js`

```javascript
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API Plateforme Location Étudiants Agadir' });
});

// Route de test de connexion
app.get('/api/test-db', async (req, res) => {
  const isConnected = await testConnection();
  res.json({ 
    status: isConnected ? 'connected' : 'disconnected',
    message: isConnected ? 'Base de données connectée' : 'Erreur de connexion'
  });
});

// Démarrer le serveur
app.listen(PORT, async () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  await testConnection();
});
```

#### 5. Tester la connexion

```bash
# Démarrer le serveur
node server.js

# Dans un autre terminal, tester :
curl http://localhost:5000/api/test-db
```

Vous devriez voir :
```json
{
  "status": "connected",
  "message": "Base de données connectée"
}
```

---

## 🧪 ÉTAPE 4 : Tester les Endpoints

### Créer un fichier de test `backend/test-endpoints.js`

```javascript
const { pool } = require('./config/database');

async function testEndpoints() {
  try {
    console.log('🧪 Test des endpoints...\n');

    // Test 1: Récupérer tous les utilisateurs
    console.log('1️⃣ Test: GET /users');
    const [users] = await pool.execute('SELECT id, nom, email, role FROM users LIMIT 5');
    console.log('✅ Utilisateurs trouvés:', users.length);
    console.log(users);
    console.log('');

    // Test 2: Récupérer toutes les annonces
    console.log('2️⃣ Test: GET /annonces');
    const [annonces] = await pool.execute('SELECT id, titre, prix, statut FROM annonces LIMIT 5');
    console.log('✅ Annonces trouvées:', annonces.length);
    console.log(annonces);
    console.log('');

    // Test 3: Vérifier l'utilisateur admin
    console.log('3️⃣ Test: Vérifier admin');
    const [admins] = await pool.execute(
      'SELECT id, nom, email, role FROM users WHERE role = ?',
      ['admin']
    );
    console.log('✅ Admins trouvés:', admins.length);
    console.log(admins);
    console.log('');

    // Test 4: Compter les tables
    console.log('4️⃣ Test: Vérifier les tables');
    const [tables] = await pool.execute('SHOW TABLES');
    console.log('✅ Tables trouvées:', tables.length);
    console.log('Tables:', tables.map(t => Object.values(t)[0]));
    console.log('');

    console.log('✅ Tous les tests sont passés !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  } finally {
    await pool.end();
  }
}

testEndpoints();
```

**Exécuter :**
```bash
node test-endpoints.js
```

### Tester avec Postman ou cURL

#### 1. Test de connexion
```bash
curl http://localhost:5000/api/test-db
```

#### 2. Test de création d'utilisateur (si endpoint créé)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "User",
    "email": "test@example.com",
    "telephone": "+212 6 12 34 56 78",
    "nomUtilisateur": "testuser",
    "motDePasse": "password123",
    "typeUtilisateur": "etudiant",
    "cin": "TE123456",
    "cne": "CNE123456"
  }'
```

#### 3. Test de login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@plateforme.ma",
    "password": "admin123"
  }'
```

---

## 📝 Checklist Complète

### ✅ Base de données
- [ ] MySQL installé et démarré
- [ ] Script `schema.sql` exécuté
- [ ] 13 tables créées
- [ ] Vérification avec `SHOW TABLES`

### ✅ Utilisateur Admin
- [ ] Script de création exécuté
- [ ] Admin créé avec email et mot de passe
- [ ] Vérification dans la table `users`

### ✅ Backend
- [ ] Dépendances installées (`mysql2`, `bcrypt`, etc.)
- [ ] Fichier `.env` créé avec les bonnes valeurs
- [ ] Fichier `config/database.js` créé
- [ ] Connexion testée et fonctionnelle

### ✅ Tests
- [ ] Test de connexion réussi
- [ ] Test des requêtes SQL réussi
- [ ] Endpoints répondent correctement

---

## 🐛 Dépannage

### Erreur: "Access denied for user"
- Vérifiez le mot de passe dans `.env`
- Vérifiez que l'utilisateur MySQL existe

### Erreur: "Unknown database"
- Exécutez `schema.sql` pour créer la base
- Vérifiez le nom de la base dans `.env`

### Erreur: "Table doesn't exist"
- Vérifiez que toutes les tables sont créées
- Réexécutez `schema.sql`

### Erreur: "Cannot connect to MySQL"
- Vérifiez que MySQL est démarré
- Vérifiez le port (3306 par défaut)
- Vérifiez les paramètres dans `.env`

---

## 🎉 C'est Prêt !

Une fois toutes les étapes terminées, vous pouvez :
1. ✅ Démarrer votre backend
2. ✅ Connecter le frontend
3. ✅ Tester l'application complète

Pour plus d'aide, consultez les autres fichiers dans le dossier `database/`.


