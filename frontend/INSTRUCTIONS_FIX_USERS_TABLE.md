# 🔧 Instructions pour Corriger la Table Users

## Problème
Erreur: `Column not found: 1054 Unknown column 'nom_utilisateur' in 'where clause'`

## Solution 1: Utiliser la Migration Laravel (Recommandé)

```bash
cd backend-laravel
php artisan migrate
```

## Solution 2: Si la migration ne fonctionne pas, exécutez le SQL directement

### Option A: Via MySQL en ligne de commande

```bash
mysql -u plateforme_user -p plateforme_location_etudiants < backend-laravel/database/fix_users_table.sql
```

### Option B: Via phpMyAdmin ou MySQL Workbench

1. Ouvrez phpMyAdmin ou MySQL Workbench
2. Sélectionnez la base de données `plateforme_location_etudiants`
3. Allez dans l'onglet SQL
4. Copiez-collez ce SQL:

```sql
ALTER TABLE `users` 
ADD COLUMN `nom` VARCHAR(100) NULL AFTER `id`,
ADD COLUMN `prenom` VARCHAR(100) NULL AFTER `nom`,
ADD COLUMN `nom_utilisateur` VARCHAR(100) NULL UNIQUE AFTER `prenom`,
ADD COLUMN `telephone` VARCHAR(20) NULL AFTER `email`,
ADD COLUMN `mot_de_passe` VARCHAR(255) NULL AFTER `telephone`,
ADD COLUMN `type_utilisateur` ENUM('etudiant', 'loueur') NULL AFTER `mot_de_passe`,
ADD COLUMN `cin` VARCHAR(20) NULL AFTER `type_utilisateur`,
ADD COLUMN `cne` VARCHAR(20) NULL AFTER `cin`,
ADD COLUMN `role` ENUM('user', 'admin', 'administrator') DEFAULT 'user' AFTER `cne`,
ADD COLUMN `avatar` VARCHAR(255) NULL AFTER `role`,
ADD COLUMN `suspended` BOOLEAN DEFAULT FALSE AFTER `avatar`,
ADD COLUMN `email_verifie` BOOLEAN DEFAULT FALSE AFTER `suspended`;
```

**Note:** Si une colonne existe déjà, vous aurez une erreur. Dans ce cas, supprimez la ligne correspondante du SQL.

## Solution 3: Vérifier et ajouter seulement les colonnes manquantes

Exécutez cette requête pour voir quelles colonnes existent:

```sql
SHOW COLUMNS FROM `users`;
```

Puis ajoutez seulement les colonnes manquantes avec:

```sql
ALTER TABLE `users` 
ADD COLUMN `nom_utilisateur` VARCHAR(100) NULL UNIQUE AFTER `prenom`;
-- Ajoutez les autres colonnes manquantes de la même manière
```

## Vérification

Après avoir ajouté les colonnes, vérifiez:

```sql
SHOW COLUMNS FROM `users` LIKE 'nom_utilisateur';
```

Vous devriez voir la colonne `nom_utilisateur`.

## ✅ Après la correction

1. Redémarrez le serveur Laravel si nécessaire
2. Testez l'inscription à nouveau
3. L'erreur devrait être résolue

