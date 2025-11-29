# 🔧 Solution - Table personal_access_tokens

## Problème Identifié

La table `personal_access_tokens` est incomplète. Elle ne contient que `id` et `timestamps`, mais Laravel Sanctum a besoin de toutes ces colonnes :
- `tokenable_type`
- `tokenable_id`
- `name` ⚠️ (c'est celle qui manque et cause l'erreur)
- `token`
- `abilities`
- `last_used_at`
- `expires_at`

## Solution

### Option 1: Migration Laravel (Recommandé)

La migration a été corrigée. Exécutez :

```bash
cd backend-laravel
php artisan migrate:refresh --path=database/migrations/2025_11_26_195429_create_personal_access_tokens_table.php
```

**OU** supprimez et recréez la table :

```bash
# Supprimer la table
php artisan tinker
>>> Schema::dropIfExists('personal_access_tokens');

# Puis exécuter la migration
php artisan migrate
```

### Option 2: SQL Direct (Plus Rapide)

Exécutez ce SQL dans phpMyAdmin :

```sql
-- Supprimer la table existante
DROP TABLE IF EXISTS `personal_access_tokens`;

-- Recréer avec la structure complète
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Option 3: Ajouter seulement les colonnes manquantes

Si vous voulez garder les données existantes (s'il y en a) :

```sql
ALTER TABLE `personal_access_tokens` 
ADD COLUMN `tokenable_type` varchar(255) NOT NULL AFTER `id`,
ADD COLUMN `tokenable_id` bigint(20) unsigned NOT NULL AFTER `tokenable_type`,
ADD COLUMN `name` varchar(255) NOT NULL AFTER `tokenable_id`,
ADD COLUMN `token` varchar(64) NOT NULL UNIQUE AFTER `name`,
ADD COLUMN `abilities` text DEFAULT NULL AFTER `token`,
ADD COLUMN `last_used_at` timestamp NULL DEFAULT NULL AFTER `abilities`,
ADD COLUMN `expires_at` timestamp NULL DEFAULT NULL AFTER `last_used_at`;

-- Ajouter les index
ALTER TABLE `personal_access_tokens`
ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);
```

## ✅ Après la Correction

1. Videz les caches Laravel :
```bash
php artisan config:clear
php artisan cache:clear
```

2. Redémarrez le serveur Laravel

3. Testez l'inscription à nouveau

## Vérification

Vérifiez que la table a la bonne structure :

```sql
SHOW COLUMNS FROM `personal_access_tokens`;
```

Vous devriez voir toutes les colonnes listées ci-dessus.

