# 📥 Instructions : Downgrade Node.js vers v20 LTS

## 🎯 Objectif

Downgrader Node.js de v24.11.1 vers v20.x.x LTS pour que `npm start` fonctionne.

## 📋 Étapes détaillées

### Étape 1 : Télécharger Node.js v20 LTS

1. Ouvrir votre navigateur
2. Aller sur : **https://nodejs.org/**
3. Vous verrez deux boutons :
   - **LTS** (Long Term Support) - C'est celui-là !
   - **Current** (Version actuelle) - Ne pas prendre
4. Cliquer sur **LTS** (version 20.x.x)
5. Télécharger **Windows Installer (.msi)** pour Windows

### Étape 2 : Désinstaller Node.js v24

1. Ouvrir **Panneau de configuration**
2. Aller dans **Programmes** → **Programmes et fonctionnalités**
3. Chercher **"Node.js"**
4. Vous verrez **"Node.js v24.11.1"**
5. Cliquer dessus → **Désinstaller**
6. Suivre l'assistant de désinstallation

### Étape 3 : Installer Node.js v20 LTS

1. Ouvrir le fichier .msi téléchargé
2. Suivre l'assistant d'installation
3. Accepter les conditions
4. Choisir le répertoire d'installation (par défaut : `C:\Program Files\nodejs\`)
5. Cliquer sur **Installer**
6. Attendre la fin de l'installation

### Étape 4 : Vérifier l'installation

Ouvrir un **nouveau** PowerShell ou CMD et taper :

```bash
node --version
```

**Doit afficher** : `v20.x.x` (par exemple `v20.11.0`)

**Si ça affiche encore v24.x.x** :
- Fermer tous les terminaux
- Redémarrer l'ordinateur
- Réessayer `node --version`

### Étape 5 : Réinstaller les dépendances

```bash
cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend
npm install
```

### Étape 6 : Tester npm start

```bash
npm start
```

**Ça devrait fonctionner maintenant !** 🎉

## ⚠️ Important

- **Fermer tous les terminaux** avant de vérifier la version
- **Redémarrer l'ordinateur** si la version ne change pas
- Utiliser un **nouveau terminal** après l'installation

## ✅ Vérification finale

```bash
node --version    # Doit afficher v20.x.x
npm --version     # Doit fonctionner
npm start         # Doit compiler et ouvrir http://localhost:3000
```

## 🎯 Temps estimé

- Téléchargement : 2-3 minutes
- Désinstallation : 1 minute
- Installation : 2-3 minutes
- Réinstallation dépendances : 2-3 minutes
- **Total : ~10 minutes**

## 📝 Après le downgrade

Une fois Node.js v20 installé :

1. Restaurer ContactPage (si nécessaire) :
   ```bash
   .\RESTAURER_CONTACTPAGE.bat
   ```

2. Restaurer le proxy (si nécessaire) :
   ```bash
   ren src\setupProxy.js.temp setupProxy.js
   ```

3. Lancer l'application :
   ```bash
   npm start
   ```

**Tout devrait fonctionner maintenant !** ✅


