// Script pour tester la compilation et identifier les fichiers problématiques
const fs = require('fs');
const path = require('path');

console.log('🔍 Test de compilation des fichiers...\n');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages');
const componentsDir = path.join(srcDir, 'components');

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Vérifications basiques
    const issues = [];
    
    // Vérifier les imports
    const importRegex = /import\s+.*\s+from\s+['"](.+?)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      // Vérifier les imports relatifs
      if (importPath.startsWith('.')) {
        const importFile = path.resolve(path.dirname(filePath), importPath);
        const possibleExtensions = ['', '.js', '.jsx', '.ts', '.tsx'];
        let found = false;
        for (const ext of possibleExtensions) {
          if (fs.existsSync(importFile + ext) || fs.existsSync(importFile + '/index.js')) {
            found = true;
            break;
          }
        }
        if (!found && !importPath.includes('css') && !importPath.includes('svg')) {
          issues.push(`Import manquant: ${importPath}`);
        }
      }
    }
    
    // Vérifier les exports
    if (!content.includes('export default') && !content.includes('export {')) {
      issues.push('Pas d\'export trouvé');
    }
    
    // Vérifier les hooks React
    if (content.includes('useEffect') || content.includes('useState')) {
      if (!content.includes('import') || !content.includes('react')) {
        issues.push('Hooks React utilisés mais React non importé');
      }
    }
    
    // Vérifier les erreurs de syntaxe basiques
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      issues.push(`Accolades non équilibrées: ${openBraces} ouvertes, ${closeBraces} fermées`);
    }
    
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      issues.push(`Parenthèses non équilibrées: ${openParens} ouvertes, ${closeParens} fermées`);
    }
    
    return issues;
  } catch (error) {
    return [`Erreur de lecture: ${error.message}`];
  }
}

function checkDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      checkDirectory(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Vérifier tous les fichiers
const allFiles = checkDirectory(srcDir);
let hasIssues = false;

console.log(`📁 ${allFiles.length} fichiers à vérifier\n`);

allFiles.forEach(file => {
  const relativePath = path.relative(srcDir, file);
  const issues = checkFile(file);
  
  if (issues.length > 0) {
    hasIssues = true;
    console.log(`❌ ${relativePath}`);
    issues.forEach(issue => {
      console.log(`   ⚠️  ${issue}`);
    });
    console.log('');
  } else {
    console.log(`✅ ${relativePath}`);
  }
});

if (!hasIssues) {
  console.log('\n✅ Aucun problème détecté dans les fichiers !');
  console.log('Le problème pourrait venir de :');
  console.log('  1. Webpack qui compile silencieusement (attendez 3-5 minutes)');
  console.log('  2. Un problème de cache');
  console.log('  3. Un problème avec les dépendances node_modules');
} else {
  console.log('\n⚠️  Des problèmes ont été détectés. Corrigez-les et réessayez.');
}


