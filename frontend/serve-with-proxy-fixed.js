// Serveur Express qui sert le build ET fait le proxy vers Laravel
// VERSION CORRIGEE - Fix "Failed to fetch"

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

// Middleware pour parser le body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware CORS pour le frontend
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
app.use('/api', createProxyMiddleware({
  target: LARAVEL_URL,
  changeOrigin: true,
  secure: false,
  logLevel: 'info',
  timeout: 30000, // 30 secondes timeout
  proxyTimeout: 30000,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.url} -> ${LARAVEL_URL}${req.url}`);
    
    // S'assurer que les headers sont corrects
    proxyReq.setHeader('Host', '127.0.0.1:8001');
    proxyReq.setHeader('X-Forwarded-For', req.ip || '127.0.0.1');
    proxyReq.setHeader('X-Forwarded-Proto', req.protocol || 'http');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[PROXY] ${proxyRes.statusCode} ${req.method} ${req.url}`);
    
    // Ajouter les headers CORS
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
        message: `Impossible de se connecter à Laravel sur ${LARAVEL_URL}. Vérifiez que le serveur est démarré.`,
        details: err.message,
        code: err.code
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
