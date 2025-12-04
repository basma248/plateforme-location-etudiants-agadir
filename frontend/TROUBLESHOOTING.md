# Guide de dépannage - npm start ne démarre pas

## Problème : npm start reste bloqué après les warnings

### Solution 1 : Attendre la compilation
Le serveur peut prendre 30-60 secondes pour compiler. Attendez de voir :
- `Compiled successfully!` ou
- Des erreurs de compilation

### Solution 2 : Vérifier les erreurs silencieuses
1. Ouvrez un nouveau terminal
2. Exécutez : `npm start 2>&1 | tee npm-start.log`
3. Attendez 1-2 minutes
4. Vérifiez le fichier `npm-start.log` pour les erreurs

### Solution 3 : Désactiver temporairement le proxy
1. Renommez `src/setupProxy.js` en `src/setupProxy.js.bak`
2. Relancez `npm start`
3. Si ça fonctionne, le problème vient du proxy

### Solution 4 : Nettoyer et réinstaller
```bash
# Arrêter npm start (Ctrl+C)
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
npm start
```

### Solution 5 : Vérifier la version de Node.js
```bash
node --version
```
Doit être >= 14.0.0

### Solution 6 : Utiliser un port différent
Créez un fichier `.env` à la racine :
```
PORT=3001
SKIP_PREFLIGHT_CHECK=true
```

### Solution 7 : Démarrer avec plus de verbosité
```bash
set NODE_ENV=development && set DEBUG=* && npm start
```


