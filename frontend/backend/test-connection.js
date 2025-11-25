/**
 * Script de test de connexion à la base de données
 * Usage: node test-connection.js
 */

const { testConnection, query } = require('./config/database');

async function runTests() {
  console.log('🧪 Test de connexion à la base de données...\n');

  // Test 1: Connexion
  const isConnected = await testConnection();
  if (!isConnected) {
    console.log('❌ Impossible de se connecter. Vérifiez votre configuration.');
    process.exit(1);
  }

  console.log('');

  // Test 2: Vérifier les tables
  try {
    console.log('📊 Vérification des tables...');
    const tables = await query('SHOW TABLES');
    console.log(`✅ ${tables.length} tables trouvées:`);
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });
    console.log('');
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des tables:', error.message);
  }

  // Test 3: Compter les utilisateurs
  try {
    console.log('👥 Vérification des utilisateurs...');
    const [users] = await query('SELECT COUNT(*) as count FROM users');
    console.log(`✅ ${users.count} utilisateur(s) trouvé(s)`);
    console.log('');
  } catch (error) {
    console.error('❌ Erreur lors du comptage des utilisateurs:', error.message);
  }

  // Test 4: Vérifier l'admin
  try {
    console.log('👑 Vérification de l\'utilisateur admin...');
    const admins = await query(
      'SELECT id, nom, prenom, email, role FROM users WHERE role = ?',
      ['admin']
    );
    if (admins.length > 0) {
      console.log(`✅ ${admins.length} admin(s) trouvé(s):`);
      admins.forEach(admin => {
        console.log(`   - ${admin.nom} ${admin.prenom} (${admin.email})`);
      });
    } else {
      console.log('⚠️  Aucun admin trouvé. Exécutez: node scripts/createAdmin.js');
    }
    console.log('');
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de l\'admin:', error.message);
  }

  // Test 5: Compter les annonces
  try {
    console.log('🏠 Vérification des annonces...');
    const [annonces] = await query('SELECT COUNT(*) as count FROM annonces');
    console.log(`✅ ${annonces.count} annonce(s) trouvée(s)`);
    console.log('');
  } catch (error) {
    console.error('❌ Erreur lors du comptage des annonces:', error.message);
  }

  console.log('✅ Tous les tests sont terminés !');
  process.exit(0);
}

// Exécuter les tests
runTests().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});


