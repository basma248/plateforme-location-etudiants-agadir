# 🚀 Guide d'Installation de la Base de Données

## 📋 Prérequis

- MySQL 5.7+ ou MariaDB 10.3+
- Accès root ou utilisateur avec privilèges CREATE DATABASE

---

## ⚡ Installation Rapide

### Option 1: Via ligne de commande

```bash
# 1. Se connecter à MySQL
mysql -u root -p

# 2. Exécuter le script de création
source database/schema.sql

# 3. (Optionnel) Ajouter des données d'exemple
source database/sample_data.sql
```

### Option 2: Via fichier SQL

```bash
# Créer la base de données et les tables
mysql -u root -p < database/schema.sql

# (Optionnel) Ajouter des données d'exemple
mysql -u root -p plateforme_location_etudiants < database/sample_data.sql
```

### Option 3: Via MySQL Workbench

1. Ouvrir MySQL Workbench
2. Se connecter à votre serveur MySQL
3. Ouvrir le fichier `database/schema.sql`
4. Exécuter le script (⚡ bouton)
5. (Optionnel) Ouvrir et exécuter `database/sample_data.sql`

---

## ✅ Vérification

Après l'installation, vérifiez que tout est correct:

```sql
USE plateforme_location_etudiants;

-- Vérifier les tables
SHOW TABLES;

-- Vérifier la structure d'une table
DESCRIBE users;
DESCRIBE annonces;

-- Compter les enregistrements
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM annonces;
```

Vous devriez voir:
- **13 tables** créées
- **0 utilisateurs** (ou plus si vous avez ajouté les données d'exemple)
- **0 annonces** (ou plus si vous avez ajouté les données d'exemple)

---

## 👤 Créer un Utilisateur Admin

### Méthode 1: Via SQL (avec mot de passe hashé)

```sql
USE plateforme_location_etudiants;

-- Remplacez 'VotreMotDePasseHashé' par un hash bcrypt
-- Vous pouvez générer un hash avec Node.js:
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('admin123', 10);

INSERT INTO users (
    nom, prenom, email, telephone, nom_utilisateur, 
    mot_de_passe, type_utilisateur, role, email_verifie
) VALUES (
    'Admin', 'Système', 'admin@plateforme.ma', '+212 6 00 00 00 00',
    'admin', '$2b$10$VotreHashBcryptIci', 'loueur', 'admin', TRUE
);
```

### Méthode 2: Via l'application (recommandé)

1. Démarrer votre application backend
2. Utiliser l'endpoint `/auth/register` pour créer un compte
3. Modifier manuellement le rôle en `admin` dans la base de données:

```sql
UPDATE users SET role = 'admin' WHERE email = 'votre-email@example.com';
```

---

## 🔧 Configuration Backend

Dans votre fichier de configuration backend (`.env` ou `config.js`):

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=plateforme_location_etudiants
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
```

---

## 📊 Structure des Tables

### Tables principales:
1. **users** - Utilisateurs
2. **annonces** - Annonces de logement
3. **annonce_images** - Images des annonces
4. **annonce_equipements** - Équipements
5. **annonce_regles** - Règles
6. **conversations** - Conversations
7. **messages** - Messages
8. **user_favorites** - Favoris
9. **annonce_reports** - Signalements d'annonces
10. **user_reports** - Signalements d'utilisateurs
11. **annonce_avis** - Avis
12. **password_reset_tokens** - Tokens de réinitialisation
13. **admin_actions** - Historique admin

---

## 🗑️ Supprimer la Base de Données

Si vous voulez tout recommencer:

```sql
DROP DATABASE IF EXISTS plateforme_location_etudiants;
```

Puis réexécutez `schema.sql`.

---

## 🔐 Sécurité

### ⚠️ Important en Production:

1. **Changer les mots de passe par défaut**
2. **Créer un utilisateur MySQL dédié** (pas root):
   ```sql
   CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'mot_de_passe_fort';
   GRANT ALL PRIVILEGES ON plateforme_location_etudiants.* TO 'app_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Activer les backups réguliers**
4. **Utiliser SSL pour les connexions MySQL**

---

## 🐛 Dépannage

### Erreur: "Access denied"
- Vérifiez vos identifiants MySQL
- Assurez-vous d'avoir les privilèges nécessaires

### Erreur: "Table already exists"
- La base existe déjà
- Supprimez-la et recréez-la, ou utilisez `DROP TABLE IF EXISTS`

### Erreur: "Unknown collation"
- Vérifiez que votre MySQL supporte `utf8mb4_unicode_ci`
- Version minimale: MySQL 5.5.3+

---

## 📝 Notes

- Les données d'exemple (`sample_data.sql`) sont **uniquement pour le développement**
- Ne les utilisez **jamais en production**
- Les mots de passe dans `sample_data.sql` sont des exemples, changez-les !

---

## ✅ Checklist

- [ ] MySQL installé et démarré
- [ ] Base de données créée
- [ ] Toutes les tables créées
- [ ] Index vérifiés
- [ ] Utilisateur admin créé
- [ ] Configuration backend mise à jour
- [ ] Test de connexion réussi

---

## 🎉 C'est Prêt !

Votre base de données est maintenant prête. Vous pouvez:
1. Connecter votre backend
2. Tester les endpoints
3. Commencer à développer !

Pour plus d'informations, consultez `README.md`.


