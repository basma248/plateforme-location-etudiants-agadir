// Wrapper pour npm start qui fonctionne avec Node.js 24
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Démarrage de l\'application React...');
console.log('');

// Variables d'environnement pour forcer la compatibilité
process.env.NODE_OPTIONS = '--max-old-space-size=4096 --no-warnings';
process.env.BROWSER = 'none';
process.env.PORT = '3000';
process.env.SKIP_PREFLIGHT_CHECK = 'true';
process.env.GENERATE_SOURCEMAP = 'false';
process.env.FAST_REFRESH = 'true';
process.env.DISABLE_ESLINT_PLUGIN = 'true';

// Chemin vers react-scripts
const reactScriptsPath = path.join(__dirname, 'node_modules', '.bin', 'react-scripts');
const isWindows = process.platform === 'win32';
const scriptPath = isWindows ? reactScriptsPath + '.cmd' : reactScriptsPath;

console.log('📦 Utilisation de react-scripts avec optimisations Node.js 24');
console.log('');

// Lancer react-scripts start
const child = spawn(scriptPath, ['start'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=4096 --no-warnings',
  }
});

child.on('error', (error) => {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
});

child.on('exit', (code) => {
  if (code !== 0) {
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


