# Solution - Problème avec npx serve -s build

## 🔍 Le Problème

Quand vous utilisez `npx serve -s build`, c'est un **serveur statique** qui ne fait que servir les fichiers du build. Il n'a **pas de proxy** pour rediriger les appels `/api` vers le backend Laravel.

Donc quand le frontend appelle `/api/contact`, le serveur statique retourne une page HTML 404 au lieu de rediriger vers `http://localhost:8000/api/contact`.

## ✅ Solution : Serveur avec Proxy

J'ai créé un serveur Express qui :
1. ✅ Sert les fichiers du build (comme `npx serve`)
2. ✅ Fait le proxy `/api` -> `http://localhost:8000/api`
3. ✅ Gère les routes SPA (Single Page Application)

## 🚀 Utilisation

### Étape 1 : Build l'application
```bash
npm run build
```

### Étape 2 : Démarrer le serveur avec proxy
```bash
npm run serve:proxy
```

Ou directement :
```bash
node serve-with-proxy.js
```

### Étape 3 : Vérifier que Laravel est démarré
Dans un autre terminal :
```bash
cd backend-laravel
php artisan serve
```

## 📝 Commandes disponibles

- `npm run build` - Build l'application
- `npm run serve` - Serve statique (sans proxy) - **ne fonctionne pas pour l'API**
- `npm run serve:proxy` - Serve avec proxy - **✅ RECOMMANDÉ**

## 🔧 Comment ça marche

Le fichier `serve-with-proxy.js` :
1. Crée un serveur Express
2. Configure le proxy `/api` -> `http://localhost:8000/api`
3. Sert les fichiers statiques du build
4. Gère les routes React Router (SPA)

## ⚠️ Important

- Le serveur Laravel doit être démarré sur `http://localhost:8000`
- Le serveur Express écoute sur `http://localhost:3000` (ou le port spécifié)
- Tous les appels `/api/*` sont automatiquement redirigés vers Laravel

## 🎯 Alternative : Modifier ContactPage.js

Si vous préférez continuer avec `npx serve`, vous pouvez modifier `ContactPage.js` pour utiliser l'URL complète :

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

Mais cela ne fonctionnera que si le backend accepte les requêtes CORS depuis `http://localhost:3000` (ou le port de `npx serve`).

## ✅ Recommandation

Utilisez `npm run serve:proxy` qui est la solution la plus propre et qui fonctionne exactement comme `npm start` mais avec le build de production.


