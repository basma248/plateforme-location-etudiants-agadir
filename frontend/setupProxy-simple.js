// Proxy simplifié qui ne bloque pas la compilation
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy minimal qui ne bloque pas
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false,
      logLevel: 'error', // Seulement les erreurs
      // Pas de timeout pour éviter les blocages
      // Pas de gestion d'erreur complexe
    })
  );
};


