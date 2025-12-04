// Proxy pour rediriger les appels API vers Laravel
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy minimal - redirige /api vers http://127.0.0.1:8001/api
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:8001',
      changeOrigin: true,
      secure: false,
      logLevel: 'error', // Seulement les erreurs critiques
      onError: (err, req, res) => {
        console.error('[PROXY ERROR]', err.message);
        if (!res.headersSent) {
          res.status(500).json({
            error: 'Proxy error',
            message: 'Impossible de se connecter au serveur Laravel. Vérifiez qu\'il est démarré sur http://127.0.0.1:8001'
          });
        }
      },
    })
  );
};
