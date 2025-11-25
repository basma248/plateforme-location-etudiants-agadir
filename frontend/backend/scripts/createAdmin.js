/**
 * Script pour créer un utilisateur admin
 * Usage: node scripts/createAdmin.js
 */

const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdmin() {
  let connection;

  try {
    // Configuration de la connexion
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'plateforme_location_etudiants'
    });

    console.log('🔌 Connexion à la base de données...');

    // Données de l'admin
    const adminData = {
      nom: 'Admin',
      prenom: 'Système',
      email: 'admin@plateforme.ma',
      telephone: '+212 6 00 00 00 00',
      nom_utilisateur: 'admin',
      mot_de_passe: 'admin123', // ⚠️ À changer en production !
      type_utilisateur: 'loueur',
      role: 'admin',
      email_verifie: true
    };

    // Vérifier si l'admin existe déjà
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ? OR nom_utilisateur = ?',
      [adminData.email, adminData.nom_utilisateur]
    );

    if (existing.length > 0) {
      console.log('⚠️  L\'utilisateur admin existe déjà.');
      console.log('📧 Email:', adminData.email);
      console.log('👤 Nom d\'utilisateur:', adminData.nom_utilisateur);
      return;
    }

    // Hasher le mot de passe
    console.log('🔐 Hachage du mot de passe...');
    const hashedPassword = await bcrypt.hash(adminData.mot_de_passe, 10);

    // Insérer dans la base de données
    const [result] = await connection.execute(
      `INSERT INTO users (
        nom, prenom, email, telephone, nom_utilisateur, 
        mot_de_passe, type_utilisateur, role, email_verifie
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        adminData.nom,
        adminData.prenom,
        adminData.email,
        adminData.telephone,
        adminData.nom_utilisateur,
        hashedPassword,
        adminData.type_utilisateur,
        adminData.role,
        adminData.email_verifie
      ]
    );

    console.log('\n✅ Utilisateur admin créé avec succès !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', adminData.email);
    console.log('👤 Nom d\'utilisateur:', adminData.nom_utilisateur);
    console.log('🔑 Mot de passe:', adminData.mot_de_passe);
    console.log('👑 Rôle:', adminData.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  N\'OUBLIEZ PAS de changer le mot de passe en production !');
    console.log('');

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('⚠️  L\'utilisateur admin existe déjà.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('❌ Erreur d\'accès à la base de données.');
      console.error('   Vérifiez vos identifiants dans le fichier .env');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('❌ Base de données introuvable.');
      console.error('   Exécutez d\'abord: mysql -u root -p < database/schema.sql');
    } else {
      console.error('❌ Erreur:', error.message);
      console.error('   Code:', error.code);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Exécuter
if (require.main === module) {
  createAdmin()
    .then(() => {
      console.log('✅ Script terminé.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { createAdmin };


