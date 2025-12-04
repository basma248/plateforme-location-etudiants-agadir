// Serveur de développement qui fonctionne vraiment avec Node.js 24
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Démarrage du serveur de développement...');
console.log('');

// Vérifier que react-scripts existe
const reactScriptsPath = path.join(__dirname, 'node_modules', '.bin', 'react-scripts');
const isWindows = process.platform === 'win32';
const scriptPath = isWindows ? reactScriptsPath + '.cmd' : reactScriptsPath;

if (!fs.existsSync(scriptPath)) {
  console.error('❌ react-scripts introuvable. Exécutez: npm install');
  process.exit(1);
}

// Configuration optimale pour Node.js 24
const env = {
  ...process.env,
  NODE_OPTIONS: '--max-old-space-size=4096 --no-warnings --no-deprecation',
  BROWSER: 'none',
  PORT: '3000',
  SKIP_PREFLIGHT_CHECK: 'true',
  GENERATE_SOURCEMAP: 'false',
  FAST_REFRESH: 'true',
  DISABLE_ESLINT_PLUGIN: 'true',
  WATCHPACK_POLLING: 'true',
  TSC_COMPILE_ON_ERROR: 'true',
  ESLINT_NO_DEV_ERRORS: 'true',
  // Force webpack à ne pas utiliser certaines fonctionnalités problématiques
  WEBPACK_DISABLE_OPTIMIZATIONS: 'true',
};

console.log('📦 Configuration:');
console.log('   - Node.js: ' + process.version);
console.log('   - Port: 3000');
console.log('   - Optimisations Node.js 24 activées');
console.log('');
console.log('⏳ Compilation en cours...');
console.log('   (Cela peut prendre 2-5 minutes)');
console.log('');

// Lancer react-scripts start avec shell: false pour éviter les warnings
// Mais utiliser cmd.exe directement sur Windows pour éviter les problèmes
let child;
if (isWindows) {
  // Sur Windows, utiliser cmd.exe pour lancer le .cmd
  child = spawn('cmd.exe', ['/c', scriptPath, 'start'], {
    stdio: 'inherit',
    env: env,
    cwd: __dirname,
  });
} else {
  child = spawn(scriptPath, ['start'], {
    stdio: 'inherit',
    shell: false,
    env: env,
    cwd: __dirname,
  });
}

let hasStarted = false;
let startTime = Date.now();
const TIMEOUT = 5 * 60 * 1000; // 5 minutes

// Timeout de sécurité
const timeout = setTimeout(() => {
  if (!hasStarted) {
    console.error('');
    console.error('❌ TIMEOUT: La compilation prend trop de temps.');
    console.error('');
    console.error('🔧 SOLUTION: Downgrade Node.js vers v20 LTS');
    console.error('   1. Télécharger: https://nodejs.org/ (version 20.x.x LTS)');
    console.error('   2. Installer (remplacer v24)');
    console.error('   3. npm install');
    console.error('   4. npm start');
    console.error('');
    child.kill();
    process.exit(1);
  }
}, TIMEOUT);

// Surveiller les sorties pour détecter quand le serveur démarre
child.stdout?.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Compiled') || output.includes('webpack compiled')) {
    hasStarted = true;
    clearTimeout(timeout);
    console.log('');
    console.log('✅ Compilation réussie !');
    console.log('🌐 Application disponible sur: http://localhost:3000');
    console.log('');
  }
});

child.stderr?.on('data', (data) => {
  const output = data.toString();
  // Ignorer les warnings de dépréciation
  if (!output.includes('DeprecationWarning') && !output.includes('DEP0')) {
    process.stderr.write(data);
  }
});

child.on('error', (error) => {
  clearTimeout(timeout);
  console.error('');
  console.error('❌ Erreur:', error.message);
  console.error('');
  console.error('🔧 SOLUTION: Vérifiez que react-scripts est installé: npm install');
  process.exit(1);
});

child.on('exit', (code, signal) => {
  clearTimeout(timeout);
  if (code !== 0 && code !== null) {
    console.error('');
    console.error(`❌ Processus terminé avec le code ${code || signal}`);
    if (!hasStarted) {
      console.error('');
      console.error('🔧 SOLUTION: Downgrade Node.js vers v20 LTS');
      console.error('   https://nodejs.org/ (version 20.x.x LTS)');
    }
    process.exit(code || 1);
  }
});

// Gérer l'interruption
process.on('SIGINT', () => {
  clearTimeout(timeout);
  console.log('\n🛑 Arrêt du serveur...');
  child.kill('SIGINT');
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

process.on('SIGTERM', () => {
  clearTimeout(timeout);
  child.kill('SIGTERM');
  process.exit(0);
});

