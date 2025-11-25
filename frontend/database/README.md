# Base de Données - Plateforme Location Étudiants Agadir

## 📋 Structure de la Base de Données

Ce document décrit la structure complète de la base de données MySQL pour la plateforme de location étudiante.

---

## 🗄️ Tables Principales

### 1. **users** - Utilisateurs
Stocke tous les utilisateurs (étudiants, loueurs, admins)

**Champs principaux:**
- `id` - Identifiant unique
- `nom`, `prenom` - Nom complet
- `email` - Email (unique)
- `telephone` - Numéro de téléphone
- `nom_utilisateur` - Nom d'utilisateur (unique)
- `mot_de_passe` - Mot de passe hashé (bcrypt)
- `type_utilisateur` - 'etudiant' ou 'loueur'
- `cin` - Carte d'identité nationale
- `cne` - Numéro CNE (pour étudiants)
- `role` - 'user', 'admin', ou 'administrator'
- `avatar` - URL de l'avatar
- `suspended` - Si l'utilisateur est suspendu
- `email_verifie` - Si l'email est vérifié

---

### 2. **annonces** - Annonces de logement
Stocke toutes les annonces de logement

**Champs principaux:**
- `id` - Identifiant unique
- `user_id` - Propriétaire de l'annonce
- `titre` - Titre de l'annonce
- `type` - 'chambre', 'studio', 'appartement', 'colocation'
- `zone` - Zone/quartier
- `adresse` - Adresse complète
- `prix` - Prix mensuel (MAD)
- `surface` - Surface en m²
- `nb_chambres` - Nombre de chambres
- `description` - Description courte
- `description_longue` - Description détaillée
- `meuble` - Si le logement est meublé
- `disponibilite` - Disponibilité
- `statut` - 'en_attente', 'approuve', 'rejete', 'signale'
- `rating` - Note moyenne
- `nb_avis` - Nombre d'avis
- `vues` - Nombre de vues
- `contacts` - Nombre de contacts

---

### 3. **annonce_images** - Images des annonces
Stocke les images associées aux annonces

**Champs:**
- `id` - Identifiant unique
- `annonce_id` - ID de l'annonce
- `image_url` - URL de l'image
- `image_order` - Ordre d'affichage

---

### 4. **annonce_equipements** - Équipements
Liste des équipements par annonce

**Champs:**
- `id` - Identifiant unique
- `annonce_id` - ID de l'annonce
- `equipement` - Nom de l'équipement (Wi-Fi, Parking, etc.)

---

### 5. **annonce_regles** - Règles
Règles de la maison par annonce

**Champs:**
- `id` - Identifiant unique
- `annonce_id` - ID de l'annonce
- `regle` - Règle (Non-fumeur, Animaux autorisés, etc.)

---

### 6. **conversations** - Conversations
Gère les conversations entre locataires et propriétaires

**Champs:**
- `id` - Identifiant unique
- `annonce_id` - ID de l'annonce concernée
- `locataire_id` - ID du locataire
- `proprietaire_id` - ID du propriétaire
- `dernier_message_id` - ID du dernier message
- `non_lu_locataire` - Nombre de messages non lus (locataire)
- `non_lu_proprietaire` - Nombre de messages non lus (propriétaire)

---

### 7. **messages** - Messages
Messages dans les conversations

**Champs:**
- `id` - Identifiant unique
- `conversation_id` - ID de la conversation
- `sender_id` - ID de l'expéditeur
- `content` - Contenu du message
- `sujet` - Sujet (optionnel)
- `telephone` - Téléphone (optionnel)
- `date_visite` - Date de visite souhaitée (optionnel)
- `lu` - Si le message est lu

---

### 8. **user_favorites** - Favoris
Annonces favorites des utilisateurs

**Champs:**
- `id` - Identifiant unique
- `user_id` - ID de l'utilisateur
- `annonce_id` - ID de l'annonce

---

### 9. **annonce_reports** - Signalements d'annonces
Signalements d'annonces par les utilisateurs

**Champs:**
- `id` - Identifiant unique
- `annonce_id` - ID de l'annonce signalée
- `user_id` - ID de l'utilisateur qui signale
- `reason` - Raison du signalement
- `statut` - 'en_attente', 'traite', 'rejete'

---

### 10. **user_reports** - Signalements d'utilisateurs
Signalements d'utilisateurs

**Champs:**
- `id` - Identifiant unique
- `reported_user_id` - ID de l'utilisateur signalé
- `reporter_user_id` - ID de l'utilisateur qui signale
- `reason` - Raison du signalement
- `statut` - 'en_attente', 'traite', 'rejete'

---

### 11. **annonce_avis** - Avis
Avis et notes sur les annonces

**Champs:**
- `id` - Identifiant unique
- `annonce_id` - ID de l'annonce
- `user_id` - ID de l'utilisateur qui donne l'avis
- `rating` - Note (1-5)
- `commentaire` - Commentaire

---

### 12. **password_reset_tokens** - Tokens de réinitialisation
Tokens pour la réinitialisation de mot de passe

**Champs:**
- `id` - Identifiant unique
- `user_id` - ID de l'utilisateur
- `token` - Token unique
- `expires_at` - Date d'expiration
- `used` - Si le token a été utilisé

---

### 13. **admin_actions** - Historique admin
Historique des actions administratives

**Champs:**
- `id` - Identifiant unique
- `admin_id` - ID de l'admin
- `action_type` - Type d'action
- `target_type` - Type de cible ('annonce', 'user', 'message')
- `target_id` - ID de la cible
- `details` - Détails de l'action

---

## 🔗 Relations

```
users (1) ──< (N) annonces
users (1) ──< (N) messages
users (1) ──< (N) user_favorites
users (1) ──< (N) annonce_avis
users (1) ──< (N) annonce_reports
users (1) ──< (N) user_reports

annonces (1) ──< (N) annonce_images
annonces (1) ──< (N) annonce_equipements
annonces (1) ──< (N) annonce_regles
annonces (1) ──< (N) conversations
annonces (1) ──< (N) annonce_reports
annonces (1) ──< (N) annonce_avis

conversations (1) ──< (N) messages
```

---

## 📊 Index et Performances

### Index créés:
- **users**: email, nom_utilisateur, type_utilisateur, role
- **annonces**: user_id, type, zone, prix, statut, created_at
- **Fulltext**: titre, description, zone (pour la recherche)
- **messages**: conversation_id, sender_id, created_at, lu
- **conversations**: annonce_id, locataire_id, proprietaire_id, updated_at

---

## 🚀 Installation

### 1. Créer la base de données

```bash
mysql -u root -p < database/schema.sql
```

Ou via MySQL Workbench:
1. Ouvrir le fichier `schema.sql`
2. Exécuter le script

### 2. Vérifier l'installation

```sql
USE plateforme_location_etudiants;
SHOW TABLES;
```

Vous devriez voir toutes les tables listées ci-dessus.

### 3. Créer un utilisateur admin

Le script crée un utilisateur admin par défaut, mais vous devez:
1. Hasher le mot de passe avec bcrypt
2. Remplacer `$2b$10$YourHashedPasswordHere` par le hash réel

Ou créer manuellement:

```sql
INSERT INTO users (
    nom, prenom, email, telephone, nom_utilisateur, 
    mot_de_passe, type_utilisateur, role, email_verifie
) VALUES (
    'Admin', 'Système', 'admin@plateforme.ma', '+212 6 00 00 00 00',
    'admin', '$2b$10$VotreHashBcryptIci', 'loueur', 'admin', TRUE
);
```

---

## 🔐 Sécurité

### Recommandations:

1. **Mots de passe**: Toujours hasher avec bcrypt (coût 10 minimum)
2. **Tokens**: Générer des tokens sécurisés pour la réinitialisation
3. **SQL Injection**: Utiliser des requêtes préparées
4. **Validation**: Valider toutes les données avant insertion
5. **Index**: Les index sont déjà créés pour les performances

---

## 📝 Notes Importantes

1. **Charset**: Utilisation de `utf8mb4` pour supporter les emojis
2. **Foreign Keys**: Toutes les clés étrangères ont `ON DELETE CASCADE`
3. **Timestamps**: `created_at` et `updated_at` gérés automatiquement
4. **Triggers**: 
   - Mise à jour automatique du rating moyen
   - Mise à jour du dernier message dans les conversations

---

## 🔄 Migrations Futures

Si vous devez modifier le schéma:

1. Créer un fichier de migration: `database/migrations/YYYYMMDD_description.sql`
2. Tester sur une base de données de développement
3. Appliquer en production avec backup

---

## ✅ Checklist

- [x] Toutes les tables créées
- [x] Toutes les relations définies
- [x] Index pour les performances
- [x] Triggers pour l'automatisation
- [x] Vues pour les statistiques
- [ ] Utilisateur admin créé (à faire manuellement)
- [ ] Backup configuré (à configurer)

---

## 📞 Support

Pour toute question sur la structure de la base de données, consultez:
- Le fichier `schema.sql` pour le code SQL complet
- Le fichier `API_ENDPOINTS.md` pour les endpoints attendus


