# Configuration Email - Darna Agadir

## 📧 Configuration actuelle

Le fichier `.env` a été configuré avec les paramètres de base pour l'envoi d'emails.

### Paramètres configurés :

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@darna-agadir.ma"
MAIL_FROM_NAME="Darna Agadir"
FRONTEND_URL=http://localhost:3000
```

## 🔧 Étapes pour compléter la configuration

### Option 1 : Gmail (Recommandé pour le développement)

1. **Créer un mot de passe d'application Gmail** :
   - Allez sur https://myaccount.google.com/apppasswords
   - Connectez-vous avec votre compte Gmail
   - Sélectionnez "Application" : "Mail"
   - Sélectionnez "Appareil" : "Autre (nom personnalisé)" et entrez "Darna Agadir"
   - Cliquez sur "Générer"
   - Copiez le mot de passe généré (16 caractères)

2. **Mettre à jour le `.env`** :
   ```env
   MAIL_USERNAME=votre-email@gmail.com
   MAIL_PASSWORD=votre-mot-de-passe-app-16-caracteres
   ```

### Option 2 : Serveur SMTP personnalisé

Si vous avez votre propre serveur SMTP, modifiez dans le `.env` :

```env
MAIL_HOST=votre-serveur-smtp.com
MAIL_PORT=587  # ou 465 pour SSL
MAIL_USERNAME=votre-email@domaine.com
MAIL_PASSWORD=votre-mot-de-passe
MAIL_ENCRYPTION=tls  # ou ssl pour le port 465
```

### Option 3 : Mode développement (Logs)

Pour tester sans envoyer de vrais emails, utilisez :

```env
MAIL_MAILER=log
```

Les emails seront écrits dans `storage/logs/laravel.log`

## 🌐 Configuration FRONTEND_URL

Le `FRONTEND_URL` doit pointer vers votre application frontend :

- **Développement** : `http://localhost:3000`
- **Production** : `https://votre-domaine.com`

## ✅ Vérification

Après configuration, testez l'envoi d'email :

1. Demandez une réinitialisation de mot de passe
2. Vérifiez votre boîte de réception
3. Si `MAIL_MAILER=log`, vérifiez `storage/logs/laravel.log`

## 🔒 Sécurité

- ⚠️ **Ne commitez JAMAIS** le fichier `.env` dans Git
- ⚠️ Utilisez des **mots de passe d'application** pour Gmail, pas votre mot de passe principal
- ⚠️ En production, utilisez des variables d'environnement sécurisées

## 📝 Notes

- Les emails de réinitialisation sont valides pendant **1 heure**
- Le lien de réinitialisation contient un token unique et sécurisé
- Les anciens tokens sont automatiquement invalidés lors d'une nouvelle demande


