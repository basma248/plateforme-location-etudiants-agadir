# Correction de la Migration Users

## Problème
La colonne `nom_utilisateur` n'existe pas dans la table `users`, causant l'erreur:
```
SQLSTATE[42S22]: Column not found: 1054 Unknown column 'nom_utilisateur' in 'where clause'
```

## Solution
Une nouvelle migration a été créée: `2025_11_28_120000_add_custom_fields_to_users_table.php`

## Commande à exécuter

```bash
cd backend-laravel
php artisan migrate
```

Cette migration ajoutera toutes les colonnes manquantes à la table `users`:
- nom
- prenom
- nom_utilisateur (unique)
- telephone
- mot_de_passe
- type_utilisateur
- cin
- cne
- role
- avatar
- suspended
- email_verifie

## Vérification

Après l'exécution, vérifiez que les colonnes existent:
```bash
php artisan tinker
>>> Schema::hasColumn('users', 'nom_utilisateur')
=> true
```

