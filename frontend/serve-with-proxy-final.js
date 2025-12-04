// Serveur Express qui sert le build ET fait le proxy vers Laravel
// VERSION FINALE - Fix "Unexpected EOF"

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

// IMPORTANT: Ne pas parser le body ici, laisser le proxy le gérer
// app.use(express.json()); // NE PAS UTILISER - cause "Unexpected EOF"

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

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Proxy pour l'API vers Laravel
// IMPORTANT: Le proxy DOIT être avant les fichiers statiques
app.use('/api', createProxyMiddleware({
  target: LARAVEL_URL,
  changeOrigin: true,
  secure: false,
  logLevel: 'info',
  timeout: 30000,
  proxyTimeout: 30000,
  // IMPORTANT: Ne pas utiliser pathRewrite, laisser le proxy gérer automatiquement
  onProxyReq: (proxyReq, req, res) => {
    const targetUrl = `${LARAVEL_URL}${req.url}`;
    console.log(`[PROXY REQ] ${req.method} ${req.url}`);
    console.log(`[PROXY REQ] -> ${targetUrl}`);
    
    // Headers importants
    proxyReq.setHeader('Host', '127.0.0.1:8001');
    proxyReq.setHeader('X-Forwarded-For', req.ip || req.connection.remoteAddress || '127.0.0.1');
    proxyReq.setHeader('X-Forwarded-Proto', req.protocol || 'http');
    
    // IMPORTANT: Ne pas manipuler le body ici, laisser le proxy le gérer automatiquement
    // Le body sera transmis automatiquement par http-proxy-middleware
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[PROXY RES] ${proxyRes.statusCode} ${req.method} ${req.url}`);
    
    // Headers CORS
    proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
  },
  onError: (err, req, res) => {
    console.error('[PROXY ERROR]', err.message);
    console.error('[PROXY ERROR] Code:', err.code);
    console.error('[PROXY ERROR] URL:', req.url);
    console.error('[PROXY ERROR] Target:', LARAVEL_URL);
    
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        error: 'Proxy error',
        message: `Impossible de se connecter à Laravel sur ${LARAVEL_URL}`,
        details: err.message,
        code: err.code
      });
    }
  },
}));

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


