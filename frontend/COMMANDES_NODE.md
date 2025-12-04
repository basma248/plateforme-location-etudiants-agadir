# 📝 Commandes Node.js correctes

## ✅ Commandes correctes

### Vérifier la version de Node.js

```bash
node --version
```
ou
```bash
node -v
```

**Résultat attendu** : `v24.11.1` (ou `v20.x.x` si vous downgradez)

### Vérifier la version de npm

```bash
npm --version
```
ou
```bash
npm -v
```

## ❌ Erreur que vous avez faite

Vous avez tapé :
```bash
node version
```

**Problème** : Node.js a interprété `version` comme un **nom de fichier** à exécuter, d'où l'erreur :
```
Error: Cannot find module 'C:\Users\Admin\version'
```

## ✅ Solution

Utilisez toujours `--version` ou `-v` :

```bash
node --version
```

## 🎯 Votre version actuelle

D'après l'erreur, vous avez **Node.js v24.11.1**, ce qui confirme notre diagnostic :

- ✅ Votre code est compatible avec react-scripts 5.0.1
- ❌ Node.js v24.11.1 est incompatible avec react-scripts 5.0.1
- 🔧 Solution : Downgrade Node.js vers v20 LTS

## 📋 Autres commandes utiles

```bash
# Vérifier Node.js
node --version

# Vérifier npm
npm --version

# Vérifier les versions installées dans votre projet
npm list react react-dom react-scripts --depth=0

# Nettoyer le cache npm
npm cache clean --force

# Réinstaller les dépendances
npm install
```


