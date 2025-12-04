# 🗑️ Commandes pour désinstaller Node.js v24

## ⚠️ Important

La désinstallation de programmes sur Windows nécessite généralement des **droits administrateur**.

## 📋 Méthodes

### Méthode 1 : Script Batch (Simple)

```bash
.\DESINSTALLER_NODEJS24.bat
```

Ce script va :
- Lister les versions de Node.js installées
- Vous donner les instructions pour désinstaller

### Méthode 2 : PowerShell (Recommandé - Plus efficace)

1. **Ouvrir PowerShell en tant qu'administrateur** :
   - Clic droit sur PowerShell → "Exécuter en tant qu'administrateur"

2. **Aller dans le dossier du projet** :
   ```powershell
   cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend
   ```

3. **Exécuter le script** :
   ```powershell
   .\DESINSTALLER_NODEJS24_POWERSHELL.ps1
   ```

### Méthode 3 : Commande PowerShell directe

**Ouvrir PowerShell en tant qu'administrateur** et exécuter :

```powershell
Get-WmiObject -Class Win32_Product | Where-Object { $_.Name -like '*Node.js*' -and $_.Version -like '24.*' } | ForEach-Object { $_.Uninstall() }
```

### Méthode 4 : Via le Panneau de configuration (Manuel - Le plus sûr)

1. **Ouvrir le Panneau de configuration**
2. **Programmes** → **Programmes et fonctionnalités**
3. **Chercher "Node.js"**
4. **Cliquer dessus** → **Désinstaller**
5. **Suivre l'assistant**

### Méthode 5 : Via les Paramètres Windows (Windows 10/11)

1. **Paramètres Windows** (Win + I)
2. **Applications** → **Applications et fonctionnalités**
3. **Chercher "Node.js"**
4. **Cliquer** → **Désinstaller**

## ✅ Vérification après désinstallation

```bash
node --version
```

**Si ça affiche encore v24.x.x** :
- Fermer tous les terminaux
- Redémarrer l'ordinateur
- Réessayer `node --version`

## 🔧 Si la désinstallation échoue

1. **Redémarrer l'ordinateur**
2. **Réessayer la désinstallation**
3. **Utiliser un outil de désinstallation** comme :
   - Revo Uninstaller (gratuit)
   - IObit Uninstaller (gratuit)

## 📝 Après la désinstallation

1. **Installer Node.js v20 LTS** : https://nodejs.org/
2. **Vérifier** : `node --version` (doit afficher v20.x.x)
3. **Réinstaller les dépendances** : `npm install`
4. **Tester** : `npm start`


