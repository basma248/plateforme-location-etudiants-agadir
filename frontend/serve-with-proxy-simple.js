// Serveur Express qui sert le build ET fait le proxy vers Laravel
// VERSION SIMPLE ET ROBUSTE - Proxy qui fonctionne vraiment

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;
const LARAVEL_URL = process.env.LARAVEL_URL || 'http://127.0.0.1:8001';

console.log('');
console.log('🚀 Démarrage du serveur Express avec proxy...');
console.log('');
console.log(`📦 Fichiers statiques: ${path.join(__dirname, 'build')}`);
console.log(`🔄 Proxy API: /api -> ${LARAVEL_URL}/api`);
console.log(`🌐 Application: http://localhost:${PORT}`);
console.log('');

// IMPORTANT: Le proxy DOIT être AVANT express.json() pour les requêtes POST
// Créer le proxy middleware
const apiProxy = createProxyMiddleware({
  target: LARAVEL_URL,
  changeOrigin: true,
  secure: false,
  logLevel: 'info',
  timeout: 30000,
  proxyTimeout: 30000,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY REQ] ${req.method} ${req.url}`);
    console.log(`[PROXY REQ] -> ${LARAVEL_URL}${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[PROXY RES] ${proxyRes.statusCode} ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('[PROXY ERROR]', err.message);
    console.error('[PROXY ERROR] Code:', err.code);
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        error: 'Proxy error',
        message: `Impossible de se connecter à Laravel sur ${LARAVEL_URL}`,
        details: err.message
      });
    }
  },
});

// Appliquer le proxy AVANT tout autre middleware
app.use('/api', apiProxy);

// Middleware pour parser le body (pour les autres routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware pour logger (après le proxy pour ne pas interférer)
app.use((req, res, next) => {
  if (req.path.startsWith('/api') && !req.path.includes('proxy')) {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'build')));

// Route SPA - DOIT être en dernier
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Démarrer le serveur
const server = app.listen(PORT, () => {
  console.log('');
  console.log('✅ Serveur démarré!');
  console.log('');
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔄 Backend:  ${LARAVEL_URL}`);
  console.log('');
  console.log('📝 Logs des requêtes API ci-dessous:');
  console.log('');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('❌ Port ' + PORT + ' déjà utilisé!');
    process.exit(1);
  }
});

