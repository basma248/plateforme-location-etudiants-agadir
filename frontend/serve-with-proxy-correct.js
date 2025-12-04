// Serveur Express qui sert le build ET fait le proxy vers Laravel
// VERSION CORRECTE - Préserve /api dans l'URL

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
// IMPORTANT: pathRewrite préserve /api dans l'URL
app.use('/api', createProxyMiddleware({
  target: LARAVEL_URL,
  changeOrigin: true,
  secure: false,
  logLevel: 'info',
  timeout: 30000,
  proxyTimeout: 30000,
  // IMPORTANT: Préserver /api dans l'URL
  // Par défaut, http-proxy-middleware enlève le préfixe /api
  // On doit utiliser pathRewrite pour le garder
  pathRewrite: function (path, req) {
    // Le path est déjà /auth/login (sans /api)
    // On doit le remettre avec /api
    return '/api' + path;
  },
  onProxyReq: (proxyReq, req, res) => {
    // Après pathRewrite, le chemin sera /api/auth/login
    // req.url contient le chemin original (/api/auth/login)
    // Mais après pathRewrite, proxyReq.path sera /api/auth/login
    const finalPath = '/api' + req.url.replace('/api', ''); // Remettre /api
    const targetUrl = `${LARAVEL_URL}${finalPath}`;
    console.log(`[PROXY REQ] ${req.method} ${req.url}`);
    console.log(`[PROXY REQ] -> ${targetUrl}`);
    console.log(`[PROXY REQ] Path après rewrite: ${finalPath}`);
    
    // Headers
    proxyReq.setHeader('Host', '127.0.0.1:8001');
    proxyReq.setHeader('X-Forwarded-For', req.ip || req.connection.remoteAddress || '127.0.0.1');
    proxyReq.setHeader('X-Forwarded-Proto', req.protocol || 'http');
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

