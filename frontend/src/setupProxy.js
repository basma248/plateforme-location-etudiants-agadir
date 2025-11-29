const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      // IMPORTANT: Configuration pour permettre l'upload de fichiers
      // Ne pas parser le body pour les requêtes multipart
      onProxyReq: (proxyReq, req, res) => {
        // Pour les requêtes multipart/form-data, s'assurer que le body est bien transmis
        if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
          // Ne pas modifier les headers, laisser le proxy transmettre tel quel
          console.log('[PROXY] Transmission de fichier multipart/form-data');
          console.log('[PROXY] Content-Type:', req.headers['content-type']);
          console.log('[PROXY] Content-Length:', req.headers['content-length']);
        }
      },
      // Configuration pour les fichiers
      // Le proxy doit transmettre le body brut sans le parser
      // http-proxy-middleware le fait par défaut, mais on s'assure que c'est bien le cas
    })
  );
};
