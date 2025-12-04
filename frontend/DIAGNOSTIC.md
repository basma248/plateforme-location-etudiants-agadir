# Diagnostic du problème npm start

## Test 1 : Version minimale
1. Renommez temporairement `src/App.js` en `src/App.js.backup`
2. Renommez `src/App.test-minimal.js` en `src/App.js`
3. Lancez `npm start`
4. Si ça fonctionne, le problème vient d'un import dans App.js

## Test 2 : Vérifier les erreurs de build
```bash
npm run build
```
Cela affichera toutes les erreurs de compilation.

## Test 3 : Vérifier la version de Node.js
```bash
node --version
npm --version
```
- Node.js doit être >= 14.0.0
- npm doit être >= 6.0.0

## Test 4 : Nettoyer complètement
```bash
# Arrêter npm start (Ctrl+C)
taskkill /F /IM node.exe

# Supprimer
rmdir /s /q node_modules
del package-lock.json

# Nettoyer le cache
npm cache clean --force

# Réinstaller
npm install

# Relancer
npm start
```

## Test 5 : Vérifier les logs complets
Dans le terminal où `npm start` est lancé :
1. Faites défiler vers le HAUT
2. Cherchez des messages en ROUGE
3. Copiez TOUS les messages d'erreur

## Test 6 : Démarrer avec verbosité maximale
```bash
set DEBUG=* && set NODE_ENV=development && npm start
```


