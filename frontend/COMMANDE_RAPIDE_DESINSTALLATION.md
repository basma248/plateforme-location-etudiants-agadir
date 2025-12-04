# 🗑️ Commande rapide pour désinstaller Node.js v24

## ⚠️ Vous êtes dans le mauvais répertoire !

Vous êtes dans : `C:\Users\Admin>`
Le script est dans : `C:\Users\Admin\plateforme-location-etudiants-agadir\frontend`

## ✅ Solutions

### Solution 1 : Aller dans le bon répertoire

```powershell
cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend
.\DESINSTALLER_NODEJS24.bat
```

### Solution 2 : Utiliser le chemin complet

```powershell
C:\Users\Admin\plateforme-location-etudiants-agadir\frontend\DESINSTALLER_NODEJS24.bat
```

### Solution 3 : Commande PowerShell directe (RECOMMANDÉ)

**Ouvrir PowerShell en tant qu'administrateur** et exécuter :

```powershell
Get-WmiObject -Class Win32_Product | Where-Object { $_.Name -like '*Node.js*' -and $_.Version -like '24.*' } | ForEach-Object { $_.Uninstall() }
```

### Solution 4 : Via le Panneau de configuration (LE PLUS SIMPLE)

1. **Win + R** → Tapez `appwiz.cpl` → Entrée
2. **Chercher "Node.js"**
3. **Cliquer dessus** → **Désinstaller**
4. **Suivre l'assistant**

### Solution 5 : Via les Paramètres Windows

1. **Win + I** (Ouvrir Paramètres)
2. **Applications** → **Applications et fonctionnalités**
3. **Chercher "Node.js"**
4. **Cliquer** → **Désinstaller**

## 🎯 Commande la plus simple

**Ouvrir PowerShell en tant qu'administrateur** :

```powershell
# Lister les versions de Node.js
Get-WmiObject -Class Win32_Product | Where-Object { $_.Name -like '*Node.js*' } | Select-Object Name, Version

# Désinstaller Node.js v24
Get-WmiObject -Class Win32_Product | Where-Object { $_.Name -like '*Node.js*' -and $_.Version -like '24.*' } | ForEach-Object { $_.Uninstall() }
```

## ✅ Vérification

Après la désinstallation :

```powershell
node --version
```

**Si ça affiche encore v24.x.x** :
- Fermer tous les terminaux
- Redémarrer l'ordinateur
- Réessayer `node --version`


