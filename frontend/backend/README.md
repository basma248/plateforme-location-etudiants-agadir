# 🚀 Backend - Guide de Démarrage Rapide

## 📋 Prérequis

- Node.js 14+ installé
- MySQL 5.7+ installé et démarré
- Base de données créée (voir `database/schema.sql`)

---

## ⚡ Installation Rapide

### 1. Installer les dépendances

```bash
cd backend
npm init -y
npm install express mysql2 bcrypt jsonwebtoken cors dotenv
npm install --save-dev nodemon
```

### 2. Configurer l'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env et remplir vos informations
# DB_PASSWORD=votre_mot_de_passe_mysql
# JWT_SECRET=votre_secret_securise
```

### 3. Tester la connexion

```bash
node test-connection.js
```

Vous devriez voir :
```
✅ Connexion à la base de données réussie !
✅ 13 tables trouvées
```

### 4. Créer l'utilisateur admin

```bash
node scripts/createAdmin.js
```

### 5. Démarrer le serveur

```bash
# Mode développement (avec nodemon)
npm run dev

# Ou mode production
node server.js
```

---

## 📁 Structure du Projet

```
backend/
├── config/
│   └── database.js          # Configuration DB
├── scripts/
│   └── createAdmin.js       # Script création admin
├── routes/                  # Routes API (à créer)
├── controllers/             # Contrôleurs (à créer)
├── models/                  # Modèles (à créer)
├── middleware/              # Middlewares (à créer)
├── .env                     # Variables d'environnement
├── .env.example             # Exemple de configuration
├── server.js                # Serveur principal (à créer)
├── test-connection.js       # Test de connexion
└── package.json
```

---

## 🔧 Commandes Utiles

```bash
# Tester la connexion
node test-connection.js

# Créer l'admin
node scripts/createAdmin.js

# Démarrer le serveur
npm start

# Mode développement (avec auto-reload)
npm run dev
```

---

## 📝 Prochaines Étapes

1. ✅ Base de données créée
2. ✅ Connexion testée
3. ✅ Admin créé
4. ⏭️ Créer les routes API
5. ⏭️ Créer les contrôleurs
6. ⏭️ Implémenter l'authentification
7. ⏭️ Tester avec le frontend

---

## 🐛 Dépannage

Voir `database/GUIDE_COMPLET.md` pour plus de détails.

---

## 📚 Documentation

- `database/README.md` - Structure de la base de données
- `database/INSTALLATION.md` - Guide d'installation
- `database/GUIDE_COMPLET.md` - Guide complet pas à pas


