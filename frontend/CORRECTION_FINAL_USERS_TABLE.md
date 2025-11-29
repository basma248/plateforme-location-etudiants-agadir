# 🔧 Correction Finale - Table Users

## Problème Actuel
Erreur: `Field 'name' doesn't have a default value`

La table `users` contient encore les colonnes par défaut de Laravel (`name`, `password`) qui ne sont plus utilisées par le code.

## Solution

### Option 1: Migration Laravel (Recommandé)

Exécutez cette commande:

```bash
cd backend-laravel
php artisan migrate
```

Cette migration supprimera les colonnes `name` et `password` qui ne sont plus utilisées.

### Option 2: SQL Direct (Si la migration ne fonctionne pas)

Exécutez ce SQL dans MySQL (phpMyAdmin ou MySQL Workbench):

```sql
-- Supprimer les colonnes par défaut de Laravel
ALTER TABLE `users` DROP COLUMN `name`;
ALTER TABLE `users` DROP COLUMN `password`;
```

**⚠️ Important:** Assurez-vous d'abord que les colonnes `nom`, `prenom` et `mot_de_passe` existent avant de supprimer `name` et `password`.

### Vérification

Après avoir supprimé les colonnes, vérifiez la structure de la table:

```sql
SHOW COLUMNS FROM `users`;
```

Vous devriez voir:
- ✅ `nom` (au lieu de `name`)
- ✅ `prenom`
- ✅ `nom_utilisateur`
- ✅ `mot_de_passe` (au lieu de `password`)
- ❌ Plus de `name`
- ❌ Plus de `password`

## Structure Finale Attendue

La table `users` devrait avoir ces colonnes:
- `id`
- `nom`
- `prenom`
- `nom_utilisateur`
- `email`
- `telephone`
- `mot_de_passe`
- `type_utilisateur`
- `cin`
- `cne`
- `role`
- `avatar`
- `suspended`
- `email_verifie`
- `email_verified_at`
- `remember_token`
- `created_at`
- `updated_at`

## ✅ Après la Correction

1. Redémarrez le serveur Laravel si nécessaire
2. Testez l'inscription à nouveau
3. L'erreur devrait être résolue

