// Serveur de développement personnalisé qui fonctionne avec Node.js 24
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('react-scripts/config/webpack.config');
const paths = require('react-scripts/config/paths');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Configuration pour forcer la compatibilité Node.js 24
process.env.NODE_OPTIONS = '--max-old-space-size=4096 --no-warnings --no-deprecation';
process.env.BROWSER = 'none';
process.env.PORT = process.env.PORT || '3000';
process.env.SKIP_PREFLIGHT_CHECK = 'true';
process.env.GENERATE_SOURCEMAP = 'false';
process.env.FAST_REFRESH = 'true';
process.env.DISABLE_ESLINT_PLUGIN = 'true';
process.env.WATCHPACK_POLLING = 'true';

console.log('🚀 Démarrage avec optimisations Node.js 24...');
console.log('');

// Chemin vers react-scripts
const reactScriptsPath = path.join(__dirname, 'node_modules', '.bin', 'react-scripts');
const isWindows = process.platform === 'win32';
const scriptPath = isWindows ? reactScriptsPath + '.cmd' : reactScriptsPath;

// Lancer react-scripts start avec les options optimisées
const child = spawn(scriptPath, ['start'], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

child.on('error', (error) => {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
});

child.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`❌ Processus terminé avec le code ${code}`);
    process.exit(code);
  }
});

// Gérer l'interruption
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  child.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
  process.exit(0);
});

