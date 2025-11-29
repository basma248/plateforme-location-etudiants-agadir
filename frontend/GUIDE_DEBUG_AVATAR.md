# Guide de débogage pour le problème d'avatar

## Problème
L'avatar n'est pas sauvegardé dans la base de données après l'upload.

## Étapes de diagnostic

### 1. Vérifier les logs Laravel

Les logs se trouvent dans : `backend-laravel/storage/logs/laravel.log`

**Sur Windows (PowerShell)** :
```powershell
cd backend-laravel
Get-Content storage\logs\laravel.log -Tail 200 | Select-String -Pattern "avatar|AVATAR" -Context 5
```

**Sur Linux/Mac** :
```bash
cd backend-laravel
tail -n 200 storage/logs/laravel.log | grep -i avatar -A 5 -B 5
```

### 2. Ce qu'il faut chercher dans les logs

Lorsque vous uploadez un avatar, vous devriez voir dans les logs :

1. **Réception du fichier** :
   ```
   hasFile(avatar): OUI
   $_FILES[avatar] existe!
   Fichier reçu - Nom: ...
   ```

2. **Upload du fichier** :
   ```
   === AVATAR UPLOADÉ ===
   Path: avatars/avatar_1_1234567890.jpg
   Fichier existe: OUI
   ```

3. **Sauvegarde dans la BD** :
   ```
   === SAUVEGARDE AVATAR DANS BD ===
   DB::table()->update() retourné: 1 ligne(s) modifiée(s)
   Avatar depuis DB::table (après update, IMMÉDIAT): avatars/avatar_1_1234567890.jpg
   ✅ Avatar correctement sauvegardé dans la BD
   ```

### 3. Si le fichier n'est pas reçu

Si vous voyez `hasFile(avatar): NON` dans les logs, le problème vient du frontend :

- Vérifier la console du navigateur (F12)
- Vérifier que `avatarFile` est bien un objet File
- Vérifier que FormData contient bien le fichier

### 4. Si le fichier est reçu mais pas sauvegardé

Si vous voyez `hasFile(avatar): OUI` mais `Avatar depuis DB::table (après update): NULL`, le problème vient de la sauvegarde :

- Vérifier les permissions de la base de données
- Vérifier que la colonne `avatar` existe et est de type `VARCHAR(255)`
- Vérifier les logs pour voir quelle méthode de sauvegarde a échoué

### 5. Test direct dans la base de données

Exécutez ce script pour tester directement la sauvegarde :

```bash
cd backend-laravel
php test-avatar-save.php
```

Ce script va :
- Tester la sauvegarde avec `DB::table()->update()`
- Tester la sauvegarde avec Eloquent
- Afficher les résultats

### 6. Vérification manuelle dans la BD

Connectez-vous à MySQL et exécutez :

```sql
-- Voir tous les utilisateurs et leurs avatars
SELECT id, email, avatar FROM users;

-- Voir un utilisateur spécifique
SELECT id, email, avatar FROM users WHERE id = 1;

-- Tester la mise à jour manuelle
UPDATE users SET avatar = 'avatars/test.jpg' WHERE id = 1;

-- Vérifier que ça a fonctionné
SELECT avatar FROM users WHERE id = 1;
```

### 7. Vérifier que le fichier est bien uploadé

Vérifiez dans le dossier :
```
backend-laravel/storage/app/public/avatars/
```

Vous devriez voir les fichiers avatar uploadés.

## Solutions possibles

### Solution 1 : Vérifier les permissions MySQL

Assurez-vous que l'utilisateur MySQL a les permissions d'écriture :
```sql
GRANT ALL PRIVILEGES ON plateforme_location_etudiants.* TO 'votre_user'@'localhost';
FLUSH PRIVILEGES;
```

### Solution 2 : Vérifier la structure de la table

```sql
DESCRIBE users;
```

La colonne `avatar` doit être :
- Type : `VARCHAR(255)` ou `VARCHAR(500)`
- Null : `YES`
- Default : `NULL`

### Solution 3 : Vérifier les triggers MySQL

Si vous avez des triggers sur la table `users`, ils pourraient écraser l'avatar :
```sql
SHOW TRIGGERS LIKE 'users';
```

### Solution 4 : Vérifier les événements MySQL

```sql
SHOW EVENTS;
```

## Prochaines étapes

1. **Exécutez le test** : `php test-avatar-save.php`
2. **Vérifiez les logs** après avoir uploadé un avatar
3. **Partagez les logs** avec les sections suivantes :
   - `=== DÉBUT updateProfile ===`
   - `=== AVATAR UPLOADÉ ===`
   - `=== SAUVEGARDE AVATAR DANS BD ===`
   - `=== VÉRIFICATION FINALE ===`

Ces informations permettront d'identifier exactement où le problème se produit.

