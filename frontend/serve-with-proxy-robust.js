// Serveur Express qui sert le build ET fait le proxy vers Laravel
// VERSION ROBUSTE - Fix route not found

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;
// FORCER le port 8001
const LARAVEL_URL = process.env.LARAVEL_URL || 'http://127.0.0.1:8001';

console.log('');
console.log('🚀 Démarrage du serveur Express avec proxy...');
console.log('');
console.log(`📦 Fichiers statiques: ${path.join(__dirname, 'build')}`);
console.log(`🔄 Proxy API: /api -> ${LARAVEL_URL}/api`);
console.log(`🌐 Application: http://localhost:${PORT}`);
console.log(`📡 Backend Laravel: ${LARAVEL_URL}`);
console.log('');

// Middleware pour parser le body JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    console.log(`[REQUEST] Headers:`, JSON.stringify(req.headers, null, 2));
  }
  next();
});

// Proxy pour l'API vers Laravel
// IMPORTANT: Le proxy doit préserver le chemin /api
app.use('/api', createProxyMiddleware({
  target: LARAVEL_URL,
  changeOrigin: true,
  secure: false,
  logLevel: 'debug', // Mode debug pour voir tous les détails
  // Pas de pathRewrite - on garde /api dans l'URL
  // Le proxy préserve automatiquement /api quand on fait app.use('/api', ...)
  onProxyReq: (proxyReq, req, res) => {
    const targetUrl = `${LARAVEL_URL}${req.url}`;
    console.log(`[PROXY REQ] ${req.method} ${req.url}`);
    console.log(`[PROXY REQ] -> ${targetUrl}`);
    console.log(`[PROXY REQ] Headers:`, JSON.stringify(req.headers, null, 2));
    
    // S'assurer que les headers sont corrects
    proxyReq.setHeader('Host', '127.0.0.1:8001');
    proxyReq.setHeader('X-Forwarded-For', req.ip);
    proxyReq.setHeader('X-Forwarded-Proto', req.protocol);
    
    // Si c'est une requête POST/PUT, copier le body
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[PROXY RES] ${proxyRes.statusCode} ${req.method} ${req.url}`);
    console.log(`[PROXY RES] Headers:`, JSON.stringify(proxyRes.headers, null, 2));
  },
  onError: (err, req, res) => {
    console.error('[PROXY ERROR]', err.message);
    console.error('[PROXY ERROR] URL:', req.url);
    console.error('[PROXY ERROR] Target:', LARAVEL_URL);
    console.error('[PROXY ERROR] Stack:', err.stack);
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        error: 'Proxy error',
        message: `Impossible de se connecter à Laravel sur ${LARAVEL_URL}. Vérifiez que le serveur est démarré.`,
        details: err.message
      });
    }
  },
}));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'build')));

// Route SPA - DOIT être après le proxy
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

