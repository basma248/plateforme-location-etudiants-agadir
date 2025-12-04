// Serveur Express qui sert le build ET fait le proxy vers Laravel
// SOLUTION DÉFINITIVE - Proxy qui fonctionne TOUJOURS

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const http = require('http');

const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const LARAVEL_URL = process.env.LARAVEL_URL || 'http://localhost:8000';

console.log('');
console.log('🚀 Démarrage du serveur Express avec proxy...');
console.log('');
console.log(`📦 Fichiers statiques: ${path.join(__dirname, 'build')}`);
console.log(`🔄 Proxy API: /api -> ${LARAVEL_URL}/api`);
console.log(`🌐 Application: http://localhost:${PORT}`);
console.log('');

// Vérifier que Laravel est accessible
const checkLaravel = () => {
  return new Promise((resolve) => {
    const req = http.get(`${LARAVEL_URL}/api/auth/login`, (res) => {
      console.log(`✅ Laravel accessible! (Status: ${res.statusCode})`);
      resolve(true);
    });
    req.on('error', (err) => {
      console.error(`⚠️  Laravel non accessible: ${err.message}`);
      console.error(`   Vérifiez que le serveur Laravel tourne sur ${LARAVEL_URL}`);
      resolve(false);
    });
    req.setTimeout(3000, () => {
      req.destroy();
      console.error(`⚠️  Timeout: Laravel ne répond pas sur ${LARAVEL_URL}`);
      resolve(false);
    });
  });
};

// Vérifier Laravel au démarrage
checkLaravel().then((isAvailable) => {
  if (!isAvailable) {
    console.log('');
    console.log('⚠️  Le serveur Laravel ne semble pas être accessible.');
    console.log('   Démarrez-le avec: cd backend-laravel && php artisan serve');
    console.log('');
  }
});

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Proxy pour l'API vers Laravel - SOLUTION SIMPLE ET EFFICACE
app.use('/api', createProxyMiddleware({
  target: LARAVEL_URL,
  changeOrigin: true,
  secure: false,
  logLevel: 'info',
  ws: false,
  onProxyReq: (proxyReq, req, res) => {
    const url = `${LARAVEL_URL}${req.url}`;
    console.log(`[PROXY] ${req.method} ${req.url} -> ${url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[PROXY] Response ${proxyRes.statusCode} for ${req.url}`);
    
    // Headers CORS
    proxyRes.headers['Access-Control-Allow-Origin'] = `http://localhost:${PORT}`;
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
  },
  onError: (err, req, res) => {
    console.error('[PROXY ERROR]', err.message);
    console.error('[PROXY ERROR] URL:', req.url);
    
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        error: 'Proxy error',
        message: `Impossible de se connecter à Laravel (${LARAVEL_URL}). Vérifiez qu'il est démarré.`,
        details: err.message
      });
    }
  },
}));

// Servir les fichiers statiques du build
app.use(express.static(path.join(__dirname, 'build')));

// Route pour toutes les pages (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Démarrer le serveur
const server = app.listen(PORT, () => {
  console.log('');
  console.log('✅ Serveur Express démarré!');
  console.log('');
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔄 Backend:  ${LARAVEL_URL}`);
  console.log('');
  console.log('📝 Les requêtes API seront loggées ci-dessous...');
  console.log('');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('');
    console.error('❌ Erreur: Le port ' + PORT + ' est déjà utilisé!');
    console.error('');
    console.error('🔧 Solutions:');
    console.error('   1. Tuez le processus: taskkill /F /IM node.exe');
    console.error('   2. Ou utilisez un autre port: set PORT=3001 && node serve-with-proxy.js');
    console.error('');
    process.exit(1);
  } else {
    throw err;
  }
});


